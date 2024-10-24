// components/kontaktperson/switchdocs.tsx

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Stammdaten from '@/components/kontaktperson/stammdaten';
import Downloads from '@/components/kontaktperson/downloads';
import { Ansprechpartner, Dokument } from '@prisma/client';

// Erweitertes Interface für Dokumente, das die erforderlichen Felder enthält
interface ExtendedDokument extends Dokument {
  ersteller: {
    id: string;
    vorname: string;
    name: string;
  } | null;
}

interface SwitchdocsProps {
  kontaktperson: Ansprechpartner;
  documents: ExtendedDokument[];
}

const Switchdocs: React.FC<SwitchdocsProps> = ({ kontaktperson, documents }) => {
  return (
    <Tabs defaultValue="Stammdaten" className="w-full">
      <TabsList>
        <TabsTrigger value="Stammdaten">Stammdaten</TabsTrigger>
        <TabsTrigger value="Downloads">Downloads</TabsTrigger>
      </TabsList>
      <TabsContent value="Stammdaten">
        <Stammdaten kontaktperson={kontaktperson} />
      </TabsContent>
      <TabsContent value="Downloads">
        <Downloads kontaktperson={kontaktperson} documents={documents} />
      </TabsContent>
    </Tabs>
  );
};

export default Switchdocs;
