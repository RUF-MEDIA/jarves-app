'use client'; // Deklariert die Komponente als Client-Komponente

import './globals.css';
import { Navbar } from '@/components/navbar';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation'; // Importiere usePathname

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null = Ladezustand
  const router = useRouter();
  const pathname = usePathname(); // Aktueller Pfad

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        if (pathname !== '/login') {
          router.push('/login');
        }
      }
    };

    checkAuth();
  }, [router, pathname]);

  if (isLoggedIn === null) {
    // Optional: Ladeanzeige während der Authentifizierung
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-slate-50">
        <p className="text-gray-500">Lade...</p>
      </div>
    );
  }

  return (
    <html lang="de">
      <head>
        <Script src="https://www.bugherd.com/sidebarv2.js?apikey=xzuc6tx4z6tbqc3qhpfwwa" strategy="afterInteractive" />
      </head>
      <body className={`${inter.className} bg-slate-50`}>
        {isLoggedIn && <Navbar />}
        {/* Überprüfen, ob der Benutzer eingeloggt ist */}
        {isLoggedIn ? (
          <div className="min-w-full flex items-center w-full mx-auto px-4 sm:px-6 lg:px-8 ">
            <div className="min-w-full flex items-center justify-between container mx-auto my-5 px-5 lg:px-10 ">{children}</div>
          </div>
        ) : (
          // Falls nicht eingeloggt, fülle den Bildschirm mit Login-Komponente oder anderen Inhalten
          <div className="w-screen h-screen flex items-center justify-center">{children}</div>
        )}
      </body>
    </html>
  );
}
