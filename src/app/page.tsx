'use client';

import { useState } from 'react';
import ChatUI from '@/components/chat-ui';

export default function Home() {
  const [input, setInput] = useState('');
  const [qaList, setQaList] = useState<{ question: string; answer: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false); // Track loading state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;

    setLoading(true); // Start loading

    try {
      const res = await fetch('/api/query/test', {
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
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // Stop loading after request completes
    }
  };

  return (
    <main className='min-h-screen p-8 bg-gray-100'>
      <ChatUI
        input={input}
        onInputChange={setInput}
        onSubmit={handleSubmit}
        qaList={qaList}
        loading={loading}
      />
    </main>
  );
}
