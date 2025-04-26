'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PlusIcon } from '@radix-ui/react-icons';

type Supplier = {
  name: string;
  date: string;
  risk: 'low' | 'medium' | 'high';
};

export const allSuppliers: Supplier[] = [
  { name: 'SterileTech Partners', date: '03/20/2025', risk: 'high' },
  { name: 'MedCore Devices', date: '07/22/2025', risk: 'high' },
  { name: 'SecureSeal Systems', date: '10/25/2025', risk: 'high' },
  { name: 'Sterilux Sources', date: '12/28/2025', risk: 'high' },
  { name: 'BioSafe Materials', date: '02/14/2025', risk: 'medium' },
  { name: 'Labline Components', date: '05/12/2025', risk: 'medium' },
  { name: 'Axis Labs', date: '08/05/2025', risk: 'medium' },
  { name: 'Calibra Biotech', date: '10/01/2025', risk: 'medium' },
  { name: 'TracePath Partners', date: '11/11/2025', risk: 'medium' },
  { name: 'NextGen Med Parts', date: '12/12/2025', risk: 'medium' },
  { name: 'Precision Alloys', date: '01/10/2025', risk: 'low' },
  { name: 'VitaParts Inc', date: '04/18/2025', risk: 'low' },
  { name: 'Nova Supplies', date: '06/09/2025', risk: 'low' },
  { name: 'Helix Synthetics', date: '09/17/2025', risk: 'low' },
  { name: 'EcoBio Suppliers', date: '11/30/2025', risk: 'low' },
];

const getBarColor = (risk: Supplier['risk']) => {
  return risk === 'low' ? '#22c55e' : risk === 'medium' ? '#F97316' : '#DC2626';
};

export default function SupplierList({
  setActiveSupplier,
}: {
  setActiveSupplier: (supplier: Supplier) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSuppliers, setFilteredSuppliers] = useState(allSuppliers);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSuppliers(allSuppliers);
    } else {
      const filtered = allSuppliers.filter((supplier) =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSuppliers(filtered);
    }
  }, [searchTerm]);

  return (
    <>
      <div className='flex justify-end mb-6 relative gap-2 items-center'>
        {/* Search bar */}
        <div className='relative w-full max-w-sm'>
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Search Supplier'
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-gray-400'
          />
          <MagnifyingGlassIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5' />
        </div>

        {/* Add Supplier button */}
        <button
          className='w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700'
          title='Add Supplier'
        >
          <PlusIcon className='text-white w-5 h-5' />
        </button>
      </div>

      {/* Table wrapper */}
      <div className='bg-white rounded-sm shadow-sm border border-gray-200 p-6'>
        <div className='overflow-x-auto'>
          <table className='min-w-full text-sm text-left text-gray-800'>
            <thead className='border-b border-gray-300'>
              <tr>
                <th className='py-2 pr-4 font-semibold'>Supplier</th>
                <th className='py-2 pr-4 font-semibold'>Date Added</th>
                <th className='py-2 font-semibold'>Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier, idx) => (
                <tr key={idx} className='border-b border-gray-100'>
                  <td className='py-4 pr-4'>
                    <a
                      href='#'
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveSupplier(supplier);
                      }}
                      className='text-blue-600 hover:underline'
                    >
                      {supplier.name}
                    </a>
                  </td>
                  <td className='py-4 pr-4'>{supplier.date}</td>
                  <td className='py-4'>
                    <div className='w-full bg-gray-200 h-4 rounded-sm overflow-hidden'>
                      <div
                        className='h-4 rounded-sm transition-all duration-300'
                        style={{
                          width:
                            supplier.risk === 'low'
                              ? '30%'
                              : supplier.risk === 'medium'
                              ? '60%'
                              : '90%',
                          backgroundColor: getBarColor(supplier.risk),
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
