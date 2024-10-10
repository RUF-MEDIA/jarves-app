import React from 'react';
import { Button } from '@/components/ui/button';

interface LetterFilterProps {
  availableLetters: string[];
  currentFilter: string;
  onFilterChange: (letter: string) => void;
}

export function LetterFilter({ availableLetters, currentFilter, onFilterChange }: LetterFilterProps) {
  return (
    <div className="flex items-center space-x-2 overflow-x-auto">
      <Button variant={currentFilter === 'ALL' ? 'default' : 'outline'} onClick={() => onFilterChange('ALL')}>
        ALLE
      </Button>
      {availableLetters.map((letter) => (
        <Button key={letter} variant={currentFilter === letter ? 'default' : 'outline'} onClick={() => onFilterChange(letter)}>
          {letter}
        </Button>
      ))}
    </div>
  );
}
