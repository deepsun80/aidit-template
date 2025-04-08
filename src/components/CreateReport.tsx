/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

export default function CreateReport({
  setReport,
  onCancel,
}: {
  setReport: any;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState('');

  const handleSubmit = () => {
    if (title.trim()) {
      setReport({
        title: title.trim(),
        questions: null,
        qaList: [],
        selectedQuestions: [],
        selectedFile: null,
      });
      onCancel();
    }
  };

  return (
    <div className='max-w-xl mx-auto'>
      <h2 className='text-2xl font-semibold mb-6 text-gray-900'>
        Create Audit
      </h2>
      <div className='bg-white p-6 rounded shadow-sm border border-gray-200'>
        <label className='block mb-2 text-sm font-medium text-gray-700'>
          Title:
        </label>
        <input
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Enter report title'
          className='w-full px-4 py-2 border border-gray-300 rounded-sm text-gray-900 focus:outline-gray-400 mb-12'
        />
        <div className='flex justify-between'>
          <button
            onClick={onCancel}
            className='px-4 py-2 text-gray-700 bg-gray-200 rounded-sm hover:bg-gray-300 transition'
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 rounded-sm transition ${
              title.trim()
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
