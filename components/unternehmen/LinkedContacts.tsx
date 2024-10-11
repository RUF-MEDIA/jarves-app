'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, XCircle, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Contact {
  id: string;
  vorname: string;
  nachname: string;
  email: string | null;
  telefon: string | null;
  positionJobtitel: string | null;
}

export default function LinkedContacts({ currentCompanyId }: { currentCompanyId: string }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [contactToRemove, setContactToRemove] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLinkedContacts = async () => {
      try {
        const response = await fetch(`/api/linkedContacts?currentCompanyId=${currentCompanyId}`);
        if (!response.ok) throw new Error('Failed to fetch linked contacts');
        const data = await response.json();
        setContacts(data);
      } catch (error) {
        console.error('Error fetching linked contacts:', error);
        setError('Failed to load contacts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAllContacts = async () => {
      try {
        const response = await fetch('/api/allContacts');
        if (!response.ok) throw new Error('Failed to fetch all contacts');
        const data = await response.json();
        setAllContacts(data);
        setFilteredContacts(data);
      } catch (error) {
        console.error('Error fetching all contacts:', error);
        setError('Failed to load all contacts. Please try again later.');
      }
    };

    fetchLinkedContacts();
    fetchAllContacts();
  }, [currentCompanyId]);

  useEffect(() => {
    const filtered = allContacts.filter((contact) => `${contact.vorname} ${contact.nachname}`.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredContacts(filtered);
  }, [searchTerm, allContacts]);

  const handleAddContact = async (contactId: string) => {
    try {
      const response = await fetch('/api/linkContact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentCompanyId, selectedContactId: contactId }),
      });

      if (!response.ok) throw new Error('Failed to link contact');

      const updatedContacts = await fetch(`/api/linkedContacts?currentCompanyId=${currentCompanyId}`).then((res) => res.json());
      setContacts(updatedContacts);
      setIsModalOpen(false);
      setSearchTerm('');
    } catch (error) {
      console.error('Error linking contact:', error);
      setError('Failed to link contact. Please try again.');
    }
  };

  const handleRemoveContact = async (contactId: string) => {
    try {
      const response = await fetch('/api/unlinkContact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentCompanyId, contactId }),
      });

      if (!response.ok) throw new Error('Failed to unlink contact');

      const updatedContacts = await fetch(`/api/linkedContacts?currentCompanyId=${currentCompanyId}`).then((res) => res.json());
      setContacts(updatedContacts);
      setIsConfirmModalOpen(false);
      setContactToRemove(null);
    } catch (error) {
      console.error('Error unlinking contact:', error);
      setError('Failed to remove contact. Please try again.');
    }
  };

  if (isLoading) return <div>Lade Ansprechpartner...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-4">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-[95px] w-[80px] flex flex-col items-center justify-center">
                <PlusCircle className="h-6 w-6 mb-1" />
                <span>Neu</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Ansprechpartner verknüpfen</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-4">
                  <Search className="h-4 w-4 opacity-50" />
                  <Input
                    placeholder="Suche nach Ansprechpartner"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="max-h-[300px] overflow-y-auto border rounded-md bg-background">
                  {filteredContacts.map((contact) => (
                    <Button
                      key={contact.id}
                      variant="ghost"
                      className="w-full justify-start text-left py-2 px-3 hover:bg-muted"
                      onClick={() => handleAddContact(contact.id)}
                    >
                      {contact.vorname} {contact.nachname}
                    </Button>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {contacts.length === 0 ? (
            <div className="text-muted-foreground">Keine verknüpften Ansprechpartner gefunden.</div>
          ) : (
            contacts.map((contact) => (
              <Card key={contact.id} className="w-[280px]">
                <CardContent className="p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-sm">
                        {contact.vorname} {contact.nachname}
                      </h3>
                      {contact.positionJobtitel && <p className="text-sm text-muted-foreground">{contact.positionJobtitel}</p>}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive/90 -mt-2 -mr-2"
                      onClick={() => {
                        setContactToRemove(contact);
                        setIsConfirmModalOpen(true);
                      }}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    {contact.email && (
                      <a href={`mailto:${contact.email}`} className="block hover:underline">
                        {contact.email}
                      </a>
                    )}
                    {contact.telefon && (
                      <a href={`tel:${contact.telefon}`} className="block hover:underline">
                        {contact.telefon}
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>

      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kontakt entfernen</DialogTitle>
            <DialogDescription>
              Möchten Sie wirklich den Kontakt {contactToRemove?.vorname} {contactToRemove?.nachname} entfernen?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)}>
              Abbrechen
            </Button>
            <Button variant="destructive" onClick={() => contactToRemove && handleRemoveContact(contactToRemove.id)}>
              Entfernen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
