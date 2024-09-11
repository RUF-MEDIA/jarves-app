'use client';

import { useState } from 'react';

export default function ProfilePictureUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleProfilePictureUpload = async () => {
    const token = localStorage.getItem('token');
    console.log('Token in Frontend:', token); // Token prüfen

    if (!file) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('profilBild', file);

    try {
      const response = await fetch('/api/upload-profile-picture', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // Token prüfen
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('Error uploading picture:', data.message);
        setUploadMessage('Upload failed: ' + data.message);
      } else {
        console.log('Upload successful:', data.profilBildUrl);
        setUploadMessage('Upload successful!');
        onUploadSuccess(data.profilBildUrl);
      }
    } catch (error) {
      console.error('Error:', error);
      setUploadMessage('Error uploading profile picture.');
    }
  };

  return (
    <div className="profile-picture-upload">
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleProfilePictureUpload} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Upload Profile Picture
      </button>
      {uploadMessage && <p>{uploadMessage}</p>}
    </div>
  );
}
