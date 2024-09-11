'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import ProfilePictureUpload from '@/components/ProfilePictureUpload';

export default function ProfilePage() {
  const [vorname, setVorname] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  const router = useRouter();

  // Holen der Benutzerinformationen beim Laden der Seite
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setVorname(data.vorname);
          setName(data.name);
          setEmail(data.email);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, [router]);

  // Funktion zum Speichern der Änderungen
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ vorname, name, email, password }),
      });

      if (response.ok) {
        setMessage('Profil erfolgreich aktualisiert');
      } else {
        setMessage('Fehler beim Aktualisieren des Profils');
      }
    } catch (error) {
      setMessage('Etwas ist schiefgelaufen');
    }
  };

  const handleUploadSuccess = () => {
    setUploadMessage('Profilbild erfolgreich hochgeladen!');
    setTimeout(() => setUploadMessage(''), 3000); // Meldung nach 3 Sekunden ausblenden
  };

  return (
    <div className="bg-white min-w-full px-5 ms-5 pt-10 pb-10">
      <h1 className="text-center text-2xl font-semibold mb-6">Profil bearbeiten</h1>
      <ProfilePictureUpload onUploadSuccess={handleUploadSuccess} />
      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div>
          <Label htmlFor="vorname">Vorname</Label>
          <Input type="text" id="vorname" value={vorname} onChange={(e) => setVorname(e.target.value)} required className="w-full" />
        </div>
        <div>
          <Label htmlFor="name">Nachname</Label>
          <Input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full" />
        </div>
        <div>
          <Label htmlFor="email">E-Mail</Label>
          <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full" />
        </div>
        <div>
          <Label htmlFor="password">Passwort ändern (optional)</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Neues Passwort eingeben"
            className="w-full"
          />
        </div>
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          Speichern
        </Button>
      </form>
      {message && <p className="text-center mt-4 text-green-500">{message}</p>}
      {uploadMessage && <p className="text-center mt-4 text-green-500">{uploadMessage}</p>}
    </div>
  );
}
