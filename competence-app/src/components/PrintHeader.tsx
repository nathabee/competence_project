'use client';

import React from 'react';
import { PDFLayout } from '@/types/pdf'; // Ensure the interface import is correct

interface PrintHeaderProps {
  config: PDFLayout; // Use the proper PDFLayout interface for props
}

const PrintHeader: React.FC<PrintHeaderProps> = ({ config }) => {
  return (
    <div className="print-header-container">
      <div id="print-header-logo">
        <img 
          src={config.header_icon} 
          alt="Logo" 
          style={{ maxWidth: '100px', maxHeight: '50px' }} 
        />
      </div>
      <div id="print-header-school">
        <h1>{config.footer_message}</h1>
      </div>
    </div>
  );
};

export default PrintHeader;
