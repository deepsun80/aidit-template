'use client';

import {
  ExitIcon,
  ChatBubbleIcon,
  UploadIcon,
  FileIcon,
} from '@radix-ui/react-icons';
import { signOut } from 'next-auth/react';
import Image from 'next/image';

interface SidebarProps {
  onToggleChat: () => void;
  onToggleQuestions: () => void;
  onUploadClick: () => void;
  questions?: { question: string; reference?: string }[] | null;
}

export default function Sidebar({
  onToggleChat,
  onToggleQuestions,
  onUploadClick,
  questions,
}: SidebarProps) {
  return (
    <aside className='fixed left-0 top-0 h-full w-72 bg-gray-800 text-white flex flex-col items-center py-10'>
      {/* Logo Placeholder */}
      <div className='mb-20'>
        {/* <div className='w-48 h-20 bg-gray-700 flex items-center justify-center'>
          <span className='text-2xl font-semibold'>Ai.Dit</span>
        </div> */}
        <Image
          src='/AiDit-logo-v1.jpg'
          alt='AiDit Logo'
          width={220} // Adjust size as needed
          height={80}
        />
      </div>

      {/* Navigation Icons */}
      <nav className='flex flex-col flex-start space-y-8 flex-grow gap-4'>
        <button
          onClick={onToggleChat}
          className='flex items-center gap-2 text-gray-300 hover:text-white transition'
        >
          <ChatBubbleIcon className='w-6 h-6' />
          <span className='text-md'>Ask New Question</span>
        </button>

        <button
          onClick={onToggleQuestions}
          disabled={!questions || questions.length === 0}
          className={`flex items-center gap-2 ${
            questions && questions.length > 0
              ? 'text-white'
              : 'text-gray-500 cursor-not-allowed'
          } transition`}
        >
          <FileIcon className='w-6 h-6' />
          <span className='text-md'>View Uploaded Questions</span>
          {questions && questions.length > 0 && (
            <span className='w-2 h-2 bg-red-500 rounded-full ml-2'></span>
          )}
        </button>

        <button
          onClick={onUploadClick}
          className='flex items-center gap-2 text-gray-300 hover:text-white transition'
        >
          <UploadIcon className='w-6 h-6' />
          <span className='text-md'>Upload New Questionnaire</span>
        </button>
      </nav>

      {/* Sign Out */}
      <button
        onClick={() => signOut()}
        className='flex items-center gap-2 text-gray-300 hover:text-white transition mt-auto mb-6'
      >
        <ExitIcon className='w-6 h-6' />
        <span className='text-md'>Sign Out</span>
      </button>
    </aside>
  );
}
