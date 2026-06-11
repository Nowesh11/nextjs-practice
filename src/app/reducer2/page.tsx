'use client';
import { useReducer, useState, useEffect, useMemo } from "react";

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

type State = {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  filter: 'all' | 'active' | 'completed';
  search: string;
};

type Action =
  | { type: 'FETCH_START' }                              // ✅ underscore
  | { type: 'FETCH_SUCCESS'; payload: Task[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SET_FILTER'; payload: State['filter'] }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: number }
  | { type: 'COMPLETE_TASK'; payload: number };

const initialState: State = {
  tasks: [],
  isLoading: false,
  error: null,
  filter: 'all',
  search: '',
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':                                   // ✅ fixed
      return { ...state, isLoading: true, error: null };

    case 'FETCH_SUCCESS':
      return { ...state, tasks: action.payload, isLoading: false };

    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload };

    case 'SET_FILTER':
      return { ...state, filter: action.payload };

    case 'SET_SEARCH':
      return { ...state, search: action.payload };

    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.id ? action.payload : t
        )
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(t => t.id !== action.payload)
      };

    case 'COMPLETE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload
            ? { ...t, completed: !t.completed }
            : t
        )
      };

    default:
      return state;
  }
}

export default function TaskPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [input, setInput] = useState('');

  // fetch on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ derived state — filter + search combined
  const filteredTasks = useMemo(() => {
    let result = state.tasks;

    // apply filter
    if (state.filter === 'active') {
      result = result.filter(t => !t.completed);
    } else if (state.filter === 'completed') {
      result = result.filter(t => t.completed);
    }

    // apply search
    if (state.search) {
      result = result.filter(t =>
        t.title.toLowerCase().includes(state.search.toLowerCase())
      );
    }

    return result;
  }, [state.tasks, state.filter, state.search]);

  const fetchTasks = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      dispatch({ type: 'FETCH_SUCCESS', payload: data.tasks });
    } catch {
      dispatch({ type: 'FETCH_ERROR', payload: 'Failed to fetch tasks' });
    }
  };

  const addTask = async () => {
    if (!input.trim()) return;
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // ✅
        body: JSON.stringify({ title: input }),           // ✅ use input
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      dispatch({ type: 'ADD_TASK', payload: data.task });
      setInput(''); // ✅ clear input
    } catch {
      dispatch({ type: 'FETCH_ERROR', payload: 'Failed to add task' });
    }
  };

  const deleteTask = async (id: number) => { // ✅ accepts id
    // optimistic update
    dispatch({ type: 'DELETE_TASK', payload: id });
    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' }); // ✅ dynamic id
    } catch {
      fetchTasks(); // revert on error
    }
  };

  const completeTask = async (id: number) => {
    dispatch({ type: 'COMPLETE_TASK', payload: id });
  };

  if (state.isLoading) return (
    <p className="p-10 text-gray-500">Loading...</p>
  );

  if (state.error) return (
    <p className="p-10 text-red-500">{state.error}</p>
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-4 py-10">

        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Tasks
        </h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search tasks..."
          value={state.search}
          onChange={e => dispatch({
            type: 'SET_SEARCH',
            payload: e.target.value
          })}
          className="border border-gray-300 rounded px-3 py-2
                     w-full mb-4 focus:outline-none focus:ring-2
                     focus:ring-blue-400"
        />

        {/* Add task */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Add a task..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
            className="border border-gray-300 rounded px-3 py-2
                       flex-1 focus:outline-none focus:ring-2
                       focus:ring-blue-400"
          />
          <button
            onClick={addTask}
            className="bg-blue-500 text-white px-4 py-2
                       rounded hover:bg-blue-600 transition-colors"
          >
            Add
          </button>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2 mb-6">
          {(['all', 'active', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => dispatch({ type: 'SET_FILTER', payload: f })}
              className={`px-4 py-2 rounded capitalize transition-colors ${
                state.filter === f
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Stats */}
        <p className="text-sm text-gray-500 mb-4">
          {filteredTasks.length} tasks shown
        </p>

        {/* Empty state */}
        {filteredTasks.length === 0 && (
          <p className="text-center text-gray-400 py-8">
            No tasks found
          </p>
        )}

        {/* Task list */}
        <ul className="space-y-2">
          {filteredTasks.map(task => (
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

      </div>
    </main>
  );
}