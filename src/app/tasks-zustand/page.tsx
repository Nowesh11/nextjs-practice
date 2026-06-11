'use client';
import { create } from 'zustand';
import { useEffect, useState } from 'react';

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

type TaskStore = {
  task: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (title: string) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  completeTask: (id: number) => void;
};

// ── Store ─────────────────────────────────────
const useTaskStore = create<TaskStore>((set) => ({
  task: [],
  isLoading: false,
  error: null,

  // ✅ fetchTasks — logic INSIDE store
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      set({ task: data.tasks, isLoading: false });
    } catch {
      set({ error: 'Failed to fetch tasks', isLoading: false });
    }
  },

  // ✅ addTask — logic INSIDE store
  addTask: async (title: string) => {
    if (!title.trim()) return;
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      set(state => ({
        task: [...state.task, data.task]
      }));
    } catch {
      set({ error: 'Failed to add task' });
    }
  },

  // ✅ deleteTask — logic INSIDE store
  deleteTask: async (id: number) => {
    // optimistic update
    set(state => ({
      task: state.task.filter(t => t.id !== id)
    }));
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    } catch {
      set({ error: 'Failed to delete task' });
    }
  },

  // ✅ completeTask — logic INSIDE store
  completeTask: (id: number) => {
    set(state => ({
      task: state.task.map(t =>
        t.id === id
          ? { ...t, completed: !t.completed }
          : t
      )
    }));
  },
}));

// ── TaskStats ─────────────────────────────────
function TaskStats() {
  const tasks = useTaskStore(state => state.task);
  const completed = tasks.filter(t => t.completed).length;

  return (
    <div className="flex gap-6 p-4 bg-white rounded-lg
                    border border-gray-100 shadow-sm">
      <div className="text-center">
        <p className="text-3xl font-bold text-gray-800">
          {tasks.length}
        </p>
        <p className="text-sm text-gray-500">Total</p>
      </div>
      <div className="text-center">
        <p className="text-3xl font-bold text-green-500">
          {completed}
        </p>
        <p className="text-sm text-gray-500">Completed</p>
      </div>
      <div className="text-center">
        <p className="text-3xl font-bold text-blue-500">
          {tasks.length - completed}
        </p>
        <p className="text-sm text-gray-500">Remaining</p>
      </div>
    </div>
  );
}

// ── AddTaskForm ───────────────────────────────
function AddTaskForm() {
  const [input, setInput] = useState('');
  const addTask = useTaskStore(state => state.addTask);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    addTask(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Add a task..."
        className="border border-gray-300 rounded px-3 py-2
                   flex-1 focus:outline-none focus:ring-2
                   focus:ring-blue-400"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2
                   rounded hover:bg-blue-600 transition-colors"
      >
        Add
      </button>
    </form>
  );
}

// ── TaskList ──────────────────────────────────
function TaskList() {
  const tasks = useTaskStore(state => state.task);
  const isLoading = useTaskStore(state => state.isLoading);
  const error = useTaskStore(state => state.error);
  const completeTask = useTaskStore(state => state.completeTask);
  const deleteTask = useTaskStore(state => state.deleteTask);

  if (isLoading) return (
    <p className="text-center text-gray-500 py-8">Loading...</p>
  );

  if (error) return (
    <p className="text-center text-red-500 py-8">{error}</p>
  );

  if (tasks.length === 0) return (
    <p className="text-center text-gray-400 py-8">
      No tasks yet — add one above!
    </p>
  );

  return (
    <ul className="space-y-2">
      {tasks.map(task => (
        <li
          key={task.id}
          className="flex justify-between items-center
                     p-3 bg-white rounded-lg border
                     border-gray-100 shadow-sm"
        >
          <span
            onClick={() => completeTask(task.id)}
            className={`cursor-pointer ${
              task.completed
                ? 'line-through text-gray-400'
                : 'text-gray-700'
            }`}
          >
            {task.title}
          </span>

          <button
            onClick={() => deleteTask(task.id)}
            className="text-red-500 hover:text-red-700
                       text-sm transition-colors"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

// ── TaskPage ──────────────────────────────────
export default function TaskPage() {
  // ✅ get fetchTasks from store
  const fetchTasks = useTaskStore(state => state.fetchTasks);

  // ✅ call on mount — simple!
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Tasks
        </h1>
        <div className="flex flex-col gap-6">
          <TaskStats />
          <AddTaskForm />
          <TaskList />
        </div>
      </div>
    </main>
  );
}