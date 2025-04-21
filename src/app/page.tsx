'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/SideBar';
import Dashboard from '@/pages/Dashboard';
import SupplierAudit from '@/pages/SupplierAudit';
import AuditManagement from '@/pages/AuditManagement';
import { useSession, signIn } from 'next-auth/react';
import Image from 'next/image';
import GlobalError from '@/components/GlobalError';
import type { QAReport } from '@/types/qa';

export default function Home() {
  const { data: session, status } = useSession();
  const [activePage, setActivePage] = useState<
    'dashboard' | 'audit' | 'supplier'
  >('audit');

  // === Report state ===
  const [report, setReport] = useState<QAReport | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('qa-report');
    if (stored) setReport(JSON.parse(stored));
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (report) {
      localStorage.setItem('qa-report', JSON.stringify(report));
    } else {
      localStorage.removeItem('qa-report');
    }
  }, [report]);

  const updateReport = (partial: Partial<QAReport>) => {
    setReport((prev) => (prev ? { ...prev, ...partial } : null));
  };

  const deleteQuestions = () => {
    setReport((prev) =>
      prev
        ? {
            ...prev,
            questions: null,
            selectedQuestions: [],
            selectedFile: null,
          }
        : null
    );
  };

  // === Global Error State ===
  const [error, setError] = useState<string | null>(null);

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000); // auto-dismiss
  };

  const clearError = () => setError(null);

  // === Auth ===
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
          {activePage === 'dashboard' && <Dashboard />}
          {activePage === 'audit' && (
            <AuditManagement
              report={report}
              setReport={setReport}
              updateReport={updateReport}
              deleteQuestions={deleteQuestions}
              showError={showError}
            />
          )}
          {activePage === 'supplier' && <SupplierAudit />}
        </main>
        {error && <GlobalError error={error} clearError={clearError} />}
      </div>
    </div>
  );
}
