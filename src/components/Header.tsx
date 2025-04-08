'use client';

import { useState, useRef, useEffect } from 'react';
import { QuestionMarkCircledIcon, PersonIcon } from '@radix-ui/react-icons';
import { signOut } from 'next-auth/react';

export default function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className='w-full h-20 bg-gray-800 text-white flex items-center justify-end px-8 relative'>
      {/* Right - Help + User Icons */}
      <div className='flex gap-6 items-center'>
        <button
          title='Help'
          className='w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-700 transition'
        >
          <QuestionMarkCircledIcon className='w-6 h-6 text-white' />
        </button>

        <div className='relative' ref={dropdownRef}>
          <button
            title='User'
            onClick={() => setShowDropdown(!showDropdown)}
            className='w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-700 transition'
          >
            <PersonIcon className='w-6 h-6 text-white' />
          </button>

          {showDropdown && (
            <div className='absolute right-0 mt-2 w-40 bg-white text-gray-800 shadow-lg rounded-sm py-2 z-50'>
              <button
                onClick={() => signOut()}
                className='block w-full text-left px-4 py-2 text-sm hover:bg-gray-100'
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
