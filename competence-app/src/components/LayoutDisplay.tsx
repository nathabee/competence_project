'use client';

import React from 'react';
import Image from 'next/image'; // Import Image from next/image
import { PDFLayout } from '@/types/pdf'; // Import the PDFLayout type 
import useTranslation from '@/utils/translationHelper';

interface LayoutDisplayProps {
    layout?: PDFLayout | null; // layout is optional and can be null
}

const LayoutDisplay: React.FC<LayoutDisplayProps> = ({ layout }) => {
    const  t  = useTranslation();
    if (!layout) {
        return <p>{t('msg_noInfo')}</p>; // Handle case when layout is not passed
    } 

    return (
        <div>
            <h2>{t('pdf_lytChosen')}:</h2>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Image
                  src={`${layout.header_icon_base64}`} // Use Base64 string directly
                  alt="Icon"
                  width={50} // Specify width
                  height={50} // Specify height
                  style={{ marginRight: '10px' }} // Inline styles for margin
                />
                <p>{t('pdf_lytSchlName')}: {layout.schule_name}</p>
            </div>
            <div>
                <p>{t('pdf_lytMsgTop')}: {layout.header_message}</p>
                <p>{t('pdf_lytMsgFoot1')}: {layout.footer_message1}</p>
                <p>{t('pdf_lytMsgFoot2')}: {layout.footer_message2}</p>
            </div>
        </div>
    );
};

export default LayoutDisplay;
