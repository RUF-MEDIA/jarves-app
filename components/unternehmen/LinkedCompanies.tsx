// components/unternehmen/LinkedCompanies.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Company {
  id: string;
  name: string;
  unternehmensverknuepfung: string | null;
}

const LinkedCompanies = ({ currentCompanyId }: { currentCompanyId: string }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCompanyId, setNewCompanyId] = useState('');
  const [unternehmensverknuepfung, setUnternehmensverknuepfung] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLinkedCompanies = async () => {
      try {
        const response = await fetch(`/api/linkedCompanies?currentCompanyId=${currentCompanyId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch linked companies');
        }
        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error('Error fetching linked companies:', error);
      }
    };

    const fetchAllCompanies = async () => {
      try {
        const response = await fetch('/api/allCompanies');
        if (!response.ok) {
          throw new Error('Failed to fetch all companies');
        }
        const data = await response.json();
        setAllCompanies(data);
      } catch (error) {
        console.error('Error fetching all companies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinkedCompanies();
    fetchAllCompanies();
  }, [currentCompanyId]);

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyId || !unternehmensverknuepfung) {
      console.error('Bitte füllen Sie alle Pflichtfelder aus');
      return;
    }

    try {
      const response = await fetch('/api/linkCompany', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentCompanyId,
          selectedCompany: newCompanyId,
          unternehmensverknuepfung,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to link company');
      }

      // Aktualisiere die Liste der verknüpften Unternehmen
      const updatedCompanies = await fetch(`/api/linkedCompanies?currentCompanyId=${currentCompanyId}`).then((res) => res.json());
      setCompanies(updatedCompanies);

      setIsModalOpen(false);
      setNewCompanyId('');
      setUnternehmensverknuepfung('');
    } catch (error) {
      console.error('Error linking company:', error);
    }
  };

  if (isLoading) {
    return <div>Lade Unternehmen...</div>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button
            className="h-full bg-gray-200 hover:bg-gray-300 text-gray-800 flex flex-col items-center justify-center transition-colors duration-200"
            style={{ width: '60px', minHeight: '100px' }}
          >
            <PlusCircle size={24} />
            <span className="text-xs mt-2">Neu</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unternehmen verknüpfen</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddCompany} className="space-y-4">
            <div>
              <Label htmlFor="newCompanyId">Unternehmen auswählen</Label>
              <Select value={newCompanyId} onValueChange={setNewCompanyId}>
                <SelectTrigger>
                  <SelectValue placeholder="Wählen Sie ein Unternehmen" />
                </SelectTrigger>
                <SelectContent>
                  {allCompanies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="unternehmensverknuepfung">Art der Verknüpfung</Label>
              <Select value={unternehmensverknuepfung} onValueChange={setUnternehmensverknuepfung}>
                <SelectTrigger>
                  <SelectValue placeholder="Wählen Sie die Art der Verknüpfung" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Muttergesellschaft">Muttergesellschaft</SelectItem>
                  <SelectItem value="Tochtergesellschaft">Tochtergesellschaft</SelectItem>
                  <SelectItem value="Schwestergesellschaft">Schwestergesellschaft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Verknüpfen
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {companies.map((company) => (
        <Link
          key={company.id}
          href={`/kunden/${company.id}`}
          className={`p-4 rounded-lg flex flex-col justify-between transition-colors duration-200 hover:bg-opacity-80 ${
            company.id === currentCompanyId ? 'bg-blue-100 hover:bg-blue-200' : 'bg-gray-100 hover:bg-gray-200'
          }`}
          style={{ width: 'calc(25% - 0.5rem)', minHeight: '100px' }}
        >
          <h3 className="font-semibold text-sm truncate">{company.name}</h3>
          <p className="text-xs text-gray-600 truncate mt-2">{company.unternehmensverknuepfung || 'Keine Verknüpfung'}</p>
        </Link>
      ))}
    </div>
  );
};

export default LinkedCompanies;
