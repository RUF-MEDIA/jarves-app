'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusCircle, XCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Company {
  id: string;
  name: string;
  unternehmensverknuepfung: string | null;
}

const LinkedCompanies: React.FC<{ currentCompanyId: string }> = ({ currentCompanyId }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [companyToRemove, setCompanyToRemove] = useState<Company | null>(null);
  const [newCompanyId, setNewCompanyId] = useState('');
  const [unternehmensverknuepfung, setUnternehmensverknuepfung] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLinkedCompanies = async () => {
      try {
        const response = await fetch(`/api/linkedCompanies?currentCompanyId=${currentCompanyId}`);
        if (!response.ok) throw new Error('Failed to fetch linked companies');
        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error('Error fetching linked companies:', error);
      }
    };

    const fetchAllCompanies = async () => {
      try {
        const response = await fetch('/api/allCompanies');
        if (!response.ok) throw new Error('Failed to fetch all companies');
        const data = await response.json();
        setAllCompanies(data);
        setFilteredCompanies(data);
      } catch (error) {
        console.error('Error fetching all companies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinkedCompanies();
    fetchAllCompanies();
  }, [currentCompanyId]);

  useEffect(() => {
    const filtered = allCompanies.filter((company) => company.name.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredCompanies(filtered);
  }, [searchTerm, allCompanies]);

  const handleAddCompany = async () => {
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

      if (!response.ok) throw new Error('Failed to link company');

      const updatedCompanies = await fetch(`/api/linkedCompanies?currentCompanyId=${currentCompanyId}`).then((res) => res.json());
      setCompanies(updatedCompanies);

      setIsModalOpen(false);
      setNewCompanyId('');
      setUnternehmensverknuepfung('');
      setSearchTerm('');
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

      if (!response.ok) throw new Error('Failed to unlink company');

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
            <DialogContent className="sm:max-w-[600px] w-full">
              <DialogHeader>
                <DialogTitle>Unternehmen verknüpfen</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="companySearch">Unternehmen suchen und auswählen</Label>
                  <div className="flex items-center space-x-2 border rounded-md px-3 py-2">
                    <Search className="w-4 h-4 opacity-50" />
                    <Input
                      id="companySearch"
                      placeholder="Unternehmen suchen..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </div>
                <div className="max-h-[200px] overflow-y-auto border rounded-md bg-background">
                  {filteredCompanies.map((company) => (
                    <Button
                      key={company.id}
                      variant="ghost"
                      className={`w-full justify-start text-left py-2 px-3 hover:bg-muted ${newCompanyId === company.id ? 'bg-muted' : ''}`}
                      onClick={() => {
                        setNewCompanyId(company.id);
                        setSearchTerm(company.name);
                      }}
                    >
                      {company.name}
                    </Button>
                  ))}
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
                <Button onClick={handleAddCompany} className="w-full">
                  Verknüpfen
                </Button>
              </div>
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
                <div className="text-sm text-muted-foreground mt-1">{company.unternehmensverknuepfung || 'Keine Verknüpfung'}</div>
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
