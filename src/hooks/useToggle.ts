'use client';
import { useState } from 'react';

// hooks/useToggle.ts

// Requirements:
// - takes initialValue (boolean, default false)
// - returns [value, toggle, setTrue, setFalse]
// - toggle flips the boolean
// - setTrue always sets to true
// - setFalse always sets to false
// - TypeScript typed

// Usage example:
// const [isOpen, toggle, open, close] = useToggle(false);
// <button onClick={toggle}>Toggle</button>
// <button onClick={open}>Open</button>
// <button onClick={close}>Close</button>

function useToggle(initialValue: boolean = false) {
    const [value, setValue] = useState(initialValue);
    const toggle = () => setValue(!value);
    const setTrue = () => setValue(true);
    const setFalse = () => setValue(false);
    return [value, toggle, setTrue, setFalse] as const;
}
export default useToggle;