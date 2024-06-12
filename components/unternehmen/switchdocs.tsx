'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Stammdaten from '@/components/unternehmen/stammdaten';

const Switchdocs = ({ unternehmen }: { unternehmen: any }) => {
  return (
    <Tabs defaultValue="Stammdaten" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="Stammdaten">Stammdaten</TabsTrigger>
        <TabsTrigger value="Downloads">Downloads</TabsTrigger>
      </TabsList>
      <TabsContent value="Stammdaten">
        <Stammdaten unternehmen={unternehmen} />
      </TabsContent>
      <TabsContent value="Downloads">Downloads content here.</TabsContent>
    </Tabs>
  );
};

export default Switchdocs;
