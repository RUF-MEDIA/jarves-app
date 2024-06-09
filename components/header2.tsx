// components/Header2.tsx
import React from 'react';
import Link from 'next/link';

const Header2 = () => {
  return (
    <nav className="max-w-7xl flex basis-full items-center w-full mt-3 mx-auto px-4 sm:px-6 lg:px-8" aria-label="Secondary">
      <div className="flex flex-col sm:flex-row w-full">
        <Link href="/kunden" legacyBehavior>
          <a className="text-gray-700 hover:bg-slate-100 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white dark:hover:bg-slate-700 py-2 px-4 sm:px-6 w-full text-center sm:text-left">
            Kunden
          </a>
        </Link>
        <Link href="/kontaktperson" legacyBehavior>
          <a className="text-gray-700 hover:bg-slate-100 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white dark:hover:bg-slate-700 py-2 px-4 sm:px-6 w-full text-center sm:text-left">
            Kontaktperson
          </a>
        </Link>
        <Link href="/jobs" legacyBehavior>
          <a className="text-gray-700 hover:bg-slate-100 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white dark:hover:bg-slate-700 py-2 px-4 sm:px-6 w-full text-center sm:text-left">
            Jobs
          </a>
        </Link>
        <Link href="/talente" legacyBehavior>
          <a className="text-gray-700 hover:bg-slate-100 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white dark:hover:bg-slate-700 py-2 px-4 sm:px-6 w-full text-center sm:text-left">
            Talente
          </a>
        </Link>
        <Link href="/sales" legacyBehavior>
          <a className="text-gray-700 hover:bg-slate-100 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white dark:hover:bg-slate-700 py-2 px-4 sm:px-6 w-full text-center sm:text-left">
            Sales
          </a>
        </Link>
        <Link href="/affiliate" legacyBehavior>
          <a className="text-gray-700 hover:bg-slate-100 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white dark:hover:bg-slate-700 py-2 px-4 sm:px-6 w-full text-center sm:text-left">
            Affiliate
          </a>
        </Link>
        <Link href="/stellenanzeigen" legacyBehavior>
          <a className="text-gray-700 hover:bg-slate-100 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white dark:hover:bg-slate-700 py-2 px-4 sm:px-6 w-full text-center sm:text-left">
            Stellenanzeigen
          </a>
        </Link>
      </div>
    </nav>
  );
};

export default Header2;
