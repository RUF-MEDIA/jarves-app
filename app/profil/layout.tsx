// app/kunden/[id]/layout.tsx
import React, { ReactNode } from 'react';
import { Metadata } from 'next';

interface LayoutProps {
  children: ReactNode; // Enthält sowohl den Hauptinhalt als auch die Sidebar
}

// Definieren der `metadata`-Funktion
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // Hier könnten Sie zusätzliche Daten basierend auf `params.id` abrufen, z.B. Benutzerdaten
  // Für dieses Beispiel setzen wir einen statischen Titel und eine Beschreibung

  return {
    title: `Profil`,
    description: `Bearbeiten Sie das Profil von Kunde ${params.id}. Aktualisieren Sie persönliche Informationen und das Profilbild.`,
  };
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <div className="w-full">{children}</div>;
};

export default Layout;
