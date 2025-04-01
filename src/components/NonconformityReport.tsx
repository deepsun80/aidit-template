'use client';

import React from 'react';

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
}

export default function NonconformityReport({
  qaList,
  onBack,
}: NonconformityReportProps) {
  // Filter for "Found in Context: false"
  const notFoundItems = qaList.filter((qa) =>
    qa.answer.toLowerCase().includes('found in context: false')
  );

  const referenceMap: ReportData = {};

  notFoundItems.forEach((qa) => {
    const [_, referenceText] = qa.question.split(' - ');
    if (!referenceText) return;

    const references = referenceText.split(/,\s*/); // handle multiple refs

    references.forEach((ref) => {
      const match = ref.match(/^(ISO|CFR|[\w\-\.§]+)/i);
      const section = match?.[1]?.toUpperCase() || 'Other';

      referenceMap[section] = referenceMap[section] || {};
      referenceMap[section][ref] = (referenceMap[section][ref] || 0) + 1;
    });
  });

  return (
    <div className='max-w-4xl mx-auto bg-white shadow-md rounded-sm p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl font-semibold text-gray-800'>
          Nonconformity Breakdown by Standard Reference
        </h2>
        <button
          onClick={onBack}
          className='px-4 py-2 bg-gray-800 text-white rounded-sm hover:bg-gray-700 text-sm'
        >
          Back to Responses
        </button>
      </div>

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
                    <span className='font-medium'>{ref}:</span> {count}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
