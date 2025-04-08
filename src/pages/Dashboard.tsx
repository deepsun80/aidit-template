'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import NonconformityProgress from '@/components/NonconformityProgress';

type Tab = 'pending' | 'recent' | 'scheduled';

interface AuditItem {
  title: string;
  date: string;
  nonconformity?: { notFound: number; total: number };
}

const generateRandomAudits = (): Record<Tab, AuditItem[]> => ({
  pending: Array.from({ length: 5 }, (_, i) => ({
    title: `Pending Audit ${i + 1} - Device Inspection`,
    date: `2024-0${(i % 9) + 1}-15`,
    nonconformity: {
      notFound: Math.floor(Math.random() * 50),
      total: Math.floor(Math.random() * 50 + 51),
    },
  })),
  recent: Array.from({ length: 5 }, (_, i) => {
    const total = Math.floor(Math.random() * 40 + 60);
    const maxNotFound = Math.floor(total * 0.25);
    const notFound = Math.floor(Math.random() * (maxNotFound + 1));

    return {
      title: `Recent Report ${i + 1} - Post Market Review`,
      date: `2024-0${(i % 9) + 1}-10`,
      nonconformity: {
        notFound,
        total,
      },
    };
  }),
  scheduled: Array.from({ length: 5 }, (_, i) => ({
    title: `Scheduled Audit ${i + 1} - Supplier Verification`,
    date: `2024-0${(i % 9) + 1}-20`,
  })),
});

const reportTitles = [
  'Sterilization Equipment Check',
  'Post-Market Surveillance Summary',
  'Biocompatibility Test Report',
  'Packaging Seal Integrity Review',
  'Design Validation Audit',
  'Labeling Compliance Verification',
  'Software Validation Report',
  'Risk Management File Review',
  'Supplier Quality Assessment',
  'CAPA Investigation Summary',
  'Complaint Handling Audit',
  'Device History Record Review',
  'Traceability Matrix Evaluation',
  'Calibration Certificate Summary',
  'Process Validation Report',
  'Environmental Controls Log',
  'Incoming Material Inspection',
  'Batch Release Form Review',
  'Training Record Audit',
  'Internal Audit Program Overview',
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('pending');
  const [auditData, setAuditData] = useState<Record<Tab, AuditItem[]>>({
    pending: [],
    recent: [],
    scheduled: [],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTitles, setFilteredTitles] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setAuditData(generateRandomAudits());
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredTitles([]);
      return;
    }

    setIsSearching(true);
    const delay = setTimeout(() => {
      const filtered = reportTitles.filter((title) =>
        title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTitles(filtered);
      setIsSearching(false);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  const tabLabels: Record<Tab, string> = {
    pending: 'Pending Audits',
    recent: 'Recent Reports',
    scheduled: 'Scheduled Audits',
  };

  return (
    <div className='text-gray-900'>
      {/* Search bar */}
      <div className='flex justify-end mb-6 relative'>
        <div className='relative w-full max-w-sm'>
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Search Audit'
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-gray-400'
          />
          <MagnifyingGlassIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5' />

          {isSearching ? (
            <div className='absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-sm shadow-md z-10 flex items-center justify-center py-4'>
              <div className='w-10 h-10 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin'></div>
            </div>
          ) : (
            filteredTitles.length > 0 && (
              <div className='absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-sm shadow-md z-10'>
                {filteredTitles.map((title, idx) => (
                  <div
                    key={idx}
                    className='px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer'
                  >
                    {title}
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* Tab Wrapper */}
      <div className='bg-white rounded-sm shadow-sm border border-gray-200 p-6'>
        {/* Tabs */}
        <div className='flex gap-6 border-b border-gray-200 mb-6'>
          {Object.entries(tabLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as Tab)}
              className={`pb-2 text-sm font-medium transition ${
                activeTab === key
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className='space-y-6'>
          {auditData[activeTab]?.map((item, idx) => {
            const nc = item.nonconformity;
            const notFound = nc?.notFound || 0;
            const total = nc?.total || 0;
            const percentage = total > 0 ? (notFound / total) * 100 : 0;
            const barColor =
              percentage <= 25
                ? '#22c55e'
                : percentage <= 50
                ? '#F97316'
                : '#DC2626';

            return (
              <div
                key={idx}
                className='flex items-center justify-between py-4 border-b border-gray-200'
              >
                <div className='flex-1'>
                  <p
                    className={`text-md font-medium ${
                      activeTab === 'scheduled'
                        ? idx === 0
                          ? 'text-red-600'
                          : idx === 1
                          ? 'text-orange-500'
                          : 'text-gray-800'
                        : 'text-gray-800'
                    }`}
                  >
                    {item.title}
                  </p>
                  <p className='text-sm text-gray-500'>{item.date}</p>
                </div>
                {nc ? (
                  <div className='w-1/2'>
                    <NonconformityProgress
                      notFoundCount={notFound}
                      totalCount={total}
                      barColor={barColor}
                    />
                  </div>
                ) : (
                  <div className='w-1/2 flex items-end '>
                    <button className='bg-gray-800 text-white text-sm px-4 py-2 rounded-sm hover:bg-gray-700 transition m-[20px]'>
                      Start Audit
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
