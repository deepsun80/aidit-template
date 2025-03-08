'use client';

import { useState } from 'react';
import {
  PaperPlaneIcon,
  CaretUpIcon,
  CaretDownIcon,
} from '@radix-ui/react-icons';

interface ChatUIProps {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  qaList: { question: string; answer: string }[];
  loading: boolean;
}

export default function ChatUI({
  input,
  onInputChange,
  onSubmit,
  qaList,
  loading,
}: ChatUIProps) {
  // Track which questions are expanded
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleAccordion = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className='max-w-4xl mx-auto flex flex-col min-h-screen text-gray-900 gap-8'>
      <div className='flex-1 space-y-4 overflow-y-auto'>
        {/* Response Section */}
        {qaList
          .slice()
          .reverse()
          .map((qa, index) => (
            <div
              key={index}
              className='p-6 bg-white rounded-2xl shadow-sm overflow-hidden'
            >
              <div className='flex justify-between items-center'>
                {/* Question */}
                <p className='font-semibold text-gray-900'>{qa.question}</p>

                {/* Toggle Button */}
                <button
                  onClick={() => toggleAccordion(index)}
                  className='text-gray-600 hover:text-gray-900 transition'
                >
                  {openIndexes.includes(index) ? (
                    <CaretUpIcon className='w-8 h-8' />
                  ) : (
                    <CaretDownIcon className='w-8 h-8' />
                  )}
                </button>
              </div>

              {/* Animated Answer Section */}
              <div
                className={`transition-all duration-300 ease-in-out ${
                  openIndexes.includes(index)
                    ? 'max-h-96 opacity-100'
                    : 'max-h-0 opacity-0 overflow-hidden'
                }`}
              >
                <div className='border-t border-gray-300 my-4'></div>
                <pre className='whitespace-pre-wrap break-words text-sm text-gray-700'>
                  {qa.answer}
                </pre>
              </div>
            </div>
          ))}

        {/* Loading Indicator */}
        {loading && (
          <div className='flex justify-center items-center mt-4'>
            <div className='w-10 h-10 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin'></div>
            <span className='ml-2 text-gray-700 text-sm'>Processing...</span>
          </div>
        )}
      </div>

      {/* Chat Input Section */}
      <form
        onSubmit={onSubmit}
        className='flex items-center p-4 gap-4 rounded-2xl bottom-0 bg-white sticky'
        style={{ width: '100%' }}
      >
        <textarea
          disabled={loading}
          className={`flex-1 p-4 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 bg-white ${
            loading ? 'text-gray-300' : 'text-gray-900'
          }`}
          style={{ height: '10vh' }}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder='Ask something...'
        />
        <button
          type='submit'
          className='p-3 bg-gray-900 text-white rounded-full shadow-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
          disabled={loading}
        >
          <PaperPlaneIcon className='w-5 h-5' />
        </button>
      </form>
    </div>
  );
}
