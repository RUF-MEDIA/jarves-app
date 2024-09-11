import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header2 = () => {
  const pathname = usePathname();

  return (
    <nav className="min-w-full flex items-center w-full mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200">
      <div className="min-w-full flex items-center justify-start container mx-auto px-5 lg:px-10 ">
        <div className="flex items-center space-x-4">
          <Link href="/kunden" legacyBehavior>
            <a
              className={`py-3 px-2 ${
                pathname?.startsWith('/kunden') ? 'bg-slate-100 text-gray-900' : 'text-gray-700 hover:bg-slate-100 hover:text-gray-900'
              } dark:text-gray-400 dark:hover:text-white dark:hover:bg-slate-700`}
            >
              Kunden
            </a>
          </Link>
          <Link href="/kontaktperson" legacyBehavior>
            <a
              className={`py-3 px-2 ${
                pathname?.startsWith('/kontaktperson') ? 'bg-slate-100 text-gray-900' : 'text-gray-700 hover:bg-slate-100 hover:text-gray-900'
              } dark:text-gray-400 dark:hover:text-white dark:hover:bg-slate-700`}
            >
              Kontaktperson
            </a>
          </Link>
          <Link href="/jobs" legacyBehavior>
            <a
              className={`py-3 px-2 ${
                pathname?.startsWith('/jobs') ? 'bg-slate-100 text-gray-900' : 'text-gray-700 hover:bg-slate-100 hover:text-gray-900'
              } dark:text-gray-400 dark:hover:text-white dark:hover:bg-slate-700`}
            >
              Jobs
            </a>
          </Link>
          <Link href="/talente" legacyBehavior>
            <a
              className={`py-3 px-2 ${
                pathname?.startsWith('/talente') ? 'bg-slate-100 text-gray-900' : 'text-gray-700 hover:bg-slate-100 hover:text-gray-900'
              } dark:text-gray-400 dark:hover:text-white dark:hover:bg-slate-700`}
            >
              Talente
            </a>
          </Link>
          <Link href="/sales" legacyBehavior>
            <a
              className={`py-3 px-2 ${
                pathname?.startsWith('/sales') ? 'bg-slate-100 text-gray-900' : 'text-gray-700 hover:bg-slate-100 hover:text-gray-900'
              } dark:text-gray-400 dark:hover:text-white dark:hover:bg-slate-700`}
            >
              Sales
            </a>
          </Link>
          <Link href="/affiliate" legacyBehavior>
            <a
              className={`py-3 px-2 ${
                pathname?.startsWith('/affiliate') ? 'bg-slate-100 text-gray-900' : 'text-gray-700 hover:bg-slate-100 hover:text-gray-900'
              } dark:text-gray-400 dark:hover:text-white dark:hover:bg-slate-700`}
            >
              Affiliate
            </a>
          </Link>
          <Link href="/stellenanzeigen" legacyBehavior>
            <a
              className={`py-3 px-2 ${
                pathname?.startsWith('/stellenanzeigen') ? 'bg-slate-100 text-gray-900' : 'text-gray-700 hover:bg-slate-100 hover:text-gray-900'
              } dark:text-gray-400 dark:hover:text-white dark:hover:bg-slate-700`}
            >
              Stellenanzeigen
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header2;
