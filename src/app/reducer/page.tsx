'use client';
import { useReducer, useState } from "react";

type State = {
  count: number;
};

type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'RESET' }
  | { type: 'SET_COUNT'; payload: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return { count: 0 };
    case 'SET_COUNT':
      return { count: action.payload };
    default:
      return state;
  }
}

const initialState: State = { count: 0 };

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ✅ separate state for input
  // so user can type freely
  const [inputValue, setInputValue] = useState('');

  const countColor =
    state.count < 0 ? 'text-red-500' :
    state.count > 0 ? 'text-green-500' :
    'text-black';

  const handleSet = () => {
    const num = Number(inputValue);
    if (!isNaN(num)) {              // ✅ only if valid number
      dispatch({ type: 'SET_COUNT', payload: num });
      setInputValue('');            // ✅ clear input after set
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 mt-10">

      {/* Count display */}
      <p className={`text-6xl font-bold ${countColor}`}>
        {state.count}
      </p>

      {/* +/-/Reset buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => dispatch({ type: 'INCREMENT' })}
          className="bg-green-500 text-white px-6 py-3
                     rounded-lg hover:bg-green-600 transition-colors text-xl"
        >
          +
        </button>

        <button
          onClick={() => dispatch({ type: 'RESET' })}
          className="bg-gray-500 text-white px-6 py-3
                     rounded-lg hover:bg-gray-600 transition-colors text-xl"
        >
          Reset
        </button>

        <button
          onClick={() => dispatch({ type: 'DECREMENT' })}
          className="bg-red-500 text-white px-6 py-3
                     rounded-lg hover:bg-red-600 transition-colors text-xl"
        >
          -
        </button>
      </div>

      {/* Set count row */}
      <div className="flex gap-3 items-center">
        <input
          type="number"
          value={inputValue}              // ✅ own state
          onChange={e => setInputValue(e.target.value)} // ✅ free typing
          placeholder="Enter number..."
          className="border border-gray-300 rounded px-3 py-2
                     text-xl w-40 focus:outline-none
                     focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSet}             // ✅ dispatch only on click
          className="bg-blue-500 text-white px-6 py-3
                     rounded-lg hover:bg-blue-600 transition-colors text-xl"
        >
          Set
        </button>
      </div>

      {/* Status messages */}
      {state.count < 0 && (
        <p className="text-red-400 text-sm">
          Count is negative!
        </p>
      )}
    </div>
  );
}