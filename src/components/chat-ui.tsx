/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { PaperPlaneIcon } from '@radix-ui/react-icons';

interface ChatUIProps {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  response: any;
}

export default function ChatUI({
  input,
  onInputChange,
  onSubmit,
  response,
}: ChatUIProps) {
  return (
    <div className='max-w-4xl mx-auto flex flex-col min-h-screen text-gray-900 gap-8'>
      <div className='flex-1 space-y-8 overflow-y-auto'>
        {/* Response Section */}
        {response && (
          <div className='p-6 bg-white rounded-2xl shadow-sm overflow-auto'>
            {/* Question */}
            <p className='font-semibold text-gray-900'>{response.question}</p>

            {/* Elegant Divider */}
            <div className='border-t border-gray-300 my-4'></div>

            {/* Answer */}
            <pre className='whitespace-pre-wrap break-words text-sm text-gray-700'>
              {response.answer}
            </pre>
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
          className='flex-1 p-4 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 bg-white text-gray-900'
          style={{ height: '10vh' }}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder='Ask something...'
        />
        <button
          type='submit'
          className='p-3 bg-gray-900 text-white rounded-full shadow-md hover:bg-gray-700'
        >
          <PaperPlaneIcon className='w-5 h-5' />
        </button>
      </form>
    </div>
  );
}
