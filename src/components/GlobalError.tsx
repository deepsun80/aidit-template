// components/GlobalError.tsx
'use client';

import { useEffect } from 'react';

interface GlobalErrorProps {
  error: string | null;
  onClear: () => void;
}

export default function GlobalError({ error, onClear }: GlobalErrorProps) {
  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => onClear(), 3000);
      return () => clearTimeout(timeout);
    }
  }, [error, onClear]);

  if (!error) return null;

  return (
    <div
      className='fixed bottom-4 left-4 px-4 py-2 bg-red-600 text-white rounded-lg shadow-lg z-70'
      role='alert'
    >
      <p>{error}</p>
    </div>
  );
}
