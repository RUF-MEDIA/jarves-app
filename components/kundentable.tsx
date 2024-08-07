'use client';

import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from '@/components/ui/table';
import Link from 'next/link';
import { FiSettings } from 'react-icons/fi'; // Import the settings icon from react-icons
import { FaStar } from 'react-icons/fa'; // Import the star icon from react-icons

// Manuelle Definition der Spalten basierend auf dem Prisma-Schema
const columns = [
  { key: 'autogeneratedNr', label: 'Kundennummer' },
  { key: 'name', label: 'Kundenname' },
  { key: 'status', label: 'Status' },
  { key: 'kategorie', label: 'Kategorie' },
  { key: 'strasse', label: 'Straße' },
  { key: 'postleitzahl', label: 'Postleitzahl' },
  { key: 'stadt', label: 'Stadt' },
  { key: 'umsatzsteuerId', label: 'Umsatzsteuer-ID' },
  { key: 'standort', label: 'Standort' },
  { key: 'homepage', label: 'Homepage' },
  { key: 'jobsite', label: 'Jobsite' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'xing', label: 'Xing' },
  { key: 'zentraleMail', label: 'E-Mail' },
  { key: 'zentralTelefon', label: 'Telefonnummer' },
  { key: 'vermittlungsprovision', label: 'Vermittlungsprovision' },
  { key: 'usbBeschreibung', label: 'USB Beschreibung' },
  { key: 'interneNotizen', label: 'Interne Notizen' },
  { key: 'erstelltAm', label: 'Erstellt Am' },
  { key: 'letzteAenderungAm', label: 'Letzte Änderung Am' },
  { key: 'betreuer', label: 'Betreuer' },
];

const defaultSelectedColumns = ['autogeneratedNr', 'name', 'status', 'kategorie', 'betreuer', 'zentraleMail', 'zentralTelefon'];

export function KundenTable({ allUsers }: { allUsers: Array<any> }) {
  const [selectedColumns, setSelectedColumns] = useState(defaultSelectedColumns);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterLetter, setFilterLetter] = useState('ALL');

  const handleColumnChange = (key: string) => {
    setSelectedColumns((prev) => (prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key]));
  };

  // Funktion zum Formatieren von Date-Objekten
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE');
  };

  // Funktion zum Rendern von Sternen basierend auf der Kategorie
  const renderStars = (rating: number) => {
    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        {Array.from({ length: 5 }, (_, i) => (
          <FaStar key={i} color={i < rating ? 'gold' : 'gray'} />
        ))}
      </div>
    );
  };

  // Generiere die Liste der Buchstaben, die in den Firmennamen vorhanden sind
  const availableLetters = useMemo(() => {
    const letters = new Set(allUsers.map((user) => user.name.charAt(0).toUpperCase()));
    return Array.from(letters).sort();
  }, [allUsers]);

  // Filtere die Benutzer basierend auf dem ausgewählten Buchstaben
  const filteredUsers = filterLetter === 'ALL' ? allUsers : allUsers.filter((user) => user.name.startsWith(filterLetter));

  return (
    <div className="">
      <div className="mb-4">
        <button onClick={() => setFilterLetter('ALL')} className={`mr-2 ${filterLetter === 'ALL' ? 'font-bold' : ''}`}>
          ALL
        </button>
        {availableLetters.map((letter) => (
          <button key={letter} onClick={() => setFilterLetter(letter)} className={`mr-2 ${filterLetter === letter ? 'font-bold' : ''}`}>
            {letter}
          </button>
        ))}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {columns
              .filter((col) => selectedColumns.includes(col.key))
              .map((col) => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
            <TableHead>
              <FiSettings onClick={() => setIsModalOpen(true)} style={{ cursor: 'pointer' }} />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((unternehmen) => (
            <TableRow key={unternehmen.id}>
              {selectedColumns.includes('autogeneratedNr') && <TableCell>{unternehmen.autogeneratedNr}</TableCell>}
              {selectedColumns.includes('name') && (
                <TableCell>
                  <Link href={`/kunden/${unternehmen.id}`} legacyBehavior>
                    <a className="text-current no-underline">{unternehmen.name}</a>
                  </Link>
                </TableCell>
              )}
              {selectedColumns.includes('status') && <TableCell>{unternehmen.status}</TableCell>}
              {selectedColumns.includes('kategorie') && <TableCell>{renderStars(unternehmen.kategorie)}</TableCell>}
              {selectedColumns.includes('strasse') && <TableCell>{unternehmen.strasse}</TableCell>}
              {selectedColumns.includes('postleitzahl') && <TableCell>{unternehmen.postleitzahl}</TableCell>}
              {selectedColumns.includes('stadt') && <TableCell>{unternehmen.stadt}</TableCell>}
              {selectedColumns.includes('umsatzsteuerId') && <TableCell>{unternehmen.umsatzsteuerId}</TableCell>}
              {selectedColumns.includes('standort') && <TableCell>{unternehmen.standort}</TableCell>}
              {selectedColumns.includes('homepage') && (
                <TableCell>
                  <a href={unternehmen.homepage} target="_blank" className="text-current no-underline">
                    {unternehmen.homepage}
                  </a>
                </TableCell>
              )}
              {selectedColumns.includes('jobsite') && (
                <TableCell>
                  <a href={unternehmen.jobsite} target="_blank" className="text-current no-underline">
                    {unternehmen.jobsite}
                  </a>
                </TableCell>
              )}
              {selectedColumns.includes('linkedin') && (
                <TableCell>
                  <a href={unternehmen.linkedin} target="_blank" className="text-current no-underline">
                    {unternehmen.linkedin}
                  </a>
                </TableCell>
              )}
              {selectedColumns.includes('xing') && (
                <TableCell>
                  <a href={unternehmen.xing} target="_blank" className="text-current no-underline">
                    {unternehmen.xing}
                  </a>
                </TableCell>
              )}
              {selectedColumns.includes('zentraleMail') && (
                <TableCell>
                  <a href={`mailto:${unternehmen.zentraleMail}`} className="text-current no-underline">
                    {unternehmen.zentraleMail}
                  </a>
                </TableCell>
              )}
              {selectedColumns.includes('zentralTelefon') && (
                <TableCell>
                  <a href={`tel:${unternehmen.zentralTelefon}`} className="text-current no-underline">
                    {unternehmen.zentralTelefon}
                  </a>
                </TableCell>
              )}
              {selectedColumns.includes('vermittlungsprovision') && <TableCell>{unternehmen.vermittlungsprovision}</TableCell>}
              {selectedColumns.includes('usbBeschreibung') && <TableCell>{unternehmen.usbBeschreibung}</TableCell>}
              {selectedColumns.includes('interneNotizen') && <TableCell>{unternehmen.interneNotizen}</TableCell>}
              {selectedColumns.includes('erstelltAm') && <TableCell>{formatDate(unternehmen.erstelltAm)}</TableCell>}
              {selectedColumns.includes('letzteAenderungAm') && <TableCell>{formatDate(unternehmen.letzteAenderungAm)}</TableCell>}
              {selectedColumns.includes('betreuer') && <TableCell>{unternehmen.betreuer?.name}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Wählen Sie die anzuzeigenden Spalten</h2>
            <div className="grid grid-cols-2 gap-4">
              {columns.map((col) => (
                <label key={col.key} className="block mb-2 text-sm">
                  <input type="checkbox" checked={selectedColumns.includes(col.key)} onChange={() => handleColumnChange(col.key)} className="mr-2" />
                  {col.label}
                </label>
              ))}
            </div>
            <button onClick={() => setIsModalOpen(false)} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
              Schließen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
