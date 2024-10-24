import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';

// Define the enum types based on your Prisma schema
enum AnsprechpartnerStatus {
  unbekannt = 'unbekannt',
  inKontakt = 'inKontakt',
  nichtKontaktieren = 'nichtKontaktieren',
  ausgeschieden = 'ausgeschieden',
}

enum AnsprechpartnerKategorie {
  Geschaeftsfuehrung = 'Geschaeftsfuehrung',
  HRRecruiting = 'HRRecruiting',
  Entscheider = 'Entscheider',
  TeamAbteilungsleiter = 'TeamAbteilungsleiter',
  Mitarbeiter = 'Mitarbeiter',
}

interface BulkActionSidebarProps {
  isOpen: boolean;
  selectedCount: number;
  onClose: () => void;
  onUpdate: (updates: { status?: AnsprechpartnerStatus; kategorie?: AnsprechpartnerKategorie; betreuerId?: string }) => void;
}

export default function BulkActionSidebarKontaktpersonen({ isOpen, selectedCount, onClose, onUpdate }: BulkActionSidebarProps) {
  const [newStatus, setNewStatus] = useState<AnsprechpartnerStatus | ''>('');
  const [newKategorie, setNewKategorie] = useState<AnsprechpartnerKategorie | ''>('');
  const [newBetreuer, setNewBetreuer] = useState<string>('');
  const [betreuerList, setBetreuerList] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    // Fetch the list of betreuer (supervisors)
    const fetchBetreuerList = async () => {
      try {
        const response = await fetch('/api/getBetreuerList');
        if (response.ok) {
          const data = await response.json();
          setBetreuerList(data);
        }
      } catch (error) {
        console.error('Error fetching betreuer list:', error);
      }
    };

    fetchBetreuerList();
  }, []);

  const handleUpdate = () => {
    const updates: { status?: AnsprechpartnerStatus; kategorie?: AnsprechpartnerKategorie; betreuerId?: string } = {};
    if (newStatus) updates.status = newStatus;
    if (newKategorie) updates.kategorie = newKategorie;
    if (newBetreuer) updates.betreuerId = newBetreuer;
    onUpdate(updates);
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Massenbearbeitung Kontaktpersonen</SheetTitle>
          <SheetDescription>{selectedCount} ausgewählt</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status ändern</Label>
            <Select onValueChange={(value) => setNewStatus(value as AnsprechpartnerStatus)} value={newStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Status auswählen" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(AnsprechpartnerStatus).map(([key, value]) => (
                  <SelectItem key={key} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="kategorie">Kategorie ändern</Label>
            <Select onValueChange={(value) => setNewKategorie(value as AnsprechpartnerKategorie)} value={newKategorie}>
              <SelectTrigger id="kategorie">
                <SelectValue placeholder="Kategorie auswählen" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(AnsprechpartnerKategorie).map(([key, value]) => (
                  <SelectItem key={key} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="betreuer">Betreuer zuweisen</Label>
            <Select onValueChange={setNewBetreuer} value={newBetreuer}>
              <SelectTrigger id="betreuer">
                <SelectValue placeholder="Betreuer auswählen" />
              </SelectTrigger>
              <SelectContent>
                {betreuerList.map((betreuer) => (
                  <SelectItem key={betreuer.id} value={betreuer.id}>
                    {betreuer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Abbrechen</Button>
          </SheetClose>
          <Button onClick={handleUpdate}>Änderungen speichern</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
