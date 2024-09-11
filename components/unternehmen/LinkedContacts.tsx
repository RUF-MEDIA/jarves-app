'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Contact {
  id: string;
  vorname: string;
  nachname: string;
  kategorie: string | null;
}

const LinkedContacts = ({ currentCompanyId }: { currentCompanyId: string }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    } catch (error) {
      console.error('Error unlinking contact:', error);
    }
  };

  if (isLoading) {
    return <div>Lade Ansprechpartner...</div>;
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
            <DialogTitle className="text-sm">Ansprechpartner verknüpfen</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddContact} className="space-y-2">
            <div>
              <Label htmlFor="newContactId" className="text-sm">
                Ansprechpartner auswählen
              </Label>
              <Select value={newContactId} onValueChange={setNewContactId}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Wählen Sie einen Ansprechpartner" />
                </SelectTrigger>
                <SelectContent>
                  {allContacts.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id} className="text-sm">
                      {contact.vorname} {contact.nachname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full text-sm py-1">
              Verknüpfen
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {contacts.map((contact) => (
        <div key={contact.id} className="relative w-1/5 min-w-[160px]">
          <div className="p-2 bg-gray-100 rounded-lg flex flex-col justify-between relative min-h-[80px]">
            <button
              className="absolute top-1 right-1 text-red-600 hover:text-red-800"
              onClick={() => handleRemoveContact(contact.id)}
              aria-label="Entfernen"
            >
              <XCircle size={16} />
            </button>
            <h3 className="font-semibold text-xs text-blue-600 hover:underline">
              {contact.vorname} {contact.nachname}
            </h3>
            <p className="text-xs text-gray-600 mt-1">{contact.kategorie || 'Keine Kategorie angegeben'}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LinkedContacts;
