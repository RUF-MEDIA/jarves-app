import React from 'react';
import { Input } from '@/components/ui/input';
import { Table } from '@tanstack/react-table';

interface GlobalSearchProps<TData> {
  table: Table<TData>;
}

export function GlobalSearch<TData>({ table }: GlobalSearchProps<TData>) {
  const [value, setValue] = React.useState('');

  const onFilterChange = React.useCallback(
    (value: string) => {
      table.setGlobalFilter(value);
    },
    [table]
  );

  return (
    <Input
      placeholder="Suche..."
      value={value}
      onChange={(event) => {
        setValue(event.target.value);
        onFilterChange(event.target.value);
      }}
      className="max-w-sm"
    />
  );
}
