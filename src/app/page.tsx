'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/SideBar';
import AuditManagement from '@/pages/AuditManagement';
import Dashboard from '@/pages/Dashboard';
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/image';

export default function Home() {
  const { data: session, status } = useSession();
  const [activePage, setActivePage] = useState<'dashboard' | 'audit'>(
    'dashboard'
  );

  if (status === 'loading') {
    return <p className='text-center text-lg font-medium'>Loading...</p>;
  }

  if (!session) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
        <p className='text-md mb-4 text-gray-900'>
          You must be signed in to access this page.
        </p>
        <button
          onClick={() => signIn('google')}
          className='flex items-center px-6 py-2 bg-gray-800 text-white rounded-sm hover:bg-gray-700'
        >
          <Image
            src='/google-logo.png'
            alt='Google Logo'
            width={20}
            height={20}
            className='mr-2'
          />
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-100 flex flex-row'>
      <Sidebar setActivePage={setActivePage} activePage={activePage} />
      <div className='flex flex-col flex-1'>
        <Header />
        <main className='flex-1 p-8'>
          {activePage === 'dashboard' ? <Dashboard /> : <AuditManagement />}
        </main>
      </div>
    </div>
  );
}
