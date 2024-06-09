import React from 'react';
import Image from 'next/image';
import Header1 from '@/components/header1';
import Header2 from '@/components/header2';

const Header = () => {
  return (
    <header className="flex flex-col z-50 w-full bg-white border-b text-sm pt-5 dark:bg-neutral-900 dark:border-neutral-700">
      <Header1 />
      <Header2 />
    </header>
  );
};

export default Header;
