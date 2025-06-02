'use client';

import { useState, useRef, useEffect } from 'react';
import {
  QuestionMarkCircledIcon,
  PersonIcon,
  HamburgerMenuIcon,
} from '@radix-ui/react-icons';
import { signOut } from 'next-auth/react';

export default function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
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
    <div className='absolute top-4 right-4 z-50'>
      <div ref={dropdownRef} className='relative'>
        <button
          onClick={() => setShowDropdown((prev) => !prev)}
          className='w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-600 transition'
          title='Menu'
        >
          <HamburgerMenuIcon className='w-5 h-5' />
        </button>

        {showDropdown && (
          <div className='absolute border border-gray-300 rounded-md right-0 mt-2 w-48 bg-white text-gray-700 shadow-lg rounded-sm'>
            <button
              title='Help'
              className='w-full flex rounded-t-md items-center gap-2 px-4 py-2 text-sm hover:bg-gray-700 hover:text-white'
            >
              <QuestionMarkCircledIcon className='w-4 h-4' />
              Help
            </button>
            <button
              onClick={() => signOut()}
              title='Sign Out'
              className='w-full flex rounded-b-md items-center gap-2 px-4 py-2 text-sm hover:bg-gray-700 hover:text-white'
            >
              <PersonIcon className='w-4 h-4' />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
