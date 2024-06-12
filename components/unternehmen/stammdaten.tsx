'use client';

import React from 'react';

const Stammdaten: React.FC<{ unternehmen: any }> = ({ unternehmen }) => {
  return (
    <>
      <div className="pt-5">Kundennummer</div>
      <div>{unternehmen.id}</div>
      <div className="pt-5"></div>
    </>
  );
};

export default Stammdaten;
