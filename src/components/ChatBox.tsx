'use client';
import { useState } from 'react';

export default function ChatBox() {
  const [input, setInput] = useState('');
  const [reply, setReply] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    setReply('');
    setIsLoading(true);

    // Step 1 — fetch stream endpoint
    // Step 2 — get reader from res.body
    // Step 3 — loop reading chunks
    // Step 4 — decode and append to reply
    // Step 5 — stop loading when done
    try{
        const res = await fetch('/api/chat/stream', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({message: input }),
        });
        if(!res.ok) throw new Error('Failed');
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let done = false;
        while (!done) {
            const { value, done: doneReading } = await reader!.read();
            done = doneReading;
            const chunkValue = decoder.decode(value);
            setReply(prev => prev + chunkValue);
        }

    }
    catch(error){
        console.error(error);
    }
    finally{
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 max-w-md mx-auto">
      <div className="min-h-32 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
        {reply || 'Ask me anything...'}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          className="border border-gray-300 rounded-lg px-3 py-2 flex-1"
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}