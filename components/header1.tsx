// components/header1.tsx

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/public/images/Logo-rec2rec.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faCalendarAlt, faTasks } from '@fortawesome/free-solid-svg-icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Navbar() {
  return (
    <div className="min-w-full flex items-center w-full mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200">
      <div className="min-w-full flex items-center justify-between container mx-auto px-5 lg:px-10 ">
        <div className="w-1/3 flex items-center">
          <Link href="/">
            <Image src={Logo} alt="Logo" className="w-40" />
          </Link>
        </div>
        <div className="w-1/2 flex justify-center">
          <div className="rounded-full border px-5 py-2 w-full max-w-md">Ich suche ...</div>
        </div>

        <div className="w-1/3 flex justify-end items-center space-x-5">
          <FontAwesomeIcon icon={faEnvelope} className="text-slate-200" style={{ height: '16px' }} />
          <FontAwesomeIcon icon={faCalendarAlt} className="text-slate-200" style={{ height: '16px' }} />
          <FontAwesomeIcon icon={faTasks} className="text-slate-200" style={{ height: '16px' }} />
          <div className="w-10 h-10">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
