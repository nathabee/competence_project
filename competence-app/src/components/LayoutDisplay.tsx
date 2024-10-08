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

    return (
        <div>
            <h2>Active Layout</h2>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img
                    src={layout.header_icon}
                    alt="Header Icon"
                    style={{ width: '50px', height: '50px', marginRight: '10px' }} // Adjust size as needed
                />
                <p>schule name : {layout.schule_name}</p>
            </div>
            <div>

                <p>header: {layout.header_message}</p>
                <p>footer1 : {layout.footer_message1}</p>
                <p>footer2: {layout.footer_message2}</p>
            </div>
        </div>
    );
};

export default LayoutDisplay;
