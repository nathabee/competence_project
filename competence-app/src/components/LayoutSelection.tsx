'use client'; // Ensure this is at the top for client-side rendering

import React from 'react';
import Image from 'next/image'; // Import Image from next/image
import { PDFLayout } from '../types/pdf'; // Update import path based on your types
import { useAuth } from '@/context/AuthContext'; // Use AuthContext to manage state
import '@/app/globals.css';
import useTranslation from '@/utils/translationHelper';

interface LayoutSelectionProps {
  layouts: PDFLayout[]; // Accept an array of PDFLayout
}

const LayoutSelection: React.FC<LayoutSelectionProps> = ({ layouts }) => {
  const { activeLayout, setActiveLayout } = useAuth(); // Get activeLayout and setter from AuthContext 
  const  t  = useTranslation();

  if (layouts.length === 0) return <p>{t('msg_noLyt')}</p>;

  // Handle selecting a layout
  const handleLayoutSelect = (selectedLayout: PDFLayout) => {
    setActiveLayout(selectedLayout); // Set the selected layout in context 
  };

  return (
    <div className="mb-4">
      <h2>{t('pgH_select_conf')}</h2>

      <table className="table">
        <thead>
          <tr>
            <th>{t('pdf_lytIconeTop')}</th>
            <th>{t('pdf_lytSchlName')}</th>
            <th>{t('pdf_lytMsgTop')}:</th>
            <th>{t('pdf_lytMsgFoot1')}</th>
            <th>{t('pdf_lytMsgFoot2')}</th>
          </tr>
        </thead>
        <tbody>
          {layouts.map(layout => (
            <tr
              key={layout.id} // Ensure your PDFLayout has an id property
              onClick={() => handleLayoutSelect(layout)}
              className={activeLayout?.id === layout.id ? 'selected-row' : ''}
              style={{ cursor: 'pointer' }}
            >
              <td>
                < Image
                  src={`${layout.header_icon_base64}`} // Use Base64 string directly
                  alt="Icon"
                  width={50} // Specify width
                  height={50} // Specify height
                  style={{ marginRight: '10px' }} // Inline styles for margin
                /> 
              </td>
              <td>{layout.schule_name}</td>
              <td>{layout.header_message}</td>
              <td>{layout.footer_message1}</td>
              <td>{layout.footer_message2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LayoutSelection;
