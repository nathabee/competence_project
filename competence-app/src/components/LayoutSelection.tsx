'use client'; // Ensure this is at the top for client-side rendering
// src/components/LayoutSelect.tsx
 

import React from 'react';
import { PDFLayout } from '@/types/pdf'; // Update import path based on your types
import { useAuth } from '@/context/AuthContext'; // Use AuthContext to manage state
import '@/app/globals.css';

interface LayoutSelectProps {
  layouts: PDFLayout[]; // Accept an array of PDFLayout
}

const LayoutSelect: React.FC<LayoutSelectProps> = ({ layouts }) => {
  const { activeLayout, setActiveLayout } = useAuth(); // Get activeLayout and setter from AuthContext 

  if (layouts.length === 0) return <p>No Layouts found.</p>;

  // Handle selecting a layout
  const handleLayoutSelect = (selectedLayout: PDFLayout) => {
    setActiveLayout(selectedLayout); // Set the selected layout in context 
  };

  return (
    <div className="mb-4">
      <h2>Layout Selection</h2>

      <table className="table">
        <thead>
          <tr>
            <th>Header Icon</th>
            <th>Footer Message</th>
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
                <img src={layout.header_icon} alt="Header Icon" style={{ width: '30px', height: '30px' }} />
                
              </td>
              <td>schule name : {layout.schule_name}</td>
              <td>header: {layout.header_message}</td>
              <td>footer1 : {layout.footer_message1}</td>
              <td>footer2: {layout.footer_message2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LayoutSelect;
