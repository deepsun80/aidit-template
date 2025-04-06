'use client';

interface ChatPromptProps {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function ChatPrompt({
  input,
  onInputChange,
  onSubmit,
  onCancel,
}: ChatPromptProps) {
  return (
    <div className='fixed bottom-8 left-1/2 transform -translate-x-1/2 w-full bg-white border border-gray-300 p-4 z-30 max-w-4xl shadow-md'>
      {/* Text Area */}
      <textarea
        className='w-full p-4 border border-gray-300 rounded-sm focus:outline-gray-400 bg-white text-gray-900'
        style={{ height: '12vh' }}
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder='Ask a question about any of your documents...'
      />

      {/* Footer Section */}
      <div className='flex justify-between items-center mt-8'>
        {/* Close Button */}
        <button
          type='button'
          className='px-4 py-2 bg-gray-200 text-gray-800 rounded-sm hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
          onClick={() => {
            onInputChange('');
            onCancel(); // Hide ChatPrompt
          }}
        >
          Close
        </button>

        {/* Submit Button */}
        <button
          type='submit'
          onClick={onSubmit}
          className='px-4 py-2 bg-gray-800 text-white rounded-sm hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Submit
        </button>
      </div>
    </div>
  );
}
