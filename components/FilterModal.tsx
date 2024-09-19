// components/FilterModal.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { statusOptions } from '@/constants/statusOptions';
import { kategorieOptions } from '@/constants/kategorieOptions';

interface Column {
  key: string;
  label: string;
  filterable: boolean;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  columnKey: string;
  column: Column;
  betreuerList: { id: string; name: string }[];
  onBetreuerFilterChange: (betreuerId: string) => void;
  onDateFilterChange: (start: Date | null, end: Date | null) => void;
  onStatusFilterChange: (selectedStatuses: string[]) => void;
  onKategorieFilterChange: (selectedKategorien: number[]) => void;
  filters: {
    [key: string]: any;
  };
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  columnKey,
  column,
  betreuerList,
  onBetreuerFilterChange,
  onDateFilterChange,
  onStatusFilterChange,
  onKategorieFilterChange,
  filters,
}) => {
  // Lokaler State für ausgewählte Status
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(filters.status || []);

  // Lokaler State für ausgewählte Kategorien
  const [selectedKategorien, setSelectedKategorien] = useState<number[]>(filters.kategorie || []);

  useEffect(() => {
    if (columnKey === 'status') {
      setSelectedStatuses(filters.status || []);
    }
    if (columnKey === 'kategorie') {
      setSelectedKategorien(filters.kategorie || []);
    }
  }, [columnKey, filters.status, filters.kategorie]);

  const handleStatusChange = (statusValue: string) => {
    setSelectedStatuses((prev) => {
      if (prev.includes(statusValue)) {
        return prev.filter((status) => status !== statusValue);
      } else {
        return [...prev, statusValue];
      }
    });
  };

  const handleKategorieChange = (kategorieValue: number) => {
    setSelectedKategorien((prev) => {
      if (prev.includes(kategorieValue)) {
        return prev.filter((kategorie) => kategorie !== kategorieValue);
      } else {
        return [...prev, kategorieValue];
      }
    });
  };

  const applyStatusFilter = () => {
    onStatusFilterChange(selectedStatuses);
  };

  const applyKategorieFilter = () => {
    onKategorieFilterChange(selectedKategorien);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Filter für {column.label}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {columnKey === 'betreuer' && (
            <div>
              <label htmlFor="betreuer" className="block text-sm font-medium mb-1">
                Betreuer auswählen:
              </label>
              <Select onValueChange={(value) => onBetreuerFilterChange(value)} value={filters.betreuer || 'all'}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="-- Betreuer auswählen --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle</SelectItem>
                  {betreuerList.map((betreuer) => (
                    <SelectItem key={betreuer.id} value={betreuer.id}>
                      {betreuer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {columnKey === 'letzteAenderungAm' && (
            <div>
              <label className="block text-sm font-medium mb-1">Letzte Änderung am:</label>
              <div className="flex space-x-2">
                <DatePicker
                  selected={filters.letzteAenderungAm.start}
                  onChange={(date) => onDateFilterChange(date, filters.letzteAenderungAm.end)}
                  selectsStart
                  startDate={filters.letzteAenderungAm.start}
                  endDate={filters.letzteAenderungAm.end}
                  placeholderText="Startdatum"
                  className="w-full border rounded p-2"
                />
                <DatePicker
                  selected={filters.letzteAenderungAm.end}
                  onChange={(date) => onDateFilterChange(filters.letzteAenderungAm.start, date)}
                  selectsEnd
                  startDate={filters.letzteAenderungAm.start}
                  endDate={filters.letzteAenderungAm.end}
                  minDate={filters.letzteAenderungAm.start}
                  placeholderText="Enddatum"
                  className="w-full border rounded p-2"
                />
              </div>
            </div>
          )}

          {columnKey === 'status' && (
            <div>
              <label className="block text-sm font-medium mb-1">Status auswählen:</label>
              <div className="space-y-2">
                {statusOptions.map((status) => (
                  <div key={status.value} className="flex items-center">
                    <Checkbox
                      checked={selectedStatuses.includes(status.value)}
                      onCheckedChange={() => handleStatusChange(status.value)}
                      id={`status-${status.value}`}
                      className="mr-2"
                    />
                    <label htmlFor={`status-${status.value}`} className="text-sm">
                      {status.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {columnKey === 'kategorie' && (
            <div>
              <label className="block text-sm font-medium mb-1">Kategorie auswählen:</label>
              <div className="space-y-2">
                {kategorieOptions.map((kategorie) => (
                  <div key={kategorie.value} className="flex items-center">
                    <Checkbox
                      checked={selectedKategorien.includes(kategorie.value)}
                      onCheckedChange={() => handleKategorieChange(kategorie.value)}
                      id={`kategorie-${kategorie.value}`}
                      className="mr-2"
                    />
                    <label htmlFor={`kategorie-${kategorie.value}`} className="text-sm">
                      {kategorie.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="mt-6">
          {columnKey === 'status' && (
            <>
              <Button onClick={applyStatusFilter} className="mr-2">
                Anwenden
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Abbrechen
              </Button>
            </>
          )}
          {columnKey === 'kategorie' && (
            <>
              <Button onClick={applyKategorieFilter} className="mr-2">
                Anwenden
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Abbrechen
              </Button>
            </>
          )}
          {/* Für andere Filtertypen */}
          {columnKey !== 'status' && columnKey !== 'kategorie' && <Button onClick={onClose}>Schließen</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;
