// components/KundenTable.tsx

'use client';

import { DataTable } from './DataTable';
import { FaStar } from 'react-icons/fa';
import Link from 'next/link';
import { useState } from 'react';
import BulkActionSidebar from './BulkActionSidebar'; // Importieren, wenn nötig
import React from 'react';

interface User {
  id: string;
  autogeneratedNr: number;
  name: string;
  status: string;
  kategorie: number | null;
  strasse: string;
  postleitzahl: string;
  stadt: string;
  umsatzsteuerId: string | null;
  standort: string;
  homepage?: string | null;
  jobsite?: string | null;
  linkedin?: string | null;
  xing?: string | null;
  zentraleMail?: string | null;
  zentralTelefon?: string | null;
  vermittlungsprovision?: string | null;
  usbBeschreibung?: string | null;
  interneNotizen?: string | null;
  erstelltAm: string;
  letzteAenderungAm: string;
  betreuer?: {
    id: string;
    name: string;
  } | null;
  unternehmensverknuepfung?: string | null;
  [key: string]: any;
}

interface Betreuer {
  id: string;
  name: string;
}

const columns = [
  { key: 'autogeneratedNr', label: 'Kundennummer', filterable: false },
  { key: 'name', label: 'Kundenname', filterable: false },
  { key: 'status', label: 'Status', filterable: true },
  { key: 'kategorie', label: 'Kategorie', filterable: true },
  { key: 'strasse', label: 'Straße', filterable: false },
  { key: 'postleitzahl', label: 'Postleitzahl', filterable: false },
  { key: 'stadt', label: 'Stadt', filterable: false },
  { key: 'umsatzsteuerId', label: 'Umsatzsteuer-ID', filterable: false },
  { key: 'standort', label: 'Standort', filterable: false },
  { key: 'homepage', label: 'Homepage', filterable: false },
  { key: 'jobsite', label: 'Jobsite', filterable: false },
  { key: 'linkedin', label: 'LinkedIn', filterable: false },
  { key: 'xing', label: 'Xing', filterable: false },
  { key: 'zentraleMail', label: 'E-Mail', filterable: false },
  { key: 'zentralTelefon', label: 'Telefonnummer', filterable: false },
  { key: 'vermittlungsprovision', label: 'Vermittlungsprovision', filterable: false },
  { key: 'usbBeschreibung', label: 'USB Beschreibung', filterable: false },
  { key: 'interneNotizen', label: 'Interne Notizen', filterable: false },
  { key: 'erstelltAm', label: 'Erstellt Am', filterable: false },
  { key: 'letzteAenderungAm', label: 'Letzte Änderung Am', filterable: true },
  { key: 'betreuer', label: 'Betreuer', filterable: true },
];

const defaultSelectedColumns = ['autogeneratedNr', 'name', 'status', 'kategorie', 'zentraleMail', 'zentralTelefon', 'betreuer'];

interface KundenTableProps {
  betreuerList: Betreuer[];
}

const KundenTable: React.FC<KundenTableProps> = ({ betreuerList }) => {
  // Zustände für BulkActionSidebar verwalten
  const [newStatus, setNewStatus] = useState('');
  const [newBetreuer, setNewBetreuer] = useState('');
  const [newKategorie, setNewKategorie] = useState('');
  const [newVerknuepfung, setNewVerknuepfung] = useState('');

  // Funktion zur dynamischen Darstellung der Tabellenzellen basierend auf dem Spaltenkey
  const renderKundenCell = (item: User, key: string) => {
    let value = item[key];

    if (key === 'name') {
      return (
        <Link href={`/kunden/${item.id}`} className="text-blue-600 hover:underline">
          {value}
        </Link>
      );
    }

    if (key === 'kategorie') {
      return (
        <div className="flex space-x-1">
          {Array.from({ length: 5 }, (_, i) => (
            <FaStar key={i} className="w-4 h-4" color={i < (value || 0) ? 'gold' : 'gray'} />
          ))}
        </div>
      );
    }

    if (key === 'betreuer') {
      return item.betreuer ? item.betreuer.name : '-';
    }

    if (key === 'erstelltAm' || key === 'letzteAenderungAm') {
      const date = new Date(value);
      return date.toLocaleDateString('de-DE');
    }

    if (['homepage', 'jobsite', 'linkedin', 'xing'].includes(key)) {
      return value ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          {value}
        </a>
      ) : (
        '-'
      );
    }

    if (key === 'zentraleMail') {
      return value ? (
        <a href={`mailto:${value}`} className="text-blue-600 hover:underline">
          {value}
        </a>
      ) : (
        '-'
      );
    }

    if (key === 'zentralTelefon') {
      return value ? (
        <a href={`tel:${value}`} className="text-blue-600 hover:underline">
          {value}
        </a>
      ) : (
        '-'
      );
    }

    if (value === null || value === undefined || (typeof value === 'object' && !React.isValidElement(value))) {
      return '-';
    }

    return value.toString();
  };

  return (
    <div className="p-4 min-h-screen">
      <DataTable<User>
        apiEndpoint="/api/getUnternehmen"
        columns={columns}
        defaultSelectedColumns={defaultSelectedColumns}
        betreuerList={betreuerList}
        renderCell={renderKundenCell}
      />

      {/* Sidebar für Massenbearbeitung */}
      <BulkActionSidebar
        isOpen={newStatus !== '' || newBetreuer !== '' || newKategorie !== '' || newVerknuepfung !== ''}
        selectedCount={0} // Hier sollten Sie den tatsächlichen ausgewählten Count übergeben
        onClose={() => {
          setNewStatus('');
          setNewBetreuer('');
          setNewKategorie('');
          setNewVerknuepfung('');
        }}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        newBetreuer={newBetreuer}
        setNewBetreuer={setNewBetreuer}
        newKategorie={newKategorie}
        setNewKategorie={setNewKategorie}
        newVerknuepfung={newVerknuepfung}
        setNewVerknuepfung={setNewVerknuepfung}
        onDelete={() => {
          // Hier könnten Sie eine Funktion zur Löschung implementieren
        }}
        onUpdate={() => {
          // Hier könnten Sie eine Funktion zur Aktualisierung implementieren
        }}
        betreuerList={betreuerList}
      />
    </div>
  );
};

export default KundenTable;
