// app/kunden/[id]/layout.tsx
import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode; // Enthält sowohl den Hauptinhalt als auch die Sidebar
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <div className="w-full">{children}</div>;
};

export default Layout;
