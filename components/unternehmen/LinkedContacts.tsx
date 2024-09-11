'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Contact {
  id: string;
  vorname: string;
  nachname: string;
  kategorie: string | null; // Kategorie statt Position
}

const LinkedContacts = ({ currentCompanyId }: { currentCompanyId: string }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newContactId, setNewContactId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Laden der verknüpften Ansprechpartner
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

  // Laden aller Ansprechpartner
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

      // Aktualisieren der verknüpften Ansprechpartner
      const updatedContacts = await fetch(`/api/linkedContacts?currentCompanyId=${currentCompanyId}`).then((res) => res.json());
      setContacts(updatedContacts);

      setIsModalOpen(false);
      setNewContactId('');
    } catch (error) {
      console.error('Error linking contact:', error);
    }
  };

  if (isLoading) {
    return <div>Lade Ansprechpartner...</div>;
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
            <DialogTitle>Ansprechpartner verknüpfen</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddContact} className="space-y-4">
            <div>
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
        <div key={contact.id} className="p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold text-sm">
            {contact.vorname} {contact.nachname}
          </h3>
          <p className="text-xs text-gray-600 mt-2">
            {contact.kategorie || 'Keine Kategorie angegeben'} {/* Zeige die Kategorie oder einen Fallback */}
          </p>
        </div>
      ))}
    </div>
  );
};

export default LinkedContacts;
