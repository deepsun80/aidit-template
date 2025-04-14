/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  CaretUpIcon,
  CaretDownIcon,
  Pencil1Icon,
  TrashIcon,
  DownloadIcon,
  Cross2Icon,
  CheckIcon,
  PlusIcon,
  UploadIcon,
  EyeOpenIcon,
} from '@radix-ui/react-icons';
import NonconformityProgress from '@/components/NonconformityProgress';
import { QAReport } from '@/context/QAContext';

interface QACardsProps {
  qaList: { question: string; answer: string }[];
  onEdit: (index: number, newAnswer: string) => void;
  onDelete: (index: number) => void;
  notFoundCount: number;
  showOnlyNotFound: boolean;
  setShowOnlyNotFound: (val: boolean) => void;
  onDownload: () => void;
  onViewReport: () => void;
  report: QAReport;
  onAskNew: () => void;
  onUploadNew: () => void;
  onViewUploaded: () => void;
  hasUploadedQuestions: boolean;
}

export default function QACards({
  qaList,
  onEdit,
  onDelete,
  notFoundCount,
  showOnlyNotFound,
  setShowOnlyNotFound,
  onDownload,
  onViewReport,
  report,
  onAskNew,
  onUploadNew,
  onViewUploaded,
  hasUploadedQuestions,
}: QACardsProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(
    null
  );
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const totalCount = qaList.length;
  const notFoundPercentage =
    totalCount > 0 ? (notFoundCount / totalCount) * 100 : 0;
  const countColor =
    notFoundPercentage <= 25
      ? '#48bb78' // Tailwind green-500
      : notFoundPercentage <= 50
      ? '#F97316' // Tailwind orange-500
      : '#DC2626'; // Tailwind red-500

  const filteredList = showOnlyNotFound
    ? qaList.filter((qa) =>
        qa.answer
          .trim()
          .split('\n')
          .slice(-1)[0]
          .toLowerCase()
          .includes('found in context: false')
      )
    : qaList;

  const toggleAccordion = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  useEffect(() => {
    if (qaList.length > 0) setOpenIndexes([qaList.length - 1]);
  }, [qaList]);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [qaList]);

  return (
    <div className='max-w-4xl mx-auto flex flex-col text-gray-900 gap-4 mt-2'>
      {/* Header Section */}
      <div className='flex justify-between items-center mb-4'>
        <div>
          <p className='text-lg font-semibold text-gray-900'>
            Audit ID: {report.auditId}
          </p>
          <p className='text-sm text-gray-700'>
            Requesting Entity:{' '}
            <span className='font-semibold'>{report.customer}</span>
          </p>
          <p className='text-sm text-gray-700'>
            Requested Date: <span className='font-semibold'>{report.date}</span>
          </p>
        </div>
        <div className='flex gap-2'>
          <button
            onClick={onAskNew}
            className='w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700'
            title='Ask New Question'
          >
            <PlusIcon className='text-white w-5 h-5' />
          </button>
          <div className='relative'>
            <button
              onClick={onViewUploaded}
              className='w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed'
              disabled={!hasUploadedQuestions}
              title='View Uploaded Questions'
            >
              <EyeOpenIcon className='text-white w-5 h-5' />
            </button>
          </div>
          <button
            onClick={onUploadNew}
            className='w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700'
            title='Upload New Questions'
          >
            <UploadIcon className='text-white w-5 h-5' />
          </button>
        </div>
      </div>

      {/* Progress Bar and Controls */}
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-4'>
          <NonconformityProgress
            notFoundCount={notFoundCount}
            totalCount={qaList.length}
            barColor={countColor}
          />
          <button
            onClick={onViewReport}
            className='text-sm px-3 py-2 bg-gray-800 text-white rounded-sm hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed'
            disabled={notFoundCount <= 0}
          >
            Nonconformity Report
          </button>
        </div>
        <div className='flex items-center gap-4'>
          {notFoundCount > 0 && (
            <div className='flex items-center gap-2'>
              <label
                htmlFor='toggle-not-found'
                className='text-gray-700 text-sm'
              >
                Filter Nonconformities
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
          )}
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

      {/* Cards */}
      {filteredList.map((qa: any, index: number) => {
        const isNotFound = qa.answer
          .trim()
          .split('\n')
          .pop()
          ?.includes('Found in Context: false');
        const answerLines = qa.answer.trim().split('\n');
        const displayAnswer = answerLines.slice(0, -1).join('\n');
        const [questionText, referenceText] = qa.question.split(' - ');

        return (
          <div
            key={index}
            id={`qa-${index + 1}`}
            className={`p-6 bg-white rounded-sm border ${
              isNotFound ? 'border-red-500' : 'border-gray-300'
            } relative`}
          >
            <div className='flex justify-between items-center mb-2'>
              <div className='flex flex-col'>
                <p className='font-semibold text-gray-900'>
                  {index + 1}: {questionText}
                </p>
                {referenceText && (
                  <div className='flex items-center mt-1 gap-2'>
                    <p
                      className={`text-sm italic ${
                        isNotFound ? 'text-red-600' : 'text-gray-500'
                      }`}
                    >
                      Standard Reference: {referenceText}
                    </p>
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        isNotFound ? 'bg-red-500' : 'bg-green-500'
                      }`}
                    >
                      {isNotFound ? (
                        <Cross2Icon className='w-4 h-4 text-white' />
                      ) : (
                        <CheckIcon className='w-4 h-4 text-white' />
                      )}
                    </span>
                  </div>
                )}
              </div>
              <div className='flex items-center gap-2'>
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
                <button
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
                      <button
                        onClick={() => setEditIndex(null)}
                        className='px-4 py-2 bg-gray-200 text-gray-800 rounded-sm hover:bg-gray-300 text-sm'
                      >
                        Cancel
                      </button>
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

      <div ref={bottomRef} />

      {/* Sticky Submit Footer */}
      <div className='sticky bottom-0 left-0 w-full flex justify-end'>
        <button className='px-4 py-2 bg-gray-800 text-white rounded-sm hover:bg-gray-700 transition'>
          Submit
        </button>
      </div>
    </div>
  );
}
