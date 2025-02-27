'use client';

import { useState } from 'react';
import ChatUI from '@/components/chat-ui';

export default function Home() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }),
      });

      const data = await res.json();

      console.log('data', data.answer.content);
      setResponse(data.answer.content);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  console.log('response', response);

  return (
    <main className='min-h-screen p-8 bg-gray-100'>
      <ChatUI
        input={input}
        onInputChange={setInput}
        onSubmit={handleSubmit}
        response={response}
      />
    </main>
  );
}
