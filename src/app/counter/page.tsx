'use client';
import { create } from 'zustand';

// ── Store Type ────────────────────────────────
type CounterStore = {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
};

// ── Create Store ──────────────────────────────
const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set(state => ({ count: state.count + 1 })),
  decrement: () => set(state => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

// ── CounterDisplay ────────────────────────────
function CounterDisplay() {
  const count = useCounterStore(state => state.count);

  // ✅ color based on value
  const color =
    count < 0 ? 'text-red-500' :
    count > 0 ? 'text-green-500' :
    'text-black';

  return (
    <div className="flex flex-col items-center gap-2">
      <p className={`text-6xl font-bold transition-colors ${color}`}>
        {count}
      </p>
      {/* status message */}
      {count < 0 && (
        <p className="text-red-400 text-sm">
          Count is negative!
        </p>
      )}
      {count > 0 && (
        <p className="text-green-400 text-sm">
          Count is positive!
        </p>
      )}
    </div>
  );
}

// ── CounterButtons ────────────────────────────
function CounterButtons() {
  const increment = useCounterStore(state => state.increment);
  const decrement = useCounterStore(state => state.decrement);
  const reset = useCounterStore(state => state.reset);

  return (
    <div className="flex gap-3">
      <button
        onClick={increment}
        className="bg-green-500 text-white px-6 py-3
                   rounded-lg hover:bg-green-600
                   transition-colors text-xl font-bold"
      >
        +
      </button>
      <button
        onClick={reset}
        className="bg-gray-500 text-white px-6 py-3
                   rounded-lg hover:bg-gray-600
                   transition-colors text-xl font-bold"
      >
        Reset
      </button>
      <button
        onClick={decrement}
        className="bg-red-500 text-white px-6 py-3
                   rounded-lg hover:bg-red-600
                   transition-colors text-xl font-bold"
      >
        -
      </button>
    </div>
  );
}

// ── Main Page ─────────────────────────────────
export default function CounterPage() {
  return (
    <main className="min-h-screen bg-gray-50
                     flex flex-col items-center
                     justify-center gap-8">
      <h1 className="text-3xl font-bold text-gray-800">
        Counter
      </h1>
      <CounterDisplay />
      <CounterButtons />
    </main>
  );
}