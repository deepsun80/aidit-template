'use client';

import { useState, useEffect } from 'react';
import ChatUI from '@/components/chat-ui';

export default function Home() {
  const [input, setInput] = useState('');
  const [qaList, setQaList] = useState<{ question: string; answer: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState<string | null>(null); // Error state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;

    setLoading(true); // Start loading
    setError(null); // Reset any previous error

    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }),
      });

      const data = await res.json();

      console.log('Debugging Frontend Response:', data);

      if (data.answer) {
        setQaList((prev) => [
          { question: data.question, answer: data.answer },
          ...prev,
        ]);
      }
    } catch (error) {
      setError('Something went wrong. Please try again later.'); // Set error message
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // Stop loading after request completes
    }
  };

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError(null); // Hide error after 3 seconds
      }, 3000);
      return () => clearTimeout(timeout); // Cleanup timeout if the component is unmounted
    }
  }, [error]);

  return (
    <main className='min-h-screen p-8 bg-gray-100'>
      <ChatUI
        input={input}
        onInputChange={setInput}
        onSubmit={handleSubmit}
        qaList={qaList}
        loading={loading}
      />

      {/* Error Popover */}
      {error && (
        <div
          className='fixed bottom-4 left-4 px-4 py-2 bg-red-600 text-white rounded-lg shadow-lg'
          role='alert'
        >
          <p>{error}</p>
        </div>
      )}
    </main>
  );
}
