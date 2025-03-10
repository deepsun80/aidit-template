'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import ChatUI from '@/components/ChatUi';

export default function Home() {
  const { data: session, status } = useSession();

  const [input, setInput] = useState('');
  const [qaList, setQaList] = useState<{ question: string; answer: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || loading) return;

    setLoading(true);
    setError(null);

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
      setError('Something went wrong. Please try again later.');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  // **Show loading state if session is still being checked**
  if (status === 'loading') {
    return <p className='text-center text-lg font-medium'>Loading...</p>;
  }

  // **Require authentication**
  if (!session) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
        <p className='text-md mb-4 text-gray-900 '>
          You must be signed in to access this page.
        </p>
        <button
          onClick={() => signIn('google')}
          className='px-6 py-2 bg-gray-900 text-white rounded-sm hover:bg-gray-700'
        >
          Sign In with Google
        </button>
      </div>
    );
  }

  return (
    <main className='min-h-screen p-8 bg-gray-100'>
      {/* Sign Out Button */}
      <div className='flex justify-end mb-4'>
        <button
          onClick={() => signOut()}
          className='px-4 py-2 bg-gray-900 text-white rounded-sm hover:bg-gray-700'
        >
          Sign Out
        </button>
      </div>

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
