'use client';

import {
  DashboardIcon,
  FileTextIcon,
  ArchiveIcon,
  LayersIcon,
  ExitIcon,
  FilePlusIcon,
  EnvelopeOpenIcon,
  CaretUpIcon,
} from '@radix-ui/react-icons';
import { signOut } from 'next-auth/react';
import Image from 'next/image';

export default function Sidebar() {
  const navItems = [
    {
      label: 'Dashboard',
      enabled: false,
      icon: <DashboardIcon className='w-6 h-6 text-inherit' />,
    },
    {
      label: 'Audit Management',
      enabled: true,
      icon: <FileTextIcon className='w-6 h-6 text-inherit' />,
      subItems: [
        {
          label: 'Create',
          enabled: true,
          icon: <FilePlusIcon className='w-4 h-4 text-inherit' />,
        },
        {
          label: 'Open',
          enabled: true,
          icon: <EnvelopeOpenIcon className='w-4 h-4 text-inherit' />,
        },
      ],
    },
    {
      label: 'Supplier Audits',
      enabled: false,
      icon: <ArchiveIcon className='w-6 h-6 text-inherit' />,
    },
    {
      label: 'Internal Audits',
      enabled: false,
      icon: <LayersIcon className='w-6 h-6 text-inherit' />,
    },
  ];

  return (
    <aside className='w-72 bg-gray-800 text-white flex flex-col items-center pt-6 min-h-full gap-20'>
      {/* Logo */}
      <div className='flex items-center'>
        <Image
          src='/AiDit-logo-v1.jpg'
          alt='AiDit Logo'
          width={220}
          height={80}
        />
      </div>

      {/* Nav Items */}
      <nav className='flex flex-col gap-6 text-md w-full px-6'>
        {navItems.map((item, idx) => (
          <div key={idx}>
            <button
              disabled={!item.enabled}
              className={`flex items-center justify-between px-4 py-2 rounded-sm transition w-full ${
                item.enabled
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'text-gray-500 cursor-not-allowed'
              }`}
            >
              <div className='flex gap-2'>
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.subItems && <CaretUpIcon className='w-4 h-4 text-white' />}
            </button>

            {/* Sub-Items */}
            {item.subItems && (
              <div className='ml-8 mt-4 flex flex-col gap-4'>
                {item.subItems.map((sub, subIdx) => (
                  <button
                    key={subIdx}
                    disabled={!sub.enabled}
                    className={`flex items-center gap-2 px-3 py-1 rounded-sm text-sm transition ${
                      sub.label === 'Create'
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {sub.icon}
                    <span>{sub.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Sign Out */}
      <button
        onClick={() => signOut()}
        className='flex items-center gap-2 text-gray-300 hover:text-white transition mt-auto mb-6'
      >
        <ExitIcon className='w-6 h-6 text-inherit' />
        <span className='text-md'>Sign Out</span>
      </button>
    </aside>
  );
}
