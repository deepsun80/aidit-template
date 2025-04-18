/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useMemo } from 'react';
import { CaretLeftIcon } from '@radix-ui/react-icons';

type Supplier = {
  name: string;
  date: string;
  risk: 'low' | 'medium' | 'high';
};

export default function SupplierAssessmentView({
  supplier,
  onRunAssessment,
  onBack,
}: {
  supplier: Supplier;
  onRunAssessment: () => void;
  onBack: () => void;
}) {
  const [supplierInfo, setSupplierInfo] = useState({
    address: '1234 Compliance Blvd, MedCity, USA',
    number: `SUP-${Math.floor(Math.random() * 9000 + 1000)}`,
    category: 'Raw Materials',
  });

  const abbrev = supplier.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 3);

  const mockHistory = useMemo(() => {
    const baseDate = new Date('2025-01-15');
    return Array.from({ length: 8 }).map((_, i) => {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() - i * 45);
      const dateStr = date.toLocaleDateString('en-US');
      const id = `${String(date.getMonth() + 1).padStart(2, '0')}${String(
        date.getDate()
      ).padStart(2, '0')}${date.getFullYear()}${abbrev}`;
      return {
        auditId: id,
        date: dateStr,
        nonconformities: Math.floor(Math.random() * 6 + 1),
      };
    });
  }, [abbrev]);

  return (
    <div className='max-w-4xl mx-auto flex flex-col text-gray-900 gap-4'>
      {/* Header */}
      <div className='flex justify-between items-start'>
        <div>
          <h2 className='text-lg font-semibold text-gray-900 mb-1'>
            {supplier.name} Supplier Assessment
          </h2>
          <p className='text-sm text-gray-600'>{supplierInfo.address}</p>
          <p className='text-sm text-gray-600'>
            Supplier Number:
            <span className='font-bold'> {supplierInfo.number}</span>
          </p>
          <p className='text-sm text-gray-600'>
            Category:{' '}
            <span className='font-bold'> {supplierInfo.category}</span>
          </p>
        </div>
        <button
          onClick={onBack}
          className='w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 text-white flex items-center justify-center'
          title='Back'
        >
          <CaretLeftIcon className='w-5 h-5' />
        </button>
      </div>

      {/* History Table */}
      <div className='bg-white rounded-sm border border-gray-300 p-6'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-md font-semibold text-gray-900'>
            Assessment History
          </h3>
        </div>
        <table className='min-w-full text-sm text-left text-gray-800'>
          <thead className='border-b border-gray-300'>
            <tr>
              <th className='py-2 pr-4 font-semibold'>Audit ID</th>
              <th className='py-2 pr-4 font-semibold'>Date</th>
              <th className='py-2 font-semibold'>Nonconformities</th>
            </tr>
          </thead>
          <tbody>
            {mockHistory.map((item, idx) => (
              <tr key={idx} className='border-b border-gray-100'>
                <td className='py-3 pr-4 text-blue-600 hover:underline cursor-pointer'>
                  {item.auditId}
                </td>
                <td className='py-3 pr-4'>{item.date}</td>
                <td className='py-3'>{item.nonconformities}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create New Assessment Button */}
      <div className='w-full flex justify-end'>
        <button
          onClick={onRunAssessment}
          className='text-sm px-4 py-2 bg-gray-800 text-white rounded-sm hover:bg-gray-700 mt-4'
        >
          New Assessment
        </button>
      </div>
    </div>
  );
}
