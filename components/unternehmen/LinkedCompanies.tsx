'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface Company {
  id: string;
  name: string;
  unternehmensverknuepfung: string | null;
}

const LinkedCompanies: React.FC<{ currentCompanyId: string }> = ({ currentCompanyId }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [companyToRemove, setCompanyToRemove] = useState<Company | null>(null);
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
      setIsConfirmModalOpen(false);
      setCompanyToRemove(null);
    } catch (error) {
      console.error('Error unlinking company:', error);
    }
  };

  if (isLoading) {
    return <div>Lade Unternehmen...</div>;
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-4">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-[80px] w-[80px] flex flex-col items-center justify-center">
                <PlusCircle className="h-6 w-6 mb-1" />
                <span>Neu</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Unternehmen verknüpfen</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddCompany} className="space-y-4">
                <div className="space-y-2">
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
                <div className="space-y-2">
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
            <Card key={company.id} className="w-[280px]">
              <CardContent className="p-3">
                <div className="flex justify-between items-start">
                  <Link href={`/kunden/${company.id}`}>
                    <h3 className="font-semibold text-sm hover:underline">{company.name}</h3>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive/90 -mt-2 -mr-2"
                    onClick={() => {
                      setCompanyToRemove(company);
                      setIsConfirmModalOpen(true);
                    }}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground mt-0">{company.unternehmensverknuepfung || 'Keine Verknüpfung'}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>

      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unternehmen entfernen</DialogTitle>
            <DialogDescription>Möchten Sie wirklich die Verknüpfung zu {companyToRemove?.name} entfernen?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)}>
              Abbrechen
            </Button>
            <Button variant="destructive" onClick={() => companyToRemove && handleRemoveCompany(companyToRemove.id)}>
              Entfernen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default LinkedCompanies;
