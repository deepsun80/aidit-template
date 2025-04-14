'use client';

import React from 'react';

interface NonconformityProgressProps {
  notFoundCount: number;
  totalCount: number;
  barColor: string;
}

export default function NonconformityProgress({
  notFoundCount,
  totalCount,
  barColor,
}: NonconformityProgressProps) {
  const percentage = totalCount === 0 ? 0 : (notFoundCount / totalCount) * 100;

  return (
    <div>
      {/* <p className='text-sm font-semibold text-gray-800 mb-1'>Nonconformity</p> */}
      <div className='w-full bg-gray-200 h-4 rounded-sm overflow-hidden'>
        <div
          className={`h-4 rounded-sm transition-all duration-300`}
          style={{ width: `${percentage}%`, backgroundColor: barColor }}
        />
      </div>
      <p className='text-xs text-gray-600 mt-1'>
        {notFoundCount} out of {totalCount} responses
      </p>
    </div>
  );
}
