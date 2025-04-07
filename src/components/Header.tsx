'use client';

import { QuestionMarkCircledIcon, PersonIcon } from '@radix-ui/react-icons';

export default function Header() {
  return (
    <header className='w-full h-20 bg-gray-800 text-white flex items-center justify-end px-8'>
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
