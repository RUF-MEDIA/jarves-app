// components/BulkActionSidebarKontaktpersonen.tsx
'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { statusOptionsKontaktpersonen } from '@/constants/statusOptionsKontaktpersonen';
import { kategorieOptionsKontaktpersonen } from '@/constants/kategorieOptionsKontaktpersonen';

interface BulkActionSidebarKontaktpersonenProps {
  isOpen: boolean;
  selectedCount: number;
  onClose: () => void;
  newStatus: string;
  setNewStatus: (value: string) => void;
  newBetreuer: string;
  setNewBetreuer: (value: string) => void;
  newKategorie: string;
  setNewKategorie: (value: string) => void;
  onDelete: () => void;
  onUpdate: () => void;
  betreuerList: { id: string; name: string }[];
}

export default function BulkActionSidebarKontaktpersonen({
  isOpen,
  selectedCount,
  onClose,
  newStatus,
  setNewStatus,
  newBetreuer,
  setNewBetreuer,
  newKategorie,
  setNewKategorie,
  onDelete,
  onUpdate,
  betreuerList,
}: BulkActionSidebarKontaktpersonenProps) {
  if (!isOpen) return null;

  return createPortal(
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Massenbearbeitung</SheetTitle>
          <SheetDescription>{selectedCount} ausgewählt</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {/* Status ändern */}
          <div className="space-y-2">
            <Label htmlFor="status">Status ändern</Label>
            <Select onValueChange={setNewStatus} value={newStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="-- Status auswählen --" />
              </SelectTrigger>
              <SelectContent>
                {statusOptionsKontaktpersonen.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Kategorie ändern */}
          <div className="space-y-2">
            <Label htmlFor="kategorie">Kategorie ändern</Label>
            <Select onValueChange={setNewKategorie} value={newKategorie}>
              <SelectTrigger id="kategorie">
                <SelectValue placeholder="-- Kategorie auswählen --" />
              </SelectTrigger>
              <SelectContent>
                {kategorieOptionsKontaktpersonen.map((kategorie) => (
                  <SelectItem key={kategorie.value} value={kategorie.value}>
                    {kategorie.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Betreuer zuweisen */}
          <div className="space-y-2">
            <Label htmlFor="betreuer">Betreuer zuweisen</Label>
            <Select onValueChange={setNewBetreuer} value={newBetreuer}>
              <SelectTrigger id="betreuer">
                <SelectValue placeholder="-- Betreuer auswählen --" />
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

          {/* Weitere Aktionen */}
          <Button variant="secondary" className="w-full">
            Info-Mails/Newsletter senden
          </Button>
          <Button variant="destructive" className="w-full" onClick={onDelete}>
            Ausgewählte löschen
          </Button>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Abbrechen</Button>
          </SheetClose>
          <Button onClick={onUpdate}>Änderungen speichern</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>,
    document.body
  );
}
