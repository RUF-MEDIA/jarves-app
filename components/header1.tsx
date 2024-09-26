// components/header1.tsx

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/public/images/Logo-rec2rec.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faCalendarAlt, faTasks, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

export default function Header1() {
  const [profilBild, setProfilBild] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Profilbild vom Server holen
    fetch('/api/profile')
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Failed to fetch profile');
      })
      .then((data) => {
        if (data && data.profilBild) {
          setProfilBild(data.profilBild); // Profilbild setzen
        }
      })
      .catch((error) => {
        console.error('Fehler beim Laden des Profilbilds:', error);
      });
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/login');
      } else {
        console.error('Fehler beim Logout');
      }
    } catch (error) {
      console.error('Fehler beim Logout:', error);
    }
  };

  return (
    <div className="min-w-full flex items-center w-full mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200">
      <div className="min-w-full flex items-center justify-between container mx-auto px-5 lg:px-10">
        <div className="w-1/3 flex items-center">
          <Link href="/dashboard">
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
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={profilBild || 'https://github.com/shadcn.png'}
                alt="Profilbild"
                className="w-full h-full object-cover rounded-full" // Stile für das Bild
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>

          {/* Dropdown-Menü */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center">
                <FontAwesomeIcon icon={faCaretDown} className="ml-2 text-slate-400" style={{ height: '16px' }} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push('/profil')}>Profil bearbeiten</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
