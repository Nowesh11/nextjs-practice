'use client';
import { useState, useEffect } from "react";

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

export default function TasksPage() {
  const [input, setInput] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error("Failed"); // ✅ check status
      const data = await res.json();
      setTasks(data.tasks);
    } catch {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!input || input.trim() === '') {
      setError('Task title is required');
      return;
    }

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // ✅ added
        body: JSON.stringify({ title: input }),
      });
      if (!res.ok) throw new Error("Failed"); // ✅ check status
      const data = await res.json();
      setTasks(prev => [...prev, data.task]);
      setInput('');
      setError(''); // clear any previous error
    } catch {
      setError('Failed to add task');
    }
  };

  const deleteTask = async (id: number) => {
    // optimistic — remove immediately
    setTasks(prev => prev.filter(t => t.id !== id));
    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'DELETE'
      });
    } catch {
      fetchTasks(); // revert if failed
      // ✅ no loading state needed
    }
  };

  if (loading) return (
    <p className="p-10 text-gray-500">Loading...</p>
  );

  if (error) return (
    <p className="p-10 text-red-500">{error}</p>
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Tasks
        </h1>

        {/* Add task */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Add a task..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addTask()}
            className="border border-gray-300 rounded px-3 py-2
                       flex-1 focus:outline-none focus:ring-2
                       focus:ring-blue-400"
          />
          <button
            onClick={addTask}
            className="bg-blue-500 text-white px-4 py-2 rounded
                       hover:bg-blue-600 transition-colors"
          >
            Add
          </button>
        </div>

        {/* Empty state */}
        {tasks.length === 0 && (
          <p className="text-center text-gray-400 py-8">
            No tasks yet — add one above!
          </p>
        )}

        {/* Task list */}
        <ul className="space-y-2">
          {tasks.map(task => (
            <li
              key={task.id}
              className="flex justify-between items-center
                         p-3 bg-white rounded-lg border
                         border-gray-100 shadow-sm"
            >
              <span className="text-gray-700">{task.title}</span>
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
      </div>
    </main>
  );
}