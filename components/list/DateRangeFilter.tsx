// components/list/DateRangeFilter.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface DateRangeFilterProps {
  column: any;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ column }) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    column.setFilterValue(date);
  }, [date, column]);

  const resetFilter = () => {
    setDate({ from: undefined, to: undefined });
    column.setFilterValue(undefined);
  };

  return (
    <div className="flex flex-col space-y-2 p-2">
      <div className="flex flex-col space-y-2">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
          locale={de}
          className="w-full max-w-[250px]"
          classNames={{
            months: 'flex flex-col space-y-2',
            month: 'space-y-2',
            caption: 'flex justify-center pt-1 relative items-center text-xs',
            caption_label: 'text-xs font-medium',
            nav: 'space-x-1 flex items-center',
            nav_button: 'h-6 w-6 bg-transparent p-0 opacity-50 hover:opacity-100',
            nav_button_previous: 'absolute left-1',
            nav_button_next: 'absolute right-1',
            table: 'w-full border-collapse space-y-0',
            head_row: 'flex',
            head_cell: 'text-muted-foreground rounded-md w-6 font-normal text-[0.6rem]',
            row: 'flex w-full mt-1',
            cell: 'relative p-0 text-center text-xs focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent',
            day: 'h-6 w-6 p-0 font-normal aria-selected:opacity-100',
            day_range_end: 'day-range-end',
            day_selected:
              'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
            day_today: 'bg-accent text-accent-foreground',
            day_outside: 'text-muted-foreground opacity-50',
            day_disabled: 'text-muted-foreground opacity-50',
            day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
            day_hidden: 'invisible',
          }}
        />
      </div>
      {(date?.from || date?.to) && (
        <div className="flex flex-col space-y-2">
          <div className="text-xs">
            {date.from && `Von: ${format(date.from, 'dd.MM.yyyy')}`}
            {date.to && ` - Bis: ${format(date.to, 'dd.MM.yyyy')}`}
          </div>
          <Button variant="ghost" size="sm" onClick={resetFilter} className="text-xs py-1 h-7">
            Filter zurücksetzen
          </Button>
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;
