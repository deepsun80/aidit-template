'use client';

import { useState } from 'react';
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import { useQA } from '@/context/QAContext';

interface QuestionSelectorProps {
  questions: string[];
  onSelectionChange: (selectedQuestions: string[]) => void;
  onCancel: () => void;
  onSubmit: () => void;
  selectedFile?: string | null;
  setQuestions: (questions: string[]) => void;
}

export default function QuestionSelector({
  questions,
  setQuestions,
  onSelectionChange,
  onCancel,
  onSubmit,
  selectedFile,
}: QuestionSelectorProps) {
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [showConfirmDeleteAll, setShowConfirmDeleteAll] =
    useState<boolean>(false);

  const { deleteQuestions } = useQA();

  // Toggle selection for individual question
  const toggleQuestionSelection = (question: string) => {
    const updatedSelection = selectedQuestions.includes(question)
      ? selectedQuestions.filter((q) => q !== question)
      : [...selectedQuestions, question];

    setSelectedQuestions(updatedSelection);
    onSelectionChange(updatedSelection);
  };

  // Handle "Select All" toggle
  const handleSelectAll = () => {
    const newSelectAll = selectedQuestions.length !== questions.length;
    const updatedSelection = newSelectAll ? [...questions] : [];
    setSelectedQuestions(updatedSelection);
    onSelectionChange(updatedSelection);
  };

  // Handle editing a question
  const handleEditSubmit = () => {
    if (editIndex === null || editText.trim() === '') return;
    const updatedQuestions = [...questions];
    updatedQuestions[editIndex] = editText.trim();
    setQuestions(updatedQuestions);

    // If the question was selected, update the selectedQuestions as well
    if (selectedQuestions.includes(questions[editIndex])) {
      const updatedSelection = selectedQuestions.map((q) =>
        q === questions[editIndex] ? editText.trim() : q
      );
      setSelectedQuestions(updatedSelection);
      onSelectionChange(updatedSelection);
    }

    setEditIndex(null);
    setEditText('');
  };

  // Handle deleting a question
  const handleDelete = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);

    const updatedSelection = selectedQuestions.filter(
      (q) => q !== questions[index]
    );
    setSelectedQuestions(updatedSelection);
    onSelectionChange(updatedSelection);
  };

  return (
    <div className='bg-white text-gray-900 rounded-sm shadow p-4 max-w-4xl mx-auto mt-2'>
      {/* Sticky Header */}
      <div className='sticky top-0 bg-white border-b border-gray-300 pb-2 mb-2 pr-2 z-10 flex justify-between items-center'>
        <div className='flex gap-4 items-center'>
          <div className='text-md text-gray-700'>
            <p className='font-semibold text-gray-900 text-lg'>Questions</p>{' '}
            <p className='text-gray-700 text-sm'>from {selectedFile}</p>
          </div>
          {/* Trash Icon with Popover */}
          <div className='relative'>
            <button
              onClick={() => setShowConfirmDeleteAll((prev) => !prev)}
              className='w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700'
            >
              <TrashIcon className='w-4 h-4 text-white' />
            </button>

            {showConfirmDeleteAll && (
              <div className='absolute top-10 right-0 bg-white border border-gray-300 shadow-md rounded-sm p-3 z-10'>
                <p className='text-sm mb-2 text-gray-800'>
                  Delete all uploaded questions?
                </p>
                <div className='flex gap-2'>
                  <button
                    className='px-2 py-1 text-sm bg-gray-200 text-gray-800 rounded-sm hover:bg-gray-300'
                    onClick={() => setShowConfirmDeleteAll(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className='px-2 py-1 text-sm bg-gray-800 text-white rounded-sm hover:bg-gray-700'
                    onClick={() => {
                      deleteQuestions();
                      setShowConfirmDeleteAll(false);
                      onCancel();
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className='flex items-center gap-4'>
          {/* Select All */}
          <label className='flex items-center space-x-2 cursor-pointer'>
            <span className='text-gray-700'>Select All</span>
            <input
              type='checkbox'
              checked={selectedQuestions.length === questions.length}
              onChange={handleSelectAll}
              className='w-5 h-5 accent-gray-800'
            />
          </label>
        </div>
      </div>

      {/* Question List */}
      <div className='overflow-y-auto'>
        {questions.map((question, index) => (
          <div
            key={index}
            className='flex justify-between items-center py-2 pr-2 border-b border-gray-200 last:border-b-0 gap-2'
          >
            {/* Question text or editable textarea */}
            <div className='flex-1'>
              {editIndex === index ? (
                <textarea
                  className='w-full p-2 border border-gray-300 rounded-sm text-sm text-gray-800'
                  rows={2}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
              ) : (
                <p className='text-sm text-gray-800'>
                  {index + 1}. {question}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className='flex items-center gap-2'>
              {editIndex === index ? (
                <>
                  <button
                    className='px-2 py-1 text-sm bg-gray-200 text-gray-800 rounded-sm hover:bg-gray-300'
                    onClick={() => {
                      setEditIndex(null);
                      setEditText('');
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className='px-2 py-1 text-sm bg-gray-800 text-white rounded-sm hover:bg-gray-700'
                    onClick={handleEditSubmit}
                  >
                    Submit
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditIndex(index);
                      setEditText(question);
                    }}
                    className='w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700'
                  >
                    <Pencil1Icon className='w-4 h-4 text-white' />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className='w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700'
                  >
                    <TrashIcon className='w-4 h-4 text-white' />
                  </button>
                </>
              )}
              <input
                type='checkbox'
                checked={selectedQuestions.includes(question)}
                onChange={() => toggleQuestionSelection(question)}
                className='w-5 h-5 accent-gray-800'
              />
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Footer with Buttons */}
      <div className='sticky bottom-0 left-0 right-0 mt-2 bg-white border-t border-gray-200 p-4 flex justify-between z-10'>
        <button
          onClick={onCancel}
          className='px-4 py-2 bg-gray-500 text-white rounded-sm hover:bg-gray-600'
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className='px-4 py-2 bg-gray-800 text-white rounded-sm hover:bg-gray-700'
          disabled={selectedQuestions.length === 0}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
