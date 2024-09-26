import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { DateRange } from 'react-day-picker';

interface DateRangeModalProps {
  column: any;
}

const DateRangeModal: React.FC<DateRangeModalProps> = ({ column }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    if (dateRange) {
      const { from, to } = dateRange;
      if (from && to) {
        column.setFilterValue([from, to]);
      }
    }
  }, [dateRange, column]);

  const handleReset = () => {
    setDateRange(undefined);
    column.setFilterValue(undefined);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Filter Einstellungen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Zeitraum auswählen</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Label>Von</Label>
          <Calendar mode="range" selected={dateRange} onSelect={setDateRange} initialFocus />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            Filter zurücksetzen
          </Button>
          <Button onClick={() => setIsOpen(false)}>Übernehmen</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DateRangeModal;
