'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface Contact {
  id: string;
  vorname: string;
  nachname: string;
  email: string | null;
  telefon: string | null;
}

const LinkedContacts: React.FC<{ currentCompanyId: string }> = ({ currentCompanyId }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [contactToRemove, setContactToRemove] = useState<Contact | null>(null);
  const [newContactId, setNewContactId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLinkedContacts = async () => {
      try {
        const response = await fetch(`/api/linkedContacts?currentCompanyId=${currentCompanyId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch linked contacts');
        }
        const data = await response.json();
        setContacts(data);
      } catch (error) {
        console.error('Error fetching linked contacts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinkedContacts();
  }, [currentCompanyId]);

  useEffect(() => {
    const fetchAllContacts = async () => {
      try {
        const response = await fetch('/api/allContacts');
        if (!response.ok) {
          throw new Error('Failed to fetch all contacts');
        }
        const data = await response.json();
        setAllContacts(data);
      } catch (error) {
        console.error('Error fetching all contacts:', error);
      }
    };

    fetchAllContacts();
  }, []);

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactId) {
      console.error('Bitte füllen Sie alle Pflichtfelder aus');
      return;
    }

    try {
      const response = await fetch('/api/linkContact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentCompanyId,
          selectedContactId: newContactId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to link contact');
      }

      const updatedContacts = await fetch(`/api/linkedContacts?currentCompanyId=${currentCompanyId}`).then((res) => res.json());
      setContacts(updatedContacts);

      setIsModalOpen(false);
      setNewContactId('');
    } catch (error) {
      console.error('Error linking contact:', error);
    }
  };

  const handleRemoveContact = async (contactId: string) => {
    try {
      const response = await fetch('/api/unlinkContact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentCompanyId,
          contactId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to unlink contact');
      }

      const updatedContacts = await fetch(`/api/linkedContacts?currentCompanyId=${currentCompanyId}`).then((res) => res.json());
      setContacts(updatedContacts);
      setIsConfirmModalOpen(false);
      setContactToRemove(null);
    } catch (error) {
      console.error('Error unlinking contact:', error);
    }
  };

  if (isLoading) {
    return <div>Lade Ansprechpartner...</div>;
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
                <DialogTitle>Ansprechpartner verknüpfen</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddContact} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newContactId">Ansprechpartner auswählen</Label>
                  <Select value={newContactId} onValueChange={setNewContactId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Wählen Sie einen Ansprechpartner" />
                    </SelectTrigger>
                    <SelectContent>
                      {allContacts.map((contact) => (
                        <SelectItem key={contact.id} value={contact.id}>
                          {contact.vorname} {contact.nachname}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  Verknüpfen
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          {contacts.map((contact) => (
            <Card key={contact.id} className="w-[280px]">
              <CardContent className="p-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-sm text-primary">
                    {contact.vorname} {contact.nachname}
                  </h3>
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
          ))}
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
};

export default LinkedContacts;
