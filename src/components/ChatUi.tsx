'use client';

import { useState, useEffect, useRef } from 'react';
import {
  PaperPlaneIcon,
  CaretUpIcon,
  CaretDownIcon,
  UploadIcon,
} from '@radix-ui/react-icons';

interface ChatUIProps {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onFileSelect: (file: File | null) => void;
  qaList: { question: string; answer: string }[];
  loading: boolean;
}

export default function ChatUI({
  input,
  onInputChange,
  onSubmit,
  onFileSelect,
  qaList,
  loading,
}: ChatUIProps) {
  // Track which questions are expanded
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Open the first item of qaList on mount or when qaList updates
  useEffect(() => {
    if (qaList.length > 0) {
      setOpenIndexes([0]); // Open the first item (index 0)
    }
  }, [qaList]);

  const toggleAccordion = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleUploadClick = () => {
    if (!loading) fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    // Validate that only PDF files are accepted
    if (file && file.type !== 'application/pdf') {
      alert('Only PDF files are allowed.');
      return;
    }

    // Pass the selected file to the parent component
    onFileSelect(file);
  };

  return (
    <div className='max-w-4xl mx-auto flex flex-col text-gray-900 gap-8'>
      <div className='flex-1 space-y-4 overflow-y-auto min-h-[70vh]'>
        {/* Response Section */}
        {qaList
          .slice()
          // .reverse()
          .map((qa, index) => (
            <div
              key={index}
              className='p-6 bg-white rounded-sm shadow-sm overflow-hidden'
            >
              <div className='flex justify-between items-center'>
                {/* Question */}
                <p className='font-semibold text-gray-900'>{qa.question}</p>

                {/* Toggle Button */}
                <button
                  type='button'
                  onClick={() => toggleAccordion(index)}
                  className='text-gray-600 hover:text-gray-900 transition'
                  disabled={loading}
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
      </div>

      {/* Chat Input Section */}
      <form
        onSubmit={onSubmit}
        className='flex items-center p-4 gap-4 rounded-sm bottom-0 bg-white sticky shadow-[0_-2px_5px_rgba(0,0,0,0.1)]'
        style={{ width: '100%' }}
      >
        <textarea
          disabled={loading}
          className={`flex-1 p-4 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 bg-white ${
            loading ? 'text-gray-300' : 'text-gray-900'
          }`}
          style={{ height: '10vh' }}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder='Ask something...'
        />

        {/* Button Container - Stack Buttons Vertically */}
        <div className='flex flex-col items-center gap-2'>
          {/* Submit Button */}
          <button
            type='submit'
            className='p-3 bg-gray-800 text-white rounded-full shadow-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={loading}
          >
            <PaperPlaneIcon className='w-4 h-4' />
          </button>

          {/* Upload Button */}
          <button
            type='button'
            onClick={handleUploadClick}
            className='p-3 bg-gray-800 text-white rounded-full shadow-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={loading}
          >
            <UploadIcon className='w-5 h-5' />
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          type='file'
          ref={fileInputRef}
          accept='.pdf'
          className='hidden'
          onChange={handleFileChange}
        />
      </form>
    </div>
  );
}
