'use client';

import React from 'react';
import NonconformityProgress from '@/components/NonconformityProgress';

interface QAItem {
  question: string;
  answer: string;
}

interface ReportData {
  [section: string]: { [reference: string]: number };
}

interface NonconformityReportProps {
  qaList: QAItem[];
  onBack: () => void;
  notFoundCount: number;
}

export default function NonconformityReport({
  qaList,
  onBack,
  notFoundCount,
}: NonconformityReportProps) {
  // Filter for "Found in Context: false"
  const notFoundItems = qaList.filter((qa) =>
    qa.answer.toLowerCase().includes('found in context: false')
  );

  const referenceMap: ReportData = {};

  notFoundItems.forEach((qa) => {
    const [, referenceText] = qa.question.split(' - ');
    if (!referenceText) return;

    const references = referenceText.split(/,\s*/); // handle multiple refs

    references.forEach((ref) => {
      const match = ref.match(/^(ISO|CFR|[\w\-\.§]+)/i);
      const section = match?.[1]?.toUpperCase() || 'Other';

      referenceMap[section] = referenceMap[section] || {};
      referenceMap[section][ref] = (referenceMap[section][ref] || 0) + 1;
    });
  });

  /** Responses Not Found color calculation */
  const totalCount = qaList.length;
  const notFoundPercentage =
    totalCount > 0 ? (notFoundCount / totalCount) * 100 : 0;

  const countColor =
    notFoundPercentage <= 25
      ? '#1F2937' // gray
      : notFoundPercentage <= 50
      ? '#F97316' // orange
      : '#DC2626'; // red
  /** --- */

  return (
    <div className='max-w-4xl mx-auto flex flex-col gap-4 mt-2'>
      <h2 className='text-lg font-semibold text-gray-900'>
        Nonconformity Breakdown by Standard Reference
      </h2>
      <div className='flex items-center gap-4'>
        <NonconformityProgress
          notFoundCount={notFoundCount}
          totalCount={qaList.length}
          barColor={countColor}
        />
        {/* New View Report Button */}
        <button
          onClick={onBack}
          className='text-sm px-3 py-2 bg-gray-800 text-white rounded-sm hover:bg-gray-700'
        >
          Back to Responses
        </button>
      </div>

      <div className='bg-white shadow-md rounded-sm p-6'>
        {Object.keys(referenceMap).length === 0 ? (
          <p className='text-gray-600'>No nonconformities found.</p>
        ) : (
          <div className='space-y-6'>
            {Object.entries(referenceMap).map(([section, refs]) => (
              <div key={section}>
                <h3 className='text-md font-bold text-gray-700 mb-2'>
                  {section}
                </h3>
                <ul className='list-disc list-inside text-gray-800 text-sm space-y-1'>
                  {Object.entries(refs).map(([ref, count]) => (
                    <li key={ref}>
                      <span className='font-medium text-red-500'>{ref}:</span>{' '}
                      {count}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
