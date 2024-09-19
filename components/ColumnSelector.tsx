// components/ColumnSelector.tsx

'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface Column {
  key: string;
  label: string;
  filterable: boolean;
}

interface ColumnSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  columns: Column[];
  selectedColumns: string[];
  onChange: (key: string) => void;
}

const ColumnSelector: React.FC<ColumnSelectorProps> = ({ isOpen, onClose, columns, selectedColumns, onChange }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Spalten anpassen</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {columns.map((col) => (
            <div key={col.key} className="flex items-center">
              <Checkbox
                checked={selectedColumns.includes(col.key)}
                onCheckedChange={() => onChange(col.key)}
                id={`col-${col.key}`}
                className="mr-2"
              />
              <label htmlFor={`col-${col.key}`} className="text-sm">
                {col.label}
              </label>
            </div>
          ))}
        </div>
        <DialogFooter className="mt-6">
          <Button onClick={onClose}>Schließen</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ColumnSelector;
