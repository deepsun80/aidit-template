'use client';

import { useGlobalError } from '@/context/GlobalErrorContext';

export default function GlobalError() {
  const { error, clearError } = useGlobalError();

  if (!error) return null;

  return (
    <div
      className='fixed bottom-4 left-4 px-4 py-2 bg-red-600 text-white rounded-lg shadow-lg z-50 cursor-pointer'
      role='alert'
      onClick={clearError}
    >
      {error}
    </div>
  );
}
