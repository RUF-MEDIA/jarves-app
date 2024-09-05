// components/Sidebar.tsx
import React from 'react';

// Definiere die Props, die von der Sidebar erwartet werden
interface SidebarProps {
  unternehmen: {
    name: string;
    description: string;
    location: string;
  };
}

const Sidebar: React.FC<SidebarProps> = ({ unternehmen }) => {
  if (!unternehmen) {
    return <div className="p-4">Laden...</div>; // Falls keine Daten vorhanden sind
  }

  return (
    <aside className="bg-gray-100 p-4">
      <h1 className="text-xl font-bold">{unternehmen.name}</h1>
      <p className="mt-2">{unternehmen.description}</p>
      <p className="mt-2">{unternehmen.location}</p>
    </aside>
  );
};

export default Sidebar;
