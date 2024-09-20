// app/profile/page.tsx

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
  const [profilBild, setProfilBild] = useState<string | null>(null); // Neues State für Profilbild
  const router = useRouter();

  // Holen der Benutzerinformationen beim Laden der Seite
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile', {
          method: 'GET',
          credentials: 'include', // Sorgt dafür, dass Cookies mitgesendet werden
        });

        if (response.ok) {
          const data = await response.json();
          setVorname(data.vorname);
          setName(data.name);
          setEmail(data.email);
          setProfilBild(data.profilBild); // Setzen des Profilbilds
        } else {
          // Bei einem Fehler (z.B. 401 Unauthorized) zur Login-Seite weiterleiten
          router.push('/login');
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        router.push('/login'); // Bei einem Fehler ebenfalls zur Login-Seite weiterleiten
      }
    };

    fetchProfile();
  }, [router]);

  // Funktion zum Speichern der Änderungen
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Sorgt dafür, dass Cookies mitgesendet werden
        body: JSON.stringify({ vorname, name, email, password }),
      });

      if (response.ok) {
        setMessage('Profil erfolgreich aktualisiert');
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Fehler beim Aktualisieren des Profils');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      setMessage('Etwas ist schiefgelaufen');
    }
  };

  const handleUploadSuccess = (url: string) => {
    setProfilBild(url);
    setUploadMessage('Profilbild erfolgreich hochgeladen!');
    setTimeout(() => setUploadMessage(''), 3000); // Meldung nach 3 Sekunden ausblenden
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-5">
      <div className="bg-white shadow-lg rounded-lg max-w-2xl w-full p-8">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">Profil bearbeiten</h1>

        <div className="flex flex-col items-center mb-6">
          {profilBild ? (
            <img src={profilBild} alt="Profilbild" className="w-32 h-32 rounded-full object-cover mb-4" />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
              <span className="text-gray-500">Kein Bild</span>
            </div>
          )}
          <ProfilePictureUpload onUploadSuccess={handleUploadSuccess} />
          {uploadMessage && <p className="text-green-500 mt-2">{uploadMessage}</p>}
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div>
            <Label htmlFor="vorname" className="block text-gray-700 font-medium mb-2">
              Vorname
            </Label>
            <Input
              type="text"
              id="vorname"
              value={vorname}
              onChange={(e) => setVorname(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Nachname
            </Label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              E-Mail
            </Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Passwort ändern (optional)
            </Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Neues Passwort eingeben"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-200">
            Speichern
          </Button>
          {message && <p className={`text-center mt-4 ${message.includes('erfolgreich') ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}
        </form>
      </div>
    </div>
  );
}
