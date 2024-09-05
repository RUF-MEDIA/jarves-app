// components/unternehmen/downloads.tsx
'use client';

import React, { useState, useEffect } from 'react';
import UploadForm from './UploadForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface DownloadsProps {
  unternehmen: any;
  documents: any[];
}

const Downloads: React.FC<DownloadsProps> = ({ unternehmen, documents }) => {
  const [currentDocuments, setCurrentDocuments] = useState(documents);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const refreshDocuments = async () => {
    const response = await fetch(`/api/documents?unternehmenId=${unternehmen.id}`);
    const newDocuments = await response.json();
    setCurrentDocuments(newDocuments);
  };

  useEffect(() => {
    const refreshDocuments = async () => {
      const response = await fetch(`/api/documents?unternehmenId=${unternehmen.id}`);
      const newDocuments = await response.json();
      setCurrentDocuments(newDocuments);
    };

    refreshDocuments();
  }, [unternehmen.id]);

  const handleUploadSuccess = () => {
    refreshDocuments();
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-4 mt-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold ">Downloads</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Neues Dokument hochladen</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dokument hochladen</DialogTitle>
              <DialogDescription>Laden Sie hier ein neues Dokument für dieses Unternehmen hoch.</DialogDescription>
            </DialogHeader>
            <UploadForm unternehmenId={unternehmen.id} onUploadSuccess={handleUploadSuccess} />
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Vorhandene Dokumente</h3>
        {currentDocuments.length > 0 ? (
          <ul className="space-y-2">
            {currentDocuments.map((doc) => (
              <li key={doc.id} className="flex items-center space-x-2">
                <a href={doc.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {doc.titel}
                </a>
                <span className="text-sm text-gray-500">({doc.artKunde})</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Keine Dokumente vorhanden</p>
        )}
      </div>
    </div>
  );
};

export default Downloads;
