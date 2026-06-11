'use client';
import { useState } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query';

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

// fetch function outside component
const fetchTasks = async (): Promise<Task[]> => {
  const res = await fetch('/api/tasks');
  if (!res.ok) throw new Error('Failed to fetch');
  const data = await res.json();
  return data.tasks; // ✅ return just the array
};

export default function TaskPage() {
  const [input, setInput] = useState('');
  const queryClient = useQueryClient();

  // ── READ ─────────────────────────────────
  const { data, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  // ── ADD ──────────────────────────────────
  const addTask = useMutation({
    mutationFn: async (title: string) => { // ✅ string not Task
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }), // ✅ just title
      });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setInput(''); // ✅ clear in onSuccess
    }
  });

  // ── DELETE ───────────────────────────────
  const deleteTask = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  // ── States ───────────────────────────────
  if (isLoading) return (
    <p className="p-10 text-gray-500 text-center">
      Loading...
    </p>
  );

  if (error) return (
    <p className="p-10 text-red-500 text-center">
      Failed to fetch tasks
    </p>
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
            onKeyDown={e => e.key === 'Enter' && addTask.mutate(input)}
            className="border border-gray-300 rounded px-3 py-2
                       flex-1 focus:outline-none focus:ring-2
                       focus:ring-blue-400"
          />
          <button
            onClick={() => {
              if (!input.trim()) return; // ✅ validate
              addTask.mutate(input);     // ✅ just string
            }}
            disabled={addTask.isPending}
            className="bg-blue-500 text-white px-4 py-2 rounded
                       hover:bg-blue-600 transition-colors
                       disabled:opacity-50"
          >
            {addTask.isPending ? 'Adding...' : 'Add'}
          </button>
        </div>

        {/* Empty state */}
        {!data || data.length === 0 ? ( // ✅ safe check
          <p className="text-center text-gray-400 py-8">
            No tasks yet — add one above!
          </p>
        ) : (
          // ✅ ul outside, li inside map
          <ul className="space-y-2">
            {data.map(task => (
              <li
                key={task.id} // ✅ key on li
                className="flex justify-between items-center
                           p-3 bg-white rounded-lg border
                           border-gray-100 shadow-sm"
              >
                <span className={`text-gray-700 ${
                  task.completed ? 'line-through text-gray-400' : ''
                }`}>
                  {task.title}
                </span>

                <button
                  onClick={() => deleteTask.mutate(task.id)}
                  disabled={deleteTask.isPending}
                  className="text-red-500 hover:text-red-700
                             text-sm transition-colors
                             disabled:opacity-50"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

      </div>
    </main>
  );
}