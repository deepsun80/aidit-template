/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  CaretUpIcon,
  CaretDownIcon,
  Pencil1Icon,
  TrashIcon,
  DownloadIcon,
} from '@radix-ui/react-icons';

interface QACardsProps {
  qaList: { question: string; answer: string }[];
  onEdit: (index: number, newAnswer: string) => void;
  onDelete: (index: number) => void;
  notFoundCount: number;
  showOnlyNotFound: boolean;
  setShowOnlyNotFound: (val: boolean) => void;
  onDownload: () => void;
}

export default function QACards({
  qaList,
  onEdit,
  onDelete,
  notFoundCount,
  showOnlyNotFound,
  setShowOnlyNotFound,
  onDownload,
}: QACardsProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(
    null
  );

  const bottomRef = useRef<HTMLDivElement | null>(null);

  /** Responses Not Found color calculation */
  const totalCount = qaList.length;
  const notFoundPercentage =
    totalCount > 0 ? (notFoundCount / totalCount) * 100 : 0;

  const countColor =
    notFoundPercentage <= 25
      ? 'text-gray-800'
      : notFoundPercentage <= 50
      ? 'text-orange-500'
      : 'text-red-600';
  /** --- */

  /** Used for Responses Not Found filter function */
  const filteredList = showOnlyNotFound
    ? qaList.filter((qa) => {
        const lastLine = qa.answer.trim().split('\n').slice(-1)[0];
        return lastLine.toLowerCase().includes('found in context: false');
      })
    : qaList;

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
      <p className='text-lg font-semibold'>Audit Stored Responses</p>
      <div className='flex justify-between items-center'>
        <p className='text-gray-700'>
          Responses Not Found:{' '}
          <span className={`font-semibold ${countColor}`}>
            {notFoundCount} out of {qaList.length}
          </span>
        </p>
        <div className='flex items-center gap-4'>
          {/* View toggle */}
          <div className='flex items-center gap-2'>
            <label htmlFor='toggle-not-found' className='text-gray-700 text-sm'>
              View Responses Not Found
            </label>
            <div className='relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in'>
              <input
                type='checkbox'
                name='toggle-not-found'
                id='toggle-not-found'
                checked={showOnlyNotFound}
                onChange={() => setShowOnlyNotFound(!showOnlyNotFound)}
                className='toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer z-10 left-0 top-0 transition-all duration-200 ease-in-out checked:translate-x-full checked:border-gray-700'
              />
              <label
                htmlFor='toggle-not-found'
                className='toggle-label block overflow-hidden h-6 rounded-full bg-gray-400 cursor-pointer'
              />
            </div>
          </div>

          {/* Download button */}
          <button
            onClick={onDownload}
            className='w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700'
            disabled={qaList.length === 0}
            title='Download PDF'
          >
            <DownloadIcon className='w-4 h-4 text-white' />
          </button>
        </div>
      </div>
      {filteredList.map((qa: any, index: number) => {
        const isNotFound = qa.answer
          .trim()
          .split('\n')
          .pop()
          ?.includes('Found in Context: false');

        const answerLines = qa.answer.trim().split('\n');
        const displayAnswer = answerLines.slice(0, -1).join('\n'); // removes the last line

        return (
          <div
            key={index}
            className={`p-6 bg-white rounded-sm border ${
              isNotFound ? 'border-red-500' : 'border-gray-300'
            } relative`}
          >
            <div className='flex justify-between items-center mb-2'>
              <p className='font-semibold text-gray-900'>{qa.question}</p>

              <div className='flex items-center gap-2'>
                {/* Edit Button */}
                <button
                  onClick={() => {
                    setEditIndex(index);
                    setEditText(displayAnswer);
                    setConfirmDeleteIndex(null);
                    if (!openIndexes.includes(index)) toggleAccordion(index);
                  }}
                  className='w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700'
                >
                  <Pencil1Icon className='w-4 h-4 text-white' />
                </button>

                {/* Delete Button */}
                <div className='relative'>
                  <button
                    onClick={() => {
                      setConfirmDeleteIndex((prev) =>
                        prev === index ? null : index
                      );
                      setEditIndex(null);
                    }}
                    className='w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700'
                  >
                    <TrashIcon className='w-4 h-4 text-white' />
                  </button>

                  {/* Confirm Popover */}
                  {confirmDeleteIndex === index && (
                    <div className='absolute top-10 right-0 bg-white border border-gray-300 shadow-md rounded-sm p-3 z-10'>
                      <p className='text-sm mb-2 text-gray-800'>
                        Delete this response?
                      </p>
                      <div className='flex gap-2'>
                        <button
                          className='px-2 py-1 text-sm bg-gray-200 text-gray-800 rounded-sm hover:bg-gray-300'
                          onClick={() => setConfirmDeleteIndex(null)}
                        >
                          Cancel
                        </button>
                        <button
                          className='px-2 py-1 text-sm bg-gray-800 text-white rounded-sm hover:bg-gray-700'
                          onClick={() => {
                            onDelete(index);
                            setConfirmDeleteIndex(null);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>

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
            </div>

            {/* Answer Section */}
            {openIndexes.includes(index) && (
              <div className='transition-all duration-300 ease-in-out mt-4'>
                <div className='border-t border-gray-300 my-4'></div>

                {editIndex === index ? (
                  <>
                    <textarea
                      className='w-full p-3 border border-gray-300 rounded-sm text-sm text-gray-800'
                      rows={5}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <div className='flex justify-between mt-3'>
                      {/* Cancel button */}
                      <button
                        onClick={() => setEditIndex(null)}
                        className='px-4 py-2 bg-gray-200 text-gray-800 rounded-sm hover:bg-gray-300 text-sm'
                      >
                        Cancel
                      </button>

                      {/* Confirm Changes button */}
                      <button
                        onClick={() => {
                          onEdit(index, editText);
                          setEditIndex(null);
                        }}
                        className='px-4 py-2 bg-gray-800 text-white rounded-sm hover:bg-gray-700 text-sm'
                      >
                        Confirm Changes
                      </button>
                    </div>
                  </>
                ) : (
                  <pre className='whitespace-pre-wrap break-words text-sm text-gray-700'>
                    {displayAnswer}
                  </pre>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Invisible div to scroll into view */}
      <div ref={bottomRef} />
    </div>
  );
}
