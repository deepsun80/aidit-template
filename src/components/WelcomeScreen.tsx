'use client';

import React from 'react';
import type { QA, QAQuestion } from '@/context/QAContext';

export default function WelcomeScreen({
  report,
  onCreateReport,
  onOpenChat,
  onUploadClick,
  onViewQuestions,
}: {
  report: {
    title?: string;
    questions: QAQuestion[] | null;
    qaList: QA[];
  } | null;
  onCreateReport: () => void;
  onOpenChat: () => void;
  onUploadClick: () => void;
  onViewQuestions: () => void;
}) {
  const hasReport = !!report;
  const hasQuestions = (report?.questions?.length || 0) > 0;
  const hasResponses = (report?.qaList?.length || 0) > 0;

  return (
    <div className='text-center text-gray-700 text-lg'>
      {/* If no report exists */}
      {!hasReport && (
        <>
          <p className='text-4xl text-center text-gray-900 mb-8 mt-4'>
            Welcome to <span className='font-bold'>Ai.Dit</span>
          </p>
          <p>You have no audits stored in your account.</p>
          <p className='mt-2'>
            <span className='text-gray-900 font-medium'>
              Start by <span className='font-bold'>creating a new audit:</span>
            </span>
          </p>
          <div className='flex justify-center mt-8'>
            <button
              onClick={onCreateReport}
              className='bg-gray-800 text-white px-6 py-2 rounded-sm hover:bg-gray-700 transition'
            >
              Create Audit
            </button>
          </div>
        </>
      )}

      {/* If report exists and there are no responses */}
      {hasReport && !hasResponses && (
        <>
          <p className='text-4xl text-center text-gray-900 mb-8 mt-4'>
            Audit:{' '}
            <span className='font-bold'>{report?.title || 'Untitled'}</span>
          </p>
          <p>
            There are no <span className='font-bold'>stored responses</span> in
            this audit.
          </p>

          {hasQuestions ? (
            <p className='mt-2'>
              You can <span className='font-bold'>ask a question</span> or{' '}
              <span className='font-bold'>view the uploaded questions</span>,
              choose which questions you&apos;d like to add to your stored
              responses, and click <span className='font-bold'>Submit.</span>
            </p>
          ) : (
            <p className='mt-2'>
              You can add responses by{' '}
              <span className='font-bold'>asking a question</span> or{' '}
              <span className='font-bold'>uploading a questionnaire.</span>
            </p>
          )}

          <div className='flex justify-center gap-4 mt-8'>
            <button
              onClick={onOpenChat}
              className='bg-gray-800 text-white px-6 py-2 rounded-sm hover:bg-gray-700 transition'
            >
              Ask a Question
            </button>
            {hasQuestions ? (
              <button
                onClick={onViewQuestions}
                className='bg-gray-800 text-white px-6 py-2 rounded-sm hover:bg-gray-700 transition'
              >
                View Uploaded Questions
              </button>
            ) : (
              <button
                onClick={onUploadClick}
                className='bg-gray-800 text-white px-6 py-2 rounded-sm hover:bg-gray-700 transition'
              >
                Upload Questionnaire
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
