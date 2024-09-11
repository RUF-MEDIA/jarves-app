import { useState } from 'react';

interface ProfilePictureUploadProps {
  onUploadSuccess: () => void; // Definiere den Typ für onUploadSuccess
}

export default function ProfilePictureUpload({ onUploadSuccess }: ProfilePictureUploadProps) {
  const [file, setFile] = useState<File | null>(null); // Typ für file hinzufügen
  const [uploadMessage, setUploadMessage] = useState('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setUploadMessage('Bitte wählen Sie eine Datei aus.');
      return;
    }

    const formData = new FormData();
    formData.append('profilBild', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/upload-profile-picture', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        onUploadSuccess();
        setUploadMessage('Profilbild erfolgreich hochgeladen!');
      } else {
        setUploadMessage('Fehler beim Hochladen des Profilbilds.');
      }
    } catch (error) {
      console.error('Fehler beim Hochladen:', error);
      setUploadMessage('Fehler beim Hochladen.');
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <div>
        <label htmlFor="file">Profilbild hochladen</label>
        <input type="file" id="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full" accept="image/*" />
      </div>
      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg">
        Hochladen
      </button>
      {uploadMessage && <p className="text-green-500 mt-4">{uploadMessage}</p>}
    </form>
  );
}
