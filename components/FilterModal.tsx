// components/FilterModal.tsx

'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import DatePicker from 'react-datepicker';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  columnKey: string;
  column: {
    key: string;
    label: string;
    filterable: boolean;
  };
  betreuerList: { id: string; name: string }[];
  onBetreuerFilterChange: (betreuerId: string) => void;
  onDateFilterChange: (start: Date | null, end: Date | null) => void;
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
  filters,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Filter für {column.label}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {column.key === 'betreuer' && (
            <Select onValueChange={onBetreuerFilterChange} value={filters.betreuer}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="-- Betreuer filtern --" />
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
          )}
          {column.key === 'letzteAenderungAm' && (
            <div className="flex flex-col space-y-2">
              <DatePicker
                selected={filters.letzteAenderungAm.start}
                onChange={(date: Date | null) => onDateFilterChange(date, filters.letzteAenderungAm.end)}
                selectsStart
                startDate={filters.letzteAenderungAm.start}
                endDate={filters.letzteAenderungAm.end}
                placeholderText="Startdatum"
                className="border rounded p-2"
              />
              <DatePicker
                selected={filters.letzteAenderungAm.end}
                onChange={(date: Date | null) => onDateFilterChange(filters.letzteAenderungAm.start, date)}
                selectsEnd
                startDate={filters.letzteAenderungAm.start}
                endDate={filters.letzteAenderungAm.end}
                minDate={filters.letzteAenderungAm.start}
                placeholderText="Enddatum"
                className="border rounded p-2"
              />
            </div>
          )}
          {/* Weitere Filteroptionen können hier hinzugefügt werden */}
        </div>
        <DialogFooter className="mt-6">
          <Button onClick={onClose}>Schließen</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;
