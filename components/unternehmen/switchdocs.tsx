// components/unternehmen/switchdocs.tsx

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Stammdaten from '@/components/unternehmen/stammdaten';
import Downloads from '@/components/unternehmen/downloads';

interface SwitchdocsProps {
  unternehmen: any;
  documents: any[];
}

const Switchdocs: React.FC<SwitchdocsProps> = ({ unternehmen, documents }) => {
  return (
    <Tabs defaultValue="Stammdaten" className="w-full">
      <TabsList>
        <TabsTrigger value="Stammdaten">Stammdaten</TabsTrigger>
        <TabsTrigger value="Downloads">Downloads</TabsTrigger>
      </TabsList>
      <TabsContent value="Stammdaten">
        <Stammdaten unternehmen={unternehmen} />
      </TabsContent>
      <TabsContent value="Downloads">
        <Downloads unternehmen={unternehmen} documents={documents} />
      </TabsContent>
    </Tabs>
  );
};

export default Switchdocs;
