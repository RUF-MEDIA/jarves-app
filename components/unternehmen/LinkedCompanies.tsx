'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusCircle, XCircle } from 'lucide-react';
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

      const updatedCompanies = await fetch(`/api/linkedCompanies?currentCompanyId=${currentCompanyId}`).then((res) => res.json());
      setCompanies(updatedCompanies);

      setIsModalOpen(false);
      setNewCompanyId('');
      setUnternehmensverknuepfung('');
    } catch (error) {
      console.error('Error linking company:', error);
    }
  };

  const handleRemoveCompany = async (companyId: string) => {
    try {
      const response = await fetch('/api/unlinkCompany', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentCompanyId,
          companyId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to unlink company');
      }

      const updatedCompanies = await fetch(`/api/linkedCompanies?currentCompanyId=${currentCompanyId}`).then((res) => res.json());
      setCompanies(updatedCompanies);
    } catch (error) {
      console.error('Error unlinking company:', error);
    }
  };

  if (isLoading) {
    return <div>Lade Unternehmen...</div>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button className="h-full bg-gray-200 hover:bg-gray-300 text-gray-800 flex flex-col items-center justify-center transition-colors duration-200 w-12 min-h-[80px]">
            <PlusCircle size={20} />
            <span className="text-xs mt-1">Neu</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-sm">Unternehmen verknüpfen</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddCompany} className="space-y-2">
            <div>
              <Label htmlFor="newCompanyId" className="text-sm">
                Unternehmen auswählen
              </Label>
              <Select value={newCompanyId} onValueChange={setNewCompanyId}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Wählen Sie ein Unternehmen" />
                </SelectTrigger>
                <SelectContent>
                  {allCompanies.map((company) => (
                    <SelectItem key={company.id} value={company.id} className="text-sm">
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="unternehmensverknuepfung" className="text-sm">
                Art der Verknüpfung
              </Label>
              <Select value={unternehmensverknuepfung} onValueChange={setUnternehmensverknuepfung}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Wählen Sie die Art der Verknüpfung" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Muttergesellschaft" className="text-sm">
                    Muttergesellschaft
                  </SelectItem>
                  <SelectItem value="Tochtergesellschaft" className="text-sm">
                    Tochtergesellschaft
                  </SelectItem>
                  <SelectItem value="Schwestergesellschaft" className="text-sm">
                    Schwestergesellschaft
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full text-sm py-1">
              Verknüpfen
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {companies.map((company) => (
        <div key={company.id} className="relative w-1/5">
          <div
            className="p-2 rounded-lg flex flex-col justify-between transition-colors duration-200 hover:bg-opacity-80 bg-gray-100 hover:bg-gray-200"
            style={{ minHeight: '80px' }}
          >
            <button
              className="absolute top-1 right-1 text-red-600 hover:text-red-800"
              onClick={() => handleRemoveCompany(company.id)}
              aria-label="Entfernen"
            >
              <XCircle size={16} />
            </button>
            <Link href={`/kunden/${company.id}`}>
              <h3 className="font-semibold text-xs truncate text-blue-600 hover:underline">{company.name}</h3>
            </Link>
            <p className="text-xs text-gray-600 truncate mt-1">{company.unternehmensverknuepfung || 'Keine Verknüpfung'}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LinkedCompanies;
