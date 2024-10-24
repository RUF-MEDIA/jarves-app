// components/LiveSearch.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';

interface SearchResult {
  id: string;
  type: 'unternehmen' | 'bewerber' | 'auftrag' | 'sales';
  name: string;
  details: string;
}

export function LiveSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(debouncedSearchTerm)}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data);
          setShowDropdown(true);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Search error:', err);
          setIsLoading(false);
        });
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  }, [debouncedSearchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      setShowDropdown(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <Input type="text" placeholder="Ich suche ..." value={searchTerm} onChange={handleInputChange} className="w-full rounded-full" />
      {showDropdown && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
          <ScrollArea className="h-64">
            {isLoading ? (
              <div className="p-2 text-center">Suche läuft...</div>
            ) : results.length > 0 ? (
              results.map((result) => (
                <Link key={result.id} href={`/${result.type}/${result.id}`}>
                  <div className="p-2 hover:bg-gray-100 cursor-pointer">
                    <div className="font-semibold">{result.name}</div>
                    <div className="text-sm text-gray-500">{result.details}</div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-2 text-center">Keine Ergebnisse gefunden</div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
