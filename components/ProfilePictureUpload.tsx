import { useState } from 'react';

interface ProfilePictureUploadProps {
  onUploadSuccess: (url: string) => void; // Übergibt die URL des hochgeladenen Bildes
}

export default function ProfilePictureUpload({ onUploadSuccess }: ProfilePictureUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [preview, setPreview] = useState<string | null>(null); // Vorschau-URL

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
        const data = await response.json();
        onUploadSuccess(data.profilBildUrl); // Übergibt die URL an das Parent-Component
        setUploadMessage('Profilbild erfolgreich hochgeladen!');
        setPreview(data.profilBildUrl); // Setzt die Vorschau
        setFile(null); // Reset der Datei
      } else {
        const errorData = await response.json();
        setUploadMessage(errorData.message || 'Fehler beim Hochladen des Profilbilds.');
      }
    } catch (error) {
      console.error('Fehler beim Hochladen:', error);
      setUploadMessage('Fehler beim Hochladen.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  return (
    <form onSubmit={handleUpload} className="w-full">
      <div className="mb-4">
        <label htmlFor="file" className="block text-gray-700 font-medium mb-2">
          Profilbild hochladen
        </label>
        <input
          type="file"
          id="file"
          onChange={handleFileChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          accept="image/*"
        />
      </div>
      {preview && (
        <div className="mb-4">
          <p className="text-gray-700 mb-2">Vorschau:</p>
          <img src={preview} alt="Vorschau" className="w-32 h-32 rounded-full object-cover" />
        </div>
      )}
      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-200">
        Hochladen
      </button>
      {uploadMessage && <p className="text-center mt-2 text-green-500">{uploadMessage}</p>}
    </form>
  );
}
