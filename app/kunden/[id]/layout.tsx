import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, sidebar }) => {
  return (
    <div className="flex gap-4">
      <div className="flex-grow bg-white px-5 ms-5 pt-5 pb-5" style={{ flexBasis: '30%' }}>
        {children}
      </div>
      <div className="bg-white px-5 ms-5 pt-5 pb-5" style={{ flexBasis: '40%' }}>
        {sidebar}
      </div>
    </div>
  );
};

export default Layout;
