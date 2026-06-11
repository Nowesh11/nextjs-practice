'use client';
import { useState, useEffect } from 'react';

// hooks/useLocalStorage.ts

// Requirements:
// - takes a key (string) and initialValue (T)
// - returns [value, setValue] like useState
// - reads from localStorage on first render
// - saves to localStorage when value changes
// - TypeScript generic <T>

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  
    const [value, setValue] = useState<T>(()=>{
        try{
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        }catch(e){
            console.log(e);
            return initialValue;
        }
    });

    const saveValue = (value: T) => {
        try{
            setValue(value);
            window.localStorage.setItem(key, JSON.stringify(value));
        }catch(e){
            console.log(e);
        }
    };

    return [value, saveValue];
}

export default useLocalStorage;