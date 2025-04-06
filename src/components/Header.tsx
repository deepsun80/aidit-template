'use client';

import { QuestionMarkCircledIcon, PersonIcon } from '@radix-ui/react-icons';
import Image from 'next/image';

export default function Header() {
  return (
    <header className='w-full h-20 bg-gray-800 text-white flex items-center justify-between px-8'>
      {/* Logo */}
      <div className='flex items-center'>
        <Image
          src='/AiDit-logo-v1.jpg'
          alt='AiDit Logo'
          width={200}
          height={80}
        />
      </div>

      {/* Icons */}
      <div className='flex gap-6 items-center'>
        <button className='hover:text-gray-300 transition' title='Help'>
          <QuestionMarkCircledIcon className='w-6 h-6 text-white' />
        </button>
        <button className='hover:text-gray-300 transition' title='User'>
          <PersonIcon className='w-6 h-6 text-white' />
        </button>
      </div>
    </header>
  );
}
