'use client';

import {
  DashboardIcon,
  FileTextIcon,
  ArchiveIcon,
  LayersIcon,
  FilePlusIcon,
  EnvelopeOpenIcon,
  CaretUpIcon,
} from '@radix-ui/react-icons';
import Image from 'next/image';

export default function Sidebar({
  setActivePage,
  activePage,
}: {
  setActivePage: (page: 'dashboard' | 'audit' | 'supplier') => void;
  activePage: 'dashboard' | 'audit' | 'supplier';
}) {
  return (
    <aside className='w-70 bg-gray-600 text-white flex flex-col items-center pt-6 min-h-full gap-20'>
      {/* Logo */}
      <div className='flex items-center'>
        <Image src='/AiDIT-logo.jpg' alt='AiDIT Logo' width={180} height={80} />
      </div>

      {/* Nav Items */}
      <nav className='flex flex-col gap-6 text-md w-full px-6'>
        {/* Dashboard */}
        <button
          onClick={() => setActivePage('dashboard')}
          className={`flex items-center gap-2 px-4 py-2 rounded-sm transition ${
            activePage === 'dashboard'
              ? 'bg-gray-800 text-white'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          <DashboardIcon className='w-6 h-6 text-inherit' />
          <span>Dashboard</span>
        </button>

        {/* Audit Management + Sub Items */}
        <div>
          <button
            onClick={() => setActivePage('audit')}
            className={`flex items-center justify-between px-4 py-2 rounded-sm transition w-full ${
              activePage === 'audit'
                ? 'bg-gray-800 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            <div className='flex gap-2'>
              <FileTextIcon className='w-6 h-6 text-inherit' />
              <span>Audit Management</span>
            </div>
            <CaretUpIcon className='w-4 h-4 text-inherit' />
          </button>

          <div className='ml-8 mt-4 flex flex-col gap-4'>
            <button
              disabled
              className='flex items-center gap-2 px-3 py-1 rounded-sm text-sm text-gray-300 cursor-not-allowed'
            >
              <FilePlusIcon className='w-4 h-4 text-inherit' />
              <span>Create</span>
            </button>
            <button
              disabled
              className='flex items-center gap-2 px-3 py-1 rounded-sm text-sm text-gray-500 cursor-not-allowed'
            >
              <EnvelopeOpenIcon className='w-4 h-4 text-inherit' />
              <span>Open</span>
            </button>
          </div>
        </div>

        {/* Supplier Audits */}
        <button
          onClick={() => setActivePage('supplier')}
          className={`flex items-center gap-2 px-4 py-2 rounded-sm transition ${
            activePage === 'supplier'
              ? 'bg-gray-800 text-white'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          <ArchiveIcon className='w-6 h-6 text-inherit' />
          <span>Supplier Audits</span>
        </button>

        {/* Disabled Items */}
        <button
          disabled
          className='flex items-center gap-2 px-4 py-2 rounded-sm text-gray-500 cursor-not-allowed'
        >
          <LayersIcon className='w-6 h-6 text-inherit' />
          <span>Internal Audits</span>
        </button>
      </nav>
    </aside>
  );
}
