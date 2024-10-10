// components/list/NumberRangeFilter.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface NumberRangeFilterProps {
  column: any;
}

const NumberRangeFilter: React.FC<NumberRangeFilterProps> = ({ column }) => {
  const [range, setRange] = useState<[number, number]>([0, 100]);

  useEffect(() => {
    column.setFilterValue(range);
  }, [range, column]);

  const handleRangeChange = (newValue: number[]) => {
    setRange(newValue as [number, number]);
  };

  const resetFilter = () => {
    setRange([0, 100]);
    column.setFilterValue(undefined);
  };

  return (
    <div className="flex flex-col space-y-2 p-2">
      <Slider min={0} max={100} step={1} value={range} onValueChange={handleRangeChange} />
      <div className="flex justify-between">
        <span>{range[0]}</span>
        <span>{range[1]}</span>
      </div>
      <Button variant="ghost" size="sm" onClick={resetFilter} className="text-xs py-1 h-7">
        Filter zurücksetzen
      </Button>
    </div>
  );
};

export default NumberRangeFilter;
