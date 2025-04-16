'use client';

import { useEffect, useState } from 'react';
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';

type Supplier = {
  name: string;
  date: string;
  risk: 'low' | 'medium' | 'high';
};

interface RunAssessmentProps {
  supplier: Supplier;
  onCancel: () => void;
}

interface AssessmentQuestion {
  id: number;
  question: string;
  reference: string;
}

export default function RunAssessment({
  supplier,
  onCancel,
}: RunAssessmentProps) {
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(0);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>('');

  const allQuestions: AssessmentQuestion[] = [
    {
      id: 1,
      question: 'Does the supplier have documented sterilization validation?',
      reference: 'ISO 11135, CFR §820.75',
    },
    {
      id: 2,
      question: 'Are training records maintained for critical processes?',
      reference: 'CFR §820.25, ISO 13485',
    },
    {
      id: 3,
      question: 'Has the supplier completed a recent internal audit?',
      reference: 'ISO 13485, CFR §820.22',
    },
    {
      id: 4,
      question: 'Are incoming materials verified upon receipt?',
      reference: 'CFR §820.80, ISO 9001',
    },
    {
      id: 5,
      question: 'Is there a CAPA process for nonconforming products?',
      reference: 'CFR §820.100, ISO 13485',
    },
  ];

  const abbrev = supplier.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 3);

  const today = new Date();
  const auditId = `${String(today.getMonth() + 1).padStart(2, '0')}${String(
    today.getDate()
  ).padStart(2, '0')}${today.getFullYear()}${abbrev}`;

  useEffect(() => {
    if (loadingIndex === null) return;

    if (loadingIndex < allQuestions.length) {
      const timer = setTimeout(() => {
        setQuestions((prev) => [...prev, allQuestions[loadingIndex]]);
        setLoadingIndex((i) => (i !== null ? i + 1 : null));
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setLoadingIndex(null);
    }
  }, [loadingIndex]);

  const handleEditSubmit = () => {
    if (editIndex === null || editText.trim() === '') return;
    const updated = [...questions];
    updated[editIndex].question = editText.trim();
    setQuestions(updated);
    setEditIndex(null);
    setEditText('');
  };

  const handleDelete = (index: number) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  return (
    <div className='max-w-4xl mx-auto text-gray-900 flex flex-col'>
      <p className='font-semibold text-lg'>Audit ID: {auditId}</p>
      <p className='text-sm text-gray-600 mb-4'>
        Supplier: <span className='font-bold'>{supplier.name}</span>
      </p>

      <div className='bg-white rounded-sm border border-gray-300 p-6 relative'>
        {loadingIndex !== null && (
          <div className='absolute inset-0 bg-white bg-opacity-90 z-10 flex flex-col items-center justify-center'>
            <div className='w-10 h-10 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin'></div>
            <p className='mt-3 text-sm text-gray-700'>
              Generating Question {loadingIndex + 1} of {allQuestions.length}...
            </p>
          </div>
        )}

        <div className='overflow-y-auto'>
          {questions.map((q, index) => (
            <div
              key={q.id}
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
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className='bg-white border-t border-gray-200 pb-2 pt-8 flex justify-between z-10 mt-8'>
          <button
            onClick={onCancel}
            className='px-4 py-2 bg-gray-500 text-white rounded-sm hover:bg-gray-600'
          >
            Cancel
          </button>
          <button
            className='px-4 py-2 bg-gray-800 text-white rounded-sm hover:bg-gray-700'
            disabled={questions.length === 0}
          >
            Run Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
