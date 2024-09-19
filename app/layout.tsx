// app/layout.tsx

import './globals.css';
import { Navbar } from '@/components/navbar';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers'; // Importiere 'cookies' aus 'next/headers'

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  const isLoggedIn = !!token;

  return (
    <html lang="de">
      <head>
        <Script src="https://www.bugherd.com/sidebarv2.js?apikey=xzuc6tx4z6tbqc3qhpfwwa" strategy="afterInteractive" />
      </head>
      <body className={`${inter.className} bg-slate-50`}>
        {isLoggedIn && <Navbar />}
        <div className="min-w-full flex items-center w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="min-w-full flex items-center justify-between container mx-auto my-5 px-5 lg:px-10">{children}</div>
        </div>
      </body>
    </html>
  );
}
