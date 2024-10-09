// src/components/LayoutDisplay.tsx

'use client';

import React from 'react';
import { PDFLayout } from '@/types/pdf'; // Import the PDFLayout type

 
interface LayoutDisplayProps {
    layout?: PDFLayout | null; // layout is optional and can be null
}

const LayoutDisplay: React.FC<LayoutDisplayProps> = ({ layout }) => {
    if (!layout) {
        return <p>No layout information available.</p>; // Handle case when layout is not passed
    }


   // Use the base64 encoded image
    const imageBase64 = layout.header_icon_base64;

    return (
        <div>
            <h2>Active Layout</h2>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                    src={imageBase64} // Use the base64 string directly as the image source
                    alt="Header Icon"
                    style={{ width: '50px', height: '50px', marginRight: '10px' }}
                />
                <p>Schule Name: {layout.schule_name}</p>
            </div>
            <div>
                <p>Header: {layout.header_message}</p>
                <p>Footer 1: {layout.footer_message1}</p>
                <p>Footer 2: {layout.footer_message2}</p>
            </div>
        </div>
    );
};

export default LayoutDisplay;



    /* Ensure the image URL points to the correct location
    //const imageUrl = `${layout.header_icon}`;

    return (
        <div>
            <h2>Active Layout</h2>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                    src={imageUrl} // Use the updated image URL
                    alt="Header Icon"
                    style={{ width: '50px', height: '50px', marginRight: '10px' }} // Adjust size as needed
                />
                <p>Schule Name: {layout.schule_name}</p>
            </div>
            <div>
                <p>Header: {layout.header_message}</p>
                <p>Footer 1: {layout.footer_message1}</p>
                <p>Footer 2: {layout.footer_message2}</p>
            </div>
        </div>
    ); */
