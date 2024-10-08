'use client';

import React from 'react';
import { PDFLayout } from '@/types/pdf';  

interface PrintHeaderProps {
  layout: PDFLayout;  
}

const PrintHeader: React.FC<PrintHeaderProps> = ({ layout }) => {
  return (
    <div className="print-header-container">
      <div id="print-header-logo">
                <img
                    src={layout.header_icon}
                    alt="Header Icon"
                    style={{ width: '50px', height: '50px', marginRight: '10px' }} // Adjust size as needed
                />
      </div>
      <div id="print-header-school">
        <h1>{layout.schule_name}</h1>
      </div>
    </div>
  );
};

export default PrintHeader;
