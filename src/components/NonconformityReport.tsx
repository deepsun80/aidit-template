'use client';

import React from 'react';
import NonconformityProgress from '@/components/NonconformityProgress';

interface QAItem {
  question: string;
  answer: string;
}

interface ReportData {
  [section: string]: { [reference: string]: number[] };
}

interface NonconformityReportProps {
  qaList: QAItem[];
  onBack: () => void;
  notFoundCount: number;
  auditId: string;
  customer: string;
  date: string;
}

export default function NonconformityReport({
  qaList,
  onBack,
  notFoundCount,
  auditId,
  customer,
  date,
}: NonconformityReportProps) {
  const notFoundItems = qaList
    .map((qa, index) => ({ ...qa, index }))
    .filter((qa) =>
      qa.answer.toLowerCase().includes('found in context: false')
    );

  const referenceMap: ReportData = {};

  notFoundItems.forEach(({ question, index }) => {
    const [, referenceText] = question.split(' - ');
    if (!referenceText) return;

    const references = referenceText.split(/,\s*/);

    references.forEach((ref) => {
      const match = ref.match(/^(ISO|CFR|[\w\-\.§]+)/i);
      const section = match?.[1]?.toUpperCase() || 'Other';

      if (!referenceMap[section]) referenceMap[section] = {};
      if (!referenceMap[section][ref]) referenceMap[section][ref] = [];

      referenceMap[section][ref].push(index + 1);
    });
  });

  const totalCount = qaList.length;
  const notFoundPercentage =
    totalCount > 0 ? (notFoundCount / totalCount) * 100 : 0;

  const countColor =
    notFoundPercentage <= 25
      ? '#22c55e'
      : notFoundPercentage <= 50
      ? '#F97316'
      : '#DC2626';

  const handleClickScrollTo = (qaNumber: number) => {
    onBack();
    setTimeout(() => {
      const element = document.getElementById(`qa-${qaNumber}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className='max-w-4xl mx-auto flex flex-col gap-4 text-gray-900'>
      {/* Header Info */}
      <div className='mb-4'>
        <p className='text-lg font-semibold'>Audit ID: {auditId}</p>
        <p className='text-sm text-gray-700'>
          Requesting Entity: <span className='font-semibold'>{customer}</span>
        </p>
        <p className='text-sm text-gray-700'>
          Requested Date: <span className='font-semibold'>{date}</span>
        </p>
      </div>

      {/* Progress and Back Button */}
      <div className='flex items-center gap-4'>
        <NonconformityProgress
          notFoundCount={notFoundCount}
          totalCount={qaList.length}
          barColor={countColor}
        />
        <button
          onClick={onBack}
          className='text-sm px-3 py-2 bg-gray-800 text-white rounded-sm hover:bg-gray-700'
        >
          View Audit
        </button>
      </div>

      {/* Subheading */}
      <p className='text-sm text-gray-600 mt-2 font-semibold'>
        Nonconformity Responses by Standard Reference
      </p>

      {/* Breakdown List */}
      <div className='bg-white border border-gray-300 rounded-sm p-6'>
        {Object.keys(referenceMap).length === 0 ? (
          <p className='text-gray-600'>
            No Standard Reference Nonconformities Found.
          </p>
        ) : (
          <div className='space-y-6'>
            {Object.entries(referenceMap).map(([section, refs]) => (
              <div key={section}>
                <h3 className='text-md font-bold text-gray-700 mb-2'>
                  {section}
                </h3>
                <ul className='list-disc list-inside text-gray-800 text-sm space-y-1'>
                  {Object.entries(refs).map(([ref, numbers]) => {
                    const sorted = [...numbers].sort((a, b) => a - b);
                    return (
                      <li key={ref}>
                        <span className='font-medium text-red-500'>{ref}:</span>{' '}
                        {sorted.map((num, i) => (
                          <button
                            key={i}
                            onClick={() => handleClickScrollTo(num)}
                            className='text-blue-600 hover:underline mx-1'
                          >
                            {num}
                          </button>
                        ))}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
