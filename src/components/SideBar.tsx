'use client';

import {
  DashboardIcon,
  FileTextIcon,
  ArchiveIcon,
  LayersIcon,
  ExitIcon,
} from '@radix-ui/react-icons';
import { signOut } from 'next-auth/react';

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
    <aside className='w-72 bg-gray-800 text-white flex flex-col items-center pt-10 min-h-full'>
      {/* Nav Items */}
      <nav className='flex flex-col gap-6 text-md w-full px-6'>
        {navItems.map((item, idx) => (
          <button
            key={idx}
            disabled={!item.enabled}
            className={`flex items-center gap-2 px-4 py-2 rounded-sm transition ${
              item.enabled
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'text-gray-500 cursor-not-allowed'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
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
