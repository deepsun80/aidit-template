'use client';

import React, { useState } from 'react';

const spanOptions = [1, 3, 5, 10];

const mockAnalytics = [
  {
    customer: 'ABC Inc',
    auditReports: 10,
    totalNonconformities: 10,
    breakdown: {
      'ISO 13485': 6,
      'CFR 820.50': 4,
    },
  },
  {
    customer: 'MedEquip Solutions',
    auditReports: 11,
    totalNonconformities: 7,
    breakdown: {
      'ISO 13485': 5,
      'CFR 820.50': 2,
    },
  },
  {
    customer: 'Nova Diagnostics',
    auditReports: 12,
    totalNonconformities: 12,
    breakdown: {
      'ISO 13485': 9,
      'CFR 820.50': 3,
    },
  },
];

export default function AnalyticsTab() {
  const [selectedSpan, setSelectedSpan] = useState(1);

  const scaledAnalytics = mockAnalytics.map((item) => ({
    customer: item.customer,
    auditReports: item.auditReports + (selectedSpan - 1) * 3,
    totalNonconformities: item.totalNonconformities + (selectedSpan - 1) * 2,
    breakdown: Object.fromEntries(
      Object.entries(item.breakdown).map(([ref, val]) => [
        ref,
        val + (selectedSpan - 1),
      ])
    ),
  }));

  return (
    <div className='text-gray-900'>
      {/* Time Span Filter */}
      <div className='flex justify-end mb-6'>
        <label className='text-sm font-medium mr-2 self-center'>
          Time Span:
        </label>
        <select
          value={selectedSpan}
          onChange={(e) => setSelectedSpan(Number(e.target.value))}
          className='border border-gray-300 rounded-sm px-3 py-1 text-sm focus:outline-gray-400'
        >
          {spanOptions.map((year) => (
            <option key={year} value={year}>
              {year} {year === 1 ? 'year' : 'years'}
            </option>
          ))}
        </select>
      </div>

      {/* Analytics Table */}
      <div className='overflow-x-auto'>
        <table className='min-w-full text-sm text-left text-gray-800'>
          <thead className='border-b border-gray-300'>
            <tr>
              <th className='py-2 pr-4 font-semibold'>Requesting Entity</th>
              <th className='py-2 pr-4 font-semibold'>Audit Reports</th>
              <th className='py-2 pr-4 font-semibold'>Nonconformities</th>
              <th className='py-2 font-semibold'>
                Nonconformity
                <br />
                Standard References
              </th>
            </tr>
          </thead>
          <tbody>
            {scaledAnalytics.map((item, idx) => (
              <tr key={idx} className='border-b border-gray-100'>
                <td className='py-4 pr-4 font-medium'>{item.customer}</td>
                <td className='py-4 pr-4 font-medium'>{item.auditReports}</td>
                <td className='py-4 pr-4 font-medium'>
                  {item.totalNonconformities}
                </td>
                <td className='py-4'>
                  <div className='flex items-end gap-6'>
                    {Object.entries(item.breakdown).map(([ref, count]) => (
                      <div key={ref} className='flex flex-col items-center'>
                        <span className='text-xs font-medium mb-1'>
                          {count}
                        </span>
                        <div
                          className={`w-4 rounded-sm ${
                            ref.startsWith('ISO')
                              ? 'bg-blue-500'
                              : 'bg-amber-500'
                          }`}
                          style={{ height: `${count * 4}px` }}
                          title={ref}
                        />
                        <span className='text-[10px] mt-1 text-gray-600'>
                          {ref}
                        </span>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
