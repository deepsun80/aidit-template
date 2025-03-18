'use client';

import { useState } from 'react';

interface QuestionSelectorProps {
  questions: string[];
  onSelectionChange: (selectedQuestions: string[]) => void;
}

export default function QuestionSelector({
  questions,
  onSelectionChange,
}: QuestionSelectorProps) {
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

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
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    const updatedSelection = newSelectAll ? [...questions] : [];
    setSelectedQuestions(updatedSelection);
    onSelectionChange(updatedSelection);
  };

  return (
    <div className='bg-white text-gray-900 rounded-sm shadow p-4 max-w-4xl mx-auto mt-4'>
      {/* Header */}
      <div className='flex justify-between items-center border-b border-gray-300 pb-2 mb-2 pr-6'>
        <p className='font-semibold text-lg'>Questions</p>
        <label className='flex items-center space-x-2 cursor-pointer'>
          <span className='text-gray-700'>Select All</span>
          <input
            type='checkbox'
            checked={selectAll}
            onChange={handleSelectAll}
            className='w-5 h-5 accent-gray-800'
          />
        </label>
      </div>

      {/* Question List */}
      <div className='max-h-[65vh] overflow-y-auto'>
        {questions?.map((question, index) => {
          return (
            <div
              key={index}
              className='flex justify-between items-center py-2 pr-2 border-b border-gray-200 last:border-b-0'
            >
              <p className='text-sm text-gray-800'>
                {index + 1}. {question}
              </p>
              <input
                type='checkbox'
                checked={selectedQuestions.includes(question)}
                onChange={() => toggleQuestionSelection(question)}
                className='w-5 h-5 accent-gray-800'
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
