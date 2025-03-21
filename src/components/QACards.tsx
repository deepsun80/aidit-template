'use client';

import { useState, useEffect, useRef } from 'react';
import { CaretUpIcon, CaretDownIcon } from '@radix-ui/react-icons';

interface QACardsProps {
  qaList: { question: string; answer: string }[];
}

export default function QACards({ qaList }: QACardsProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Open the first item of qaList on mount or when qaList updates
  useEffect(() => {
    if (qaList.length > 0) {
      setOpenIndexes([qaList.length - 1]);
    }
  }, [qaList]);

  // Scroll to the bottom when qaList updates
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [qaList]);

  return (
    <div className='max-w-4xl mx-auto flex flex-col text-gray-900 gap-4 mt-2'>
      <p className='text-lg font-semibold'>Selected Responses</p>
      {qaList.slice().map((qa, index) => (
        <div
          key={index}
          className='p-6 bg-white rounded-sm border border-gray-300 overflow-hidden'
        >
          <div className='flex justify-between items-center'>
            {/* Question */}
            <p className='font-semibold text-gray-900'>{qa.question}</p>

            {/* Toggle Button */}
            <button
              type='button'
              onClick={() => toggleAccordion(index)}
              className='text-gray-600 hover:text-gray-900 transition'
            >
              {openIndexes.includes(index) ? (
                <CaretUpIcon className='w-6 h-6' />
              ) : (
                <CaretDownIcon className='w-6 h-6' />
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

      {/* Invisible div to scroll into view */}
      <div ref={bottomRef} />
    </div>
  );
}
