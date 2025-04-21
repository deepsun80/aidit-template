'use client';

import { useState } from 'react';
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';

interface QuestionSelectorProps {
  questions: { question: string; reference?: string }[];
  onSelectionChange: (selectedQuestions: string[]) => void;
  onCancel: () => void;
  onSubmit: () => void;
  selectedFile?: string | null;
  setQuestions: (questions: { question: string; reference?: string }[]) => void;
  deleteQuestions: () => void;
  disableCancel?: boolean;
}

export default function QuestionSelector({
  questions,
  setQuestions,
  onSelectionChange,
  onCancel,
  onSubmit,
  selectedFile,
  deleteQuestions,
  disableCancel = true,
}: QuestionSelectorProps) {
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [showConfirmDeleteAll, setShowConfirmDeleteAll] =
    useState<boolean>(false);

  const toggleQuestionSelection = (fullQuestion: string) => {
    const updatedSelection = selectedQuestions.includes(fullQuestion)
      ? selectedQuestions.filter((q) => q !== fullQuestion)
      : [...selectedQuestions, fullQuestion];

    setSelectedQuestions(updatedSelection);
    onSelectionChange(updatedSelection);
  };

  const handleSelectAll = () => {
    const fullQuestions = questions.map(
      (q) => `${q.question}${q.reference ? ` - ${q.reference}` : ''}`
    );
    const allSelected = selectedQuestions.length === fullQuestions.length;
    const updatedSelection = allSelected ? [] : fullQuestions;
    setSelectedQuestions(updatedSelection);
    onSelectionChange(updatedSelection);
  };

  const handleEditSubmit = () => {
    if (editIndex === null || editText.trim() === '') return;
    const updatedQuestions = [...questions];
    updatedQuestions[editIndex] = {
      ...updatedQuestions[editIndex],
      question: editText.trim(),
    };
    setQuestions(updatedQuestions);

    const fullEdited = `${editText.trim()}${
      updatedQuestions[editIndex].reference
        ? ` - ${updatedQuestions[editIndex].reference}`
        : ''
    }`;

    const oldFull = `${questions[editIndex].question}${
      questions[editIndex].reference
        ? ` - ${questions[editIndex].reference}`
        : ''
    }`;

    if (selectedQuestions.includes(oldFull)) {
      const updatedSelection = selectedQuestions.map((q) =>
        q === oldFull ? fullEdited : q
      );
      setSelectedQuestions(updatedSelection);
      onSelectionChange(updatedSelection);
    }

    setEditIndex(null);
    setEditText('');
  };

  const handleDelete = (index: number) => {
    const fullToDelete = `${questions[index].question}${
      questions[index].reference ? ` - ${questions[index].reference}` : ''
    }`;
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);

    const updatedSelection = selectedQuestions.filter(
      (q) => q !== fullToDelete
    );
    setSelectedQuestions(updatedSelection);
    onSelectionChange(updatedSelection);
  };

  return (
    <div className='max-w-4xl mx-auto text-gray-900 flex flex-col gap-4'>
      <p className='font-semibold text-lg'>Uploaded File Questions</p>
      <div className='bg-white rounded-sm border border-gray-300 p-6'>
        {/* Sticky Header */}
        <div className='sticky top-0 bg-white border-b border-gray-300 pb-4 mb-2 pr-2 z-10 flex justify-between items-center'>
          <div className='flex gap-4 items-center'>
            <div className='text-md text-gray-700'>
              <p className='text-sm font-semibold'>
                File:{' '}
                <span className='text-gray-500 italic font-normal'>
                  {selectedFile}
                </span>
              </p>
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

        {/* Question List */}
        <div className='overflow-y-auto'>
          {questions.map((q, index) => {
            const fullText = `${q.question}${
              q.reference ? ` - ${q.reference}` : ''
            }`;
            return (
              <div
                key={index}
                className='flex justify-between items-center py-2 pr-2 border-b border-gray-200 last:border-b-0 gap-2'
              >
                <div className='flex-1'>
                  {editIndex === index ? (
                    <textarea
                      className='w-full p-2 border border-gray-300 rounded-sm text-sm text-gray-800'
                      rows={2}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                  ) : (
                    <>
                      <p className='text-sm text-gray-800 font-semibold'>
                        {index + 1}. {q.question}
                      </p>
                      {q.reference && (
                        <p className='text-sm text-gray-500 italic mt-1'>
                          Standard Reference: {q.reference}
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* Actions */}
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
                          setEditText(q.question);
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
                    checked={selectedQuestions.includes(fullText)}
                    onChange={() => toggleQuestionSelection(fullText)}
                    className='w-5 h-5 accent-gray-800'
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className='sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-2 pt-8 flex justify-between z-10'>
          <button
            onClick={onCancel}
            className='px-4 py-2 bg-gray-500 text-white rounded-sm hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={disableCancel}
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
    </div>
  );
}
