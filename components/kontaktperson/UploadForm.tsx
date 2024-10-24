'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UploadFormProps {
  kontaktpersonId: string;
  onUploadSuccess: () => void;
  currentUserId: string;
}

const UploadForm: React.FC<UploadFormProps> = ({ kontaktpersonId, onUploadSuccess, currentUserId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [titel, setTitel] = useState('');
  const [artKunde, setArtKunde] = useState<'RAHMENVERTRAG' | 'MITSCHRIFT_GESPRAECH' | 'SONSTIGE_DOKUMENTE' | ''>('');
  const [individuelleBezeichnung, setIndividuelleBezeichnung] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !titel || !artKunde) {
      alert('Bitte füllen Sie alle Pflichtfelder aus');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('kontaktpersonId', kontaktpersonId);
    formData.append('titel', titel);
    formData.append('artKunde', artKunde);
    formData.append('individuelleBezeichnung', individuelleBezeichnung);
    formData.append('erstellerId', currentUserId);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      onUploadSuccess();
      setFile(null);
      setTitel('');
      setArtKunde('');
      setIndividuelleBezeichnung('');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Fehler beim Hochladen der Datei');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} required />
      <Input type="text" placeholder="Titel" value={titel} onChange={(e) => setTitel(e.target.value)} required />
      <Select
        value={artKunde}
        onValueChange={(value: 'RAHMENVERTRAG' | 'MITSCHRIFT_GESPRAECH' | 'SONSTIGE_DOKUMENTE') => setArtKunde(value)}
        required
      >
        <SelectTrigger>
          <SelectValue placeholder="Art des Dokuments" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="RAHMENVERTRAG">Rahmenvertrag</SelectItem>
          <SelectItem value="MITSCHRIFT_GESPRAECH">Mitschrift Gespräch</SelectItem>
          <SelectItem value="SONSTIGE_DOKUMENTE">Sonstige Dokumente</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="text"
        placeholder="Individuelle Bezeichnung (optional)"
        value={individuelleBezeichnung}
        onChange={(e) => setIndividuelleBezeichnung(e.target.value)}
      />
      <Button type="submit">Hochladen</Button>
    </form>
  );
};

export default UploadForm;
