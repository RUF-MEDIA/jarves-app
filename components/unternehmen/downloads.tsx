'use client';

import React, { useState, useEffect } from 'react';
import UploadForm from './UploadForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileIcon, UploadIcon, XIcon } from 'lucide-react';

interface Document {
  id: string;
  titel: string;
  artKunde: 'RAHMENVERTRAG' | 'MITSCHRIFT_GESPRAECH' | 'SONSTIGE_DOKUMENTE';
  link: string;
  erstelltAm: string;
  ersteller: {
    id: string;
    vorname: string;
    name: string;
  } | null;
  individuelleBezeichnung?: string;
}

interface DownloadsProps {
  unternehmen: any;
  documents: Document[];
}

const DocumentViewer: React.FC<{ document: Document | null; onClose: () => void }> = ({ document, onClose }) => {
  if (!document) return null;

  const isImage = document.link.match(/\.(jpeg|jpg|gif|png)$/i) !== null;
  const isPDF = document.link.match(/\.pdf$/i) !== null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg w-4/5 h-4/5 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{document.titel}</h2>
          <Button onClick={onClose} variant="ghost" size="icon">
            <XIcon className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex-grow overflow-auto">
          {isImage && <img src={document.link} alt={document.titel} className="max-w-full h-auto" />}
          {isPDF && <iframe src={document.link} title={document.titel} className="w-full h-full" />}
          {!isImage && !isPDF && (
            <p>
              Dieses Dateiformat kann nicht direkt angezeigt werden.{' '}
              <a href={document.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Dokument herunterladen
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const Downloads: React.FC<DownloadsProps> = ({ unternehmen, documents }) => {
  const [currentDocuments, setCurrentDocuments] = useState<Document[]>(documents);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  useEffect(() => {
    console.log('Initial documents:', documents);
    setCurrentDocuments(documents);
  }, [documents]);

  useEffect(() => {
    fetch('/api/getCurrentUser')
      .then((response) => response.json())
      .then((data) => {
        if (data.userId) {
          setCurrentUserId(data.userId);
        }
      })
      .catch((error) => console.error('Fehler beim Abrufen der Benutzer-ID:', error));
  }, []);

  const refreshDocuments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/documents?unternehmenId=${unternehmen.id}`);
      if (!response.ok) {
        throw new Error('Fehler beim Abrufen der Dokumente');
      }
      const newDocuments = await response.json();
      console.log('Refreshed documents:', newDocuments);
      setCurrentDocuments(newDocuments);
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Dokumente:', error);
      setError('Fehler beim Laden der Dokumente. Bitte versuchen Sie es später erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshDocuments();
  }, [unternehmen.id]);

  const handleUploadSuccess = () => {
    refreshDocuments();
    setIsDialogOpen(false);
  };

  const getUploaderName = (ersteller: Document['ersteller']) => {
    if (!ersteller) return 'Unbekannter Benutzer';
    return `${ersteller.vorname} ${ersteller.name}`.trim() || 'Unbekannter Benutzer';
  };

  const handleDocumentClick = (doc: Document) => {
    setSelectedDocument(doc);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Downloads</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UploadIcon className="mr-2 h-4 w-4" />
                Neues Dokument hochladen
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dokument hochladen</DialogTitle>
                <DialogDescription>Laden Sie hier ein neues Dokument für dieses Unternehmen hoch.</DialogDescription>
              </DialogHeader>
              {currentUserId && <UploadForm unternehmenId={unternehmen.id} onUploadSuccess={handleUploadSuccess} currentUserId={currentUserId} />}
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription>Vorhandene Dokumente für dieses Unternehmen</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          {isLoading ? (
            <p>Lade Dokumente...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : currentDocuments.length > 0 ? (
            <ul className="space-y-4">
              {currentDocuments.map((doc) => (
                <li key={doc.id} className="flex items-start space-x-4">
                  <FileIcon className="h-6 w-6 flex-shrink-0 text-blue-500" />
                  <div className="flex-grow">
                    <button onClick={() => handleDocumentClick(doc)} className="text-blue-600 hover:underline font-medium">
                      {doc.titel}
                    </button>
                    <p className="text-sm text-gray-500">{doc.artKunde}</p>
                    {doc.individuelleBezeichnung && <p className="text-sm text-gray-600">{doc.individuelleBezeichnung}</p>}
                    <p className="text-xs text-gray-400">
                      Hochgeladen von {getUploaderName(doc.ersteller)} am {new Date(doc.erstelltAm).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Keine Dokumente vorhanden</p>
          )}
        </ScrollArea>
      </CardContent>
      <DocumentViewer document={selectedDocument} onClose={() => setSelectedDocument(null)} />
    </Card>
  );
};

export default Downloads;
