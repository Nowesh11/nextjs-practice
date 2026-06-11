'use client';
import { useState } from 'react';

export default function CheckoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    // Step 1 — set loading
    setIsLoading(true);
    try{
        const res = await fetch('/api/stripe/checkout',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });
        if(!res.ok) throw new Error('Failed');
        const data = await res.json();
        window.location.href = data.url;
    }catch{
        setError('Failed to checkout');
    }
    finally{
        setIsLoading(false);
    }
  };
  

  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleCheckout}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Checkout'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
    
   
  );
}