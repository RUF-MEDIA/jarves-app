// components/unternehmen/LinkCompanyModal.tsx
'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface LinkCompanyModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  currentCompanyId: string;
}

const LinkCompanyModal: React.FC<LinkCompanyModalProps> = ({ isOpen, onRequestClose, currentCompanyId }) => {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [linkType, setLinkType] = useState('');

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany || !linkType) {
      console.error('Bitte füllen Sie alle Pflichtfelder aus');
      return;
    }

    try {
      const response = await axios.post('/api/linkCompany', {
        currentCompanyId,
        selectedCompany,
        linkType,
      });
      console.log('Verknüpfung erfolgreich:', response.data);
      onRequestClose();
    } catch (error) {
      console.error('Fehler beim Verknüpfen der Unternehmen:', error);
    }
  };

  return (
    <form onSubmit={handleLink} className="space-y-4">
      <div>
        <Label htmlFor="company-select">Unternehmen wählen</Label>
        <Select value={selectedCompany} onValueChange={setSelectedCompany}>
          <SelectTrigger id="company-select">
            <SelectValue placeholder="Wählen Sie ein Unternehmen" />
          </SelectTrigger>
          <SelectContent>
            {/* Optionen sollten dynamisch geladen werden, Beispiel: */}
            <SelectItem value="CompanyID1">Unternehmen 1</SelectItem>
            <SelectItem value="CompanyID2">Unternehmen 2</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="linkType">Verknüpfungsart</Label>
        <Input id="linkType" value={linkType} onChange={(e) => setLinkType(e.target.value)} placeholder="Art der Verknüpfung" />
      </div>
      <Button type="submit" className="w-full">
        Verknüpfen
      </Button>
    </form>
  );
};

export default LinkCompanyModal;
