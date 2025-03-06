'use client';

import { useState } from 'react';
import ChatUI from '@/components/chat-ui';

export default function Home() {
  const [input, setInput] = useState('');
  const [qaList, setQaList] = useState<{ question: string; answer: string }[]>(
    []
  );

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

      console.log('Debugging Frontend Response:', data);

      if (data.answer) {
        // Prepend the new question-answer pair to the list
        setQaList((prev) => [
          { question: data.question, answer: data.answer },
          ...prev,
        ]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  console.log('qaList', qaList);

  return (
    <main className='min-h-screen p-8 bg-gray-100'>
      <ChatUI
        input={input}
        onInputChange={setInput}
        onSubmit={handleSubmit}
        qaList={qaList}
      />
    </main>
  );
}
