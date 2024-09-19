// components/BulkActionSidebar.tsx

'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface BulkActionSidebarProps {
  isOpen: boolean;
  selectedCount: number;
  onClose: () => void;
  newStatus: string;
  setNewStatus: (value: string) => void;
  newBetreuer: string;
  setNewBetreuer: (value: string) => void;
  newKategorie: string;
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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed inset-y-0 right-0 w-full md:w-1/3 bg-white shadow-lg p-6 z-50 overflow-auto">
        <DialogHeader>
          <DialogTitle>Massenbearbeitung ({selectedCount} ausgewählt)</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {/* Status ändern */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1">
              Status ändern:
            </label>
            <Select onValueChange={(value) => setNewStatus(value)} value={newStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="-- Status auswählen --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inaktiv">Inaktiv</SelectItem>
                <SelectItem value="Zielkunde">Zielkunde</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="aktiv">Aktiv</SelectItem>
                <SelectItem value="Rahmenvertragspartner">Rahmenvertragspartner</SelectItem>
                <SelectItem value="nicht_kontaktieren">Nicht kontaktieren</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Kategorie ändern */}
          <div>
            <label htmlFor="kategorie" className="block text-sm font-medium mb-1">
              Kategorie ändern:
            </label>
            <Input
              type="number"
              id="kategorie"
              value={newKategorie}
              onChange={(e) => setNewKategorie(e.target.value)}
              min="1"
              max="5"
              placeholder="1 bis 5"
              className="w-full"
            />
          </div>

          {/* Betreuer zuweisen */}
          <div>
            <label htmlFor="betreuer" className="block text-sm font-medium mb-1">
              Betreuer zuweisen:
            </label>
            <Select onValueChange={(value) => setNewBetreuer(value)} value={newBetreuer}>
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
            <Select onValueChange={(value) => setNewVerknuepfung(value)} value={newVerknuepfung}>
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
      </DialogContent>
    </Dialog>
  );
};

export default BulkActionSidebar;
