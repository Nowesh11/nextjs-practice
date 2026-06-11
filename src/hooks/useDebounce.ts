'use client';
import { useState, useEffect } from 'react';

// hooks/useDebounce.ts

// Requirements:
// - takes value (T) and delay (number, default 500)
// - returns debouncedValue
// - only updates after delay ms of no changes
// - cancels previous timer on new value
// - TypeScript generic <T>

function useDebounce<T>(value: T, delay: number = 500): T {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

export default useDebounce;