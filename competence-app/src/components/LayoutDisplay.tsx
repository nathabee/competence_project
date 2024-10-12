'use client';

import React from 'react';
import Image from 'next/image'; // Import Image from next/image
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
                <Image
                    src={`${imageBase64}`}   //MIME are included in imageBase64
                    alt="Header Icon"
                    width={50} // Specify width
                    height={50} // Specify height
                    style={{ marginRight: '10px' }} // Inline styles for margin
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
