// app/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import Logo from '@/public/images/Logo-rec2rec.svg'; // Ihr Logo importieren
import { useCookies } from 'react-cookie';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState('');
  const [cookies] = useCookies(['token']);

  useEffect(() => {
    // Bildschirmgröße ermitteln und die URL des Bildes dynamisch setzen
    const { innerWidth, innerHeight } = window;
    setImageUrl(`https://picsum.photos/${innerWidth}/${innerHeight}`);

    // Wenn der Benutzer bereits authentifiziert ist, weiterleiten
    if (cookies.token) {
      router.push('/dashboard');
    }
  }, [cookies.token, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Der Token wird als HTTP-Only Cookie gesetzt, daher kein localStorage-Eintrag
        router.push('/dashboard'); // Weiterleiten nach erfolgreichem Login
      } else {
        const result = await response.json();
        setError(result.message);
      }
    } catch (error) {
      setError('Etwas ist schiefgelaufen');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }}>
      <Card className="w-full max-w-md bg-white bg-opacity-90 shadow-lg">
        <CardHeader className="flex flex-col items-center">
          {/* Logo über dem Titel */}
          <Image src={Logo} alt="Logo" className="w-40 mb-4" /> {/* Größe anpassen */}
          <CardTitle className="text-center text-2xl font-semibold">Willkommen zurück</CardTitle>
          <CardDescription className="text-center">Bitte melden Sie sich an</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail-Adresse</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ihre E-Mail-Adresse eingeben"
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Passwort</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ihr Passwort eingeben"
                required
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Anmelden
            </Button>
          </form>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
