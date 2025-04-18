'use client';

import React from 'react';

export default function WelcomeScreen({
  report,
  onOpenChat,
  onUploadClick,
}: {
  report: {
    auditId?: string;
    customer?: string;
    date?: string;
  } | null;
  onOpenChat: () => void;
  onUploadClick: () => void;
}) {
  return (
    <div className='max-w-4xl mx-auto text-gray-900 flex flex-col gap-4'>
      {/* Header Section - Audit Metadata */}
      <div className='flex justify-between items-start'>
        <div>
          <p className='text-md font-semibold text-gray-800 mb-1'>
            Audit ID: {report?.auditId}
          </p>
          <p className='text-sm text-gray-600'>
            Requesting Entity: {report?.customer}
          </p>
          <p className='text-sm text-gray-600'>
            Requested Date: {report?.date}
          </p>
        </div>
      </div>

      {/* Body Section - Welcome Text & Buttons */}
      <div className='bg-white text-center rounded-sm border border-gray-300 p-6 mt-4'>
        <p className='text-lg mb-2'>
          There are no <span className='font-bold'>stored responses</span> in
          this audit.
        </p>
        <p className='text-md text-gray-700'>
          You can add responses by{' '}
          <span className='font-bold'>asking a question</span> or{' '}
          <span className='font-bold'>uploading a questionnaire.</span>
        </p>

        <div className='flex justify-center gap-4 mt-8'>
          <button
            onClick={onOpenChat}
            className='bg-gray-800 text-white px-6 py-2 rounded-sm hover:bg-gray-700 transition'
          >
            Ask a Question
          </button>
          <button
            onClick={onUploadClick}
            className='bg-gray-800 text-white px-6 py-2 rounded-sm hover:bg-gray-700 transition'
          >
            Upload Questionnaire
          </button>
        </div>
      </div>
    </div>
  );
}
