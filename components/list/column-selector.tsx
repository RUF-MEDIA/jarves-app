// components/list/column-selector.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown } from 'lucide-react';
import { Table } from '@tanstack/react-table';

interface ColumnSelectorProps<TData> {
  table: Table<TData>;
  columnLabels: { [key: string]: string };
  listId: string;
}

export function ColumnSelector<TData>({ table, columnLabels, listId }: ColumnSelectorProps<TData>) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const savedColumnVisibility = localStorage.getItem(`columnVisibility_${listId}`);
    if (savedColumnVisibility) {
      const parsedVisibility = JSON.parse(savedColumnVisibility);
      const validVisibility = Object.keys(parsedVisibility).reduce(
        (acc, key) => {
          if (table.getAllColumns().some((col) => col.id === key)) {
            acc[key] = parsedVisibility[key];
          }
          return acc;
        },
        {} as Record<string, boolean>
      );
      table.setColumnVisibility(validVisibility);
    }
  }, [table, listId]);

  const handleColumnVisibilityChange = (columnId: string, isVisible: boolean) => {
    const newColumnVisibility = {
      ...table.getState().columnVisibility,
      [columnId]: isVisible,
    };
    table.setColumnVisibility(newColumnVisibility);
    localStorage.setItem(`columnVisibility_${listId}`, JSON.stringify(newColumnVisibility));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="ml-auto">
          Spalten <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end">
        <ScrollArea className="h-[300px] overflow-y-auto">
          <div className="space-y-2 p-2">
            {table
              .getAllColumns()
              .filter((column) => column.id !== 'select' && typeof column.accessorFn !== 'undefined')
              .map((column) => {
                return (
                  <div key={column.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${listId}_${column.id}`}
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => handleColumnVisibilityChange(column.id, !!value)}
                    />
                    <label
                      htmlFor={`${listId}_${column.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {columnLabels[column.id] || column.id}
                    </label>
                  </div>
                );
              })}
          </div>
        </ScrollArea>
        <Button variant="secondary" className="w-full mt-4" onClick={() => setOpen(false)}>
          Schließen
        </Button>
      </PopoverContent>
    </Popover>
  );
}
