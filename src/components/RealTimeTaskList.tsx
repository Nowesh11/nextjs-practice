'use client';
import { useState, useEffect } from 'react';
import pusherClient from '@/lib/pusher-client';

type Task = {
  id: number;
  title: string;
  completed: boolean;
  priority: string;
};

export default function RealTimeTaskList({
  userId
}: {
  userId: string
}) {
  const [tasks, setTasks] = useState<Task[]>([]);

  // fetch initial tasks
  useEffect(() => {
    fetch('/api/tasks')
      .then(r => r.json())
      .then(data => setTasks(data.tasks));
  }, []);

  // subscribe to pusher
  useEffect(() => {
    // ✅ backticks!
    const channel = pusherClient.subscribe(`tasks-${userId}`);

    // ✅ correct data type
    channel.bind('tasks-created', (data: { task: Task }) => {
      setTasks(prev => [data.task, ...prev]);
      // newest task at top ✅
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(`tasks-${userId}`);
    };
  }, [userId]);

  return (
    <ul className="space-y-2 mt-4">
      {tasks.length === 0 && (
        <p className="text-gray-400 text-center py-4">
          No tasks yet!
        </p>
      )}
      {tasks.map(task => (
        <li
          key={task.id}
          className="p-3 bg-white rounded-lg border
                     border-gray-100 shadow-sm
                     flex justify-between items-center"
        >
          <span className="text-gray-700">{task.title}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            task.priority === 'high'
              ? 'bg-red-100 text-red-700'
              : task.priority === 'medium'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-green-100 text-green-700'
          }`}>
            {task.priority}
          </span>
        </li>
      ))}
    </ul>
  );
}