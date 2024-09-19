// components/DataTable.tsx

'use client';

import { useState, useMemo, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FiSettings, FiArrowUp, FiArrowDown, FiFilter } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import useSWR from 'swr';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ColumnSelector from './ColumnSelector';
import FilterModal from './FilterModal';
import BulkActionSidebar from './BulkActionSidebar';

interface Column {
  key: string;
  label: string;
  filterable: boolean;
}

interface DataTableProps<T> {
  apiEndpoint: string;
  columns: Column[];
  defaultSelectedColumns: string[];
  betreuerList?: { id: string; name: string }[]; // Optional, spezifisch für bestimmte Tabellen
  renderCell: (item: T, key: string) => React.ReactNode;
}

export function DataTable<T>({
  apiEndpoint,
  columns,
  defaultSelectedColumns,
  betreuerList = [],
  renderCell, // Diese Funktion wird aus den Props verwendet
}: DataTableProps<T>) {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const { data: items, error, mutate } = useSWR<T[]>(apiEndpoint, fetcher);

  const [selectedColumns, setSelectedColumns] = useState(defaultSelectedColumns);
  const [isColumnSelectorOpen, setIsColumnSelectorOpen] = useState(false);
  const [currentFilterColumn, setCurrentFilterColumn] = useState<string | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterLetter, setFilterLetter] = useState('ALL');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<{
    [key: string]: any;
  }>({
    betreuer: 'all',
    letzteAenderungAm: { start: null, end: null },
  });

  // Loggen der empfangenen Daten zur Überprüfung
  useEffect(() => {
    if (items) {
      console.log('Empfangene Daten:', items);
    }
  }, [items]);

  // Ermitteln der verfügbaren Anfangsbuchstaben zur Filterung
  const availableLetters = useMemo(() => {
    if (!items) return [];
    const letters = new Set(
      items
        .filter((item: any) => item.name) // Sicherstellen, dass 'name' existiert
        .map((item: any) => item.name.charAt(0).toUpperCase())
    );
    return Array.from(letters).sort();
  }, [items]);

  // Anwenden des Filters basierend auf dem ausgewählten Buchstaben und anderen Filtern
  const filteredItems = useMemo(() => {
    if (!items) return [];

    return items.filter((item: any) => {
      // Filter nach Anfangsbuchstabe
      if (filterLetter !== 'ALL' && item.name && !item.name.startsWith(filterLetter)) {
        return false;
      }

      // Filter nach Betreuer
      if (filters.betreuer && filters.betreuer !== 'all' && item.betreuer?.id !== filters.betreuer) {
        return false;
      }

      // Filter nach Letzte Änderung am (Datum)
      if (filters.letzteAenderungAm.start || filters.letzteAenderungAm.end) {
        const letzteAenderung = new Date(item.letzteAenderungAm);
        if (filters.letzteAenderungAm.start && letzteAenderung < filters.letzteAenderungAm.start) {
          return false;
        }
        if (filters.letzteAenderungAm.end && letzteAenderung > filters.letzteAenderungAm.end) {
          return false;
        }
      }

      return true;
    });
  }, [items, filterLetter, filters]);

  // Anwenden der Sortierung
  const sortedItems = useMemo(() => {
    if (!filteredItems) return [];
    if (!sortConfig) return filteredItems;

    const sorted = [...filteredItems].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [filteredItems, sortConfig]);

  const isSidebarOpen = selectedRows.size > 0;

  if (error) return <div>Fehler beim Laden der Daten</div>;
  if (!items) return <div>Lade Daten...</div>;

  // Funktion zur Änderung der ausgewählten Spalten mit Sortierung
  const handleColumnChange = (key: string) => {
    setSelectedColumns((prev) => {
      if (prev.includes(key)) {
        // Entfernen der Spalte
        return prev.filter((col) => col !== key);
      } else {
        // Hinzufügen der Spalte und Sortieren basierend auf der columns-Reihenfolge
        const newSelected = [...prev, key];
        return columns.filter((col) => newSelected.includes(col.key)).map((col) => col.key);
      }
    });
  };

  // Funktion zur Handhabung der Sortierung
  const handleSort = (key: keyof T) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Funktion zur Auswahl einzelner Zeilen
  const handleRowSelect = (id: string) => {
    setSelectedRows((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  // Funktion zur Auswahl oder Abwahl aller Zeilen
  const handleSelectAll = () => {
    if (selectedRows.size === items.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(items.map((item: any) => item.id)));
    }
  };

  // Funktion zur Massenaktion (Update oder Delete)
  const confirmBulkAction = async (action: 'update' | 'delete') => {
    try {
      const selectedIds = Array.from(selectedRows);

      if (action === 'delete') {
        const response = await fetch('/api/bulkDeleteUnternehmen', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: selectedIds }),
        });

        if (response.ok) {
          console.log('Unternehmen erfolgreich gelöscht');
          await mutate();
          setSelectedRows(new Set());
        } else {
          console.error('Fehler beim Löschen der Unternehmen');
        }
      } else {
        // Hier können spezifische Bulk-Update-Logiken implementiert werden
        // Da die DataTable generisch ist, sollte die Logik hier flexibel gestaltet werden
        // Zum Beispiel könnten Updates über Props an die DataTable übergeben werden
        console.warn('Bulk-Update ist derzeit nicht implementiert.');
      }
    } catch (error) {
      console.error('Fehler bei der Massenaktion:', error);
    }
  };

  // Funktion zur Darstellung von Sternen basierend auf der Kategorie (optional)
  const renderStars = (rating: number | null) => {
    const validRating = rating || 0;
    return (
      <div className="flex space-x-1">
        {Array.from({ length: 5 }, (_, i) => (
          <FaStar key={i} className="w-4 h-4" color={i < validRating ? 'gold' : 'gray'} />
        ))}
      </div>
    );
  };

  // Funktion zur Formatierung von Datumsangaben (optional)
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE');
  };

  // Funktionen zum Setzen der Filter
  const handleBetreuerFilterChange = (betreuerId: string) => {
    setFilters((prev) => ({
      ...prev,
      betreuer: betreuerId,
    }));
    setIsFilterModalOpen(false);
    setCurrentFilterColumn(null);
  };

  const handleDateFilterChange = (start: Date | null, end: Date | null) => {
    setFilters((prev) => ({
      ...prev,
      letzteAenderungAm: { start, end },
    }));
    setIsFilterModalOpen(false);
    setCurrentFilterColumn(null);
  };

  // Funktion zum Öffnen/Schließen des Filter-Modals
  const toggleFilterModal = (columnKey: string) => {
    if (currentFilterColumn === columnKey) {
      setCurrentFilterColumn(null);
      setIsFilterModalOpen(false);
    } else {
      setCurrentFilterColumn(columnKey);
      setIsFilterModalOpen(true);
    }
  };

  return (
    <div className="p-4 min-h-screen">
      {/* Filter Buttons */}
      <div className="mb-4 flex flex-wrap items-center space-x-2">
        <Button variant={filterLetter === 'ALL' ? 'default' : 'outline'} onClick={() => setFilterLetter('ALL')}>
          ALL
        </Button>
        {availableLetters.map((letter) => (
          <Button key={letter} variant={filterLetter === letter ? 'default' : 'outline'} onClick={() => setFilterLetter(letter)}>
            {letter}
          </Button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-200">
              {/* Checkbox für die Auswahl aller Zeilen */}
              <TableHead className="px-4 py-2">
                <Checkbox checked={selectedRows.size === items.length} onCheckedChange={handleSelectAll} />
              </TableHead>
              {/* Dynamische Darstellung der Spaltenüberschriften */}
              {columns
                .filter((col) => selectedColumns.includes(col.key))
                .map((col) => (
                  <TableHead key={col.key} className="px-4 py-2">
                    {/* Spaltenüberschrift mit Filter-Icon links */}
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-1">
                        {/* Filter-Icon links vom Titel */}
                        {col.filterable && (
                          <FiFilter
                            className={`w-4 h-4 text-gray-600 cursor-pointer hover:text-gray-800 ${
                              filters[col.key] && filters[col.key] !== 'all' ? 'text-blue-600' : ''
                            }`}
                            onClick={() => toggleFilterModal(col.key)}
                          />
                        )}
                        {/* Spaltentitel und Sortierung */}
                        <span onClick={() => handleSort(col.key as keyof T)} className="cursor-pointer select-none flex items-center">
                          {col.label}
                          {sortConfig?.key === col.key && (
                            <span className="ml-1">{sortConfig.direction === 'asc' ? <FiArrowUp /> : <FiArrowDown />}</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </TableHead>
                ))}
              {/* Einstellungen-Icon für die Spaltenauswahl */}
              <TableHead className="px-4 py-2">
                <FiSettings onClick={() => setIsColumnSelectorOpen(true)} className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedItems.map((item: any) => (
              <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
                {/* Checkbox für die Auswahl der Zeile */}
                <TableCell className="px-4 py-2">
                  <Checkbox checked={selectedRows.has(item.id)} onCheckedChange={() => handleRowSelect(item.id)} />
                </TableCell>
                {/* Dynamische Darstellung der Zellen basierend auf den ausgewählten Spalten */}
                {selectedColumns.map((colKey) => (
                  <TableCell key={colKey} className="px-4 py-2">
                    {/* Hier verwenden wir die renderCell-Prop, um die Zellen anzuzeigen */}
                    {renderCell(item, colKey)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Sidebar für Massenbearbeitung */}
      <BulkActionSidebar
        isOpen={isSidebarOpen}
        selectedCount={selectedRows.size}
        onClose={() => setSelectedRows(new Set())}
        newStatus={''} // Hier sollten Sie die entsprechenden Zustände und Setter-Funktionen verwalten
        setNewStatus={() => {}} // Beispielsweise durch zusätzliche Props oder einen Callback
        newBetreuer={''}
        setNewBetreuer={() => {}}
        newKategorie={''}
        setNewKategorie={() => {}}
        newVerknuepfung={''}
        setNewVerknuepfung={() => {}}
        onDelete={() => confirmBulkAction('delete')}
        onUpdate={() => confirmBulkAction('update')}
        betreuerList={betreuerList}
      />

      {/* Modal für Spaltenauswahl */}
      <ColumnSelector
        isOpen={isColumnSelectorOpen}
        onClose={() => setIsColumnSelectorOpen(false)}
        columns={columns}
        selectedColumns={selectedColumns}
        onChange={handleColumnChange}
      />

      {/* Filter-Modal */}
      {currentFilterColumn && (
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => {
            setIsFilterModalOpen(false);
            setCurrentFilterColumn(null);
          }}
          columnKey={currentFilterColumn}
          column={columns.find((col) => col.key === currentFilterColumn)!}
          betreuerList={betreuerList}
          onBetreuerFilterChange={handleBetreuerFilterChange}
          onDateFilterChange={handleDateFilterChange}
          filters={filters}
        />
      )}
    </div>
  );
}
