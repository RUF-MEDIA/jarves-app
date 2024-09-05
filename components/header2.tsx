// components/header2.tsx
import React from 'react';
import Link from 'next/link';

const Header2 = () => {
  return (
    <nav className="min-w-full flex items-center w-full mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200">
      <div className="min-w-full flex items-center justify-start container mx-auto px-5 lg:px-10 ">
        <div className="flex items-center space-x-4">
          <Link href="/kunden" legacyBehavior>
            <a className="text-gray-700 hover:bg-slate-100 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white dark:hover:bg-slate-700 py-3 px-2">
              Kunden
            </a>
          </Link>
          <Link href="/kontaktperson" legacyBehavior>
            <a className="text-gray-700 hover:bg-slate-100 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white dark:hover:bg-slate-700 py-3 px-2">
              Kontaktperson
            </a>
          </Link>
          <Link href="/jobs" legacyBehavior>
            <a className="text-gray-700 hover:bg-slate-100 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white dark:hover:bg-slate-700 py-3 px-2">
              Jobs
            </a>
          </Link>
          <Link href="/talente" legacyBehavior>
            <a className="text-gray-700 hover:bg-slate-100 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white dark:hover:bg-slate-700 py-3 px-2">
              Talente
            </a>
          </Link>
          <Link href="/sales" legacyBehavior>
            <a className="text-gray-700 hover:bg-slate-100 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white dark:hover:bg-slate-700 py-3 px-2">
              Sales
            </a>
          </Link>
          <Link href="/affiliate" legacyBehavior>
            <a className="text-gray-700 hover:bg-slate-100 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white dark:hover:bg-slate-700 py-3 px-2">
              Affiliate
            </a>
          </Link>
          <Link href="/stellenanzeigen" legacyBehavior>
            <a className="text-gray-700 hover:bg-slate-100 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white dark:hover:bg-slate-700 py-3 px-2">
              Stellenanzeigen
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header2;
