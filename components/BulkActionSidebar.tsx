// components/BulkActionSidebar.tsx

'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { statusOptions } from '@/constants/statusOptions';
import { kategorieOptions } from '@/constants/kategorieOptions';

interface BulkActionSidebarProps {
  isOpen: boolean;
  selectedCount: number;
  onClose: () => void;
  newStatus: string;
  setNewStatus: (value: string) => void;
  newBetreuer: string;
  setNewBetreuer: (value: string) => void;
  newKategorie: string; // Typ geändert zu string
  setNewKategorie: (value: string) => void;
  newVerknuepfung: string;
  setNewVerknuepfung: (value: string) => void;
  onDelete: () => void;
  onUpdate: () => void;
  betreuerList: { id: string; name: string }[];
}

const BulkActionSidebar: React.FC<BulkActionSidebarProps> = ({
  isOpen,
  selectedCount,
  onClose,
  newStatus,
  setNewStatus,
  newBetreuer,
  setNewBetreuer,
  newKategorie,
  setNewKategorie,
  newVerknuepfung,
  setNewVerknuepfung,
  onDelete,
  onUpdate,
  betreuerList,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Sidebar */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-xl overflow-y-auto" aria-modal="true" role="dialog">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Massenbearbeitung ({selectedCount} ausgewählt)</h2>
          <div className="space-y-4">
            {/* Status ändern */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-1">
                Status ändern:
              </label>
              <Select onValueChange={setNewStatus} value={newStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="-- Status auswählen --" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Kategorie ändern */}
            <div>
              <label htmlFor="kategorie" className="block text-sm font-medium mb-1">
                Kategorie ändern:
              </label>
              <Select onValueChange={setNewKategorie} value={newKategorie}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="-- Kategorie auswählen --" />
                </SelectTrigger>
                <SelectContent>
                  {kategorieOptions.map((kategorie) => (
                    <SelectItem key={kategorie.value} value={kategorie.value.toString()}>
                      {kategorie.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Betreuer zuweisen */}
            <div>
              <label htmlFor="betreuer" className="block text-sm font-medium mb-1">
                Betreuer zuweisen:
              </label>
              <Select onValueChange={setNewBetreuer} value={newBetreuer}>
                <SelectTrigger className="w-full">
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

            {/* Unternehmensverknüpfung zuweisen */}
            <div>
              <label htmlFor="verknuepfung" className="block text-sm font-medium mb-1">
                Unternehmensverknüpfung zuweisen:
              </label>
              <Select onValueChange={setNewVerknuepfung} value={newVerknuepfung}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="-- Verknüpfung auswählen --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Muttergesellschaft">Muttergesellschaft</SelectItem>
                  <SelectItem value="Tochtergesellschaft">Tochtergesellschaft</SelectItem>
                  <SelectItem value="Schwestergesellschaft">Schwestergesellschaft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Info-Mail/Newsletter Button */}
            <div>
              <Button variant="secondary" className="w-full">
                Info-Mails/Newsletter senden
              </Button>
            </div>

            {/* Löschen Button */}
            <div>
              <Button variant="destructive" className="w-full" onClick={onDelete}>
                Ausgewählte löschen
              </Button>
            </div>

            {/* Bestätigen und Abbrechen Buttons */}
            <div className="flex justify-end space-x-2">
              <Button variant="default" onClick={onUpdate}>
                Änderungen speichern
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Abbrechen
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default BulkActionSidebar;
