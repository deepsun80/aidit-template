'use client';

import { useEffect } from 'react';
import {
  CheckIcon,
  Cross2Icon,
  ExclamationTriangleIcon,
} from '@radix-ui/react-icons';

interface AlertPopoverProps {
  message: string;
  type: 'success' | 'warning';
  onClose: () => void;
  duration?: number; // duration in ms before auto-close
}

export default function AlertPopover({
  message,
  type,
  onClose,
  duration = 5000,
}: AlertPopoverProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className='bg-white border border-gray-300 rounded-md shadow-md px-4 py-3 flex items-start gap-3 min-w-[320px] max-w-sm'>
      <span
        className={`w-6 h-6 rounded-full flex items-center justify-center ${
          type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}
      >
        {type === 'success' ? (
          <CheckIcon className='w-4 h-4 text-white' />
        ) : (
          <ExclamationTriangleIcon className='w-4 h-4 text-white' />
        )}
      </span>
      <p className='text-sm text-gray-800'>{message}</p>
      <button
        onClick={onClose}
        className='ml-auto text-gray-400 hover:text-gray-600'
        title='Dismiss'
      >
        <Cross2Icon className='w-4 h-4' />
      </button>
    </div>
  );
}
