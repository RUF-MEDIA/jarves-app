// components/unternehmen/UploadForm.tsx
'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface UploadFormProps {
  unternehmenId: string;
  onUploadSuccess: () => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ unternehmenId, onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [titel, setTitel] = useState('');
  const [artKunde, setArtKunde] = useState<'RAHMENVERTRAG' | 'MITSCHRIFT_GESPRAECH' | 'SONSTIGE_DOKUMENTE' | ''>('');
  const [individuelleBezeichnung, setIndividuelleBezeichnung] = useState('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !titel || !artKunde) {
      console.error('Bitte füllen Sie alle Pflichtfelder aus');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('unternehmenId', unternehmenId);
    formData.append('titel', titel);
    formData.append('artKunde', artKunde);
    if (individuelleBezeichnung) {
      formData.append('individuelleBezeichnung', individuelleBezeichnung);
    }

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Upload erfolgreich:', response.data);
      setFile(null);
      setTitel('');
      setArtKunde('');
      setIndividuelleBezeichnung('');
      onUploadSuccess();
    } catch (error) {
      console.error('Fehler beim Hochladen der Datei:', error);
    }
  };

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <div>
        <Label htmlFor="file">Datei</Label>
        <Input id="file" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
      </div>
      <div>
        <Label htmlFor="titel">Titel</Label>
        <Input id="titel" type="text" value={titel} onChange={(e) => setTitel(e.target.value)} placeholder="Titel" required />
      </div>
      <div>
        <Label htmlFor="artKunde">Art des Dokuments</Label>
        <Select value={artKunde} onValueChange={(value) => setArtKunde(value as 'RAHMENVERTRAG' | 'MITSCHRIFT_GESPRAECH' | 'SONSTIGE_DOKUMENTE')}>
          <SelectTrigger>
            <SelectValue placeholder="Wählen Sie die Art des Dokuments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="RAHMENVERTRAG">Rahmenvertrag</SelectItem>
            <SelectItem value="MITSCHRIFT_GESPRAECH">Mitschrift Gespräch</SelectItem>
            <SelectItem value="SONSTIGE_DOKUMENTE">Sonstige Dokumente</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="individuelleBezeichnung">Individuelle Bezeichnung (optional)</Label>
        <Input
          id="individuelleBezeichnung"
          type="text"
          value={individuelleBezeichnung}
          onChange={(e) => setIndividuelleBezeichnung(e.target.value)}
          placeholder="Individuelle Bezeichnung"
        />
      </div>
      <Button type="submit" className="w-full">
        Hochladen
      </Button>
    </form>
  );
};

export default UploadForm;
