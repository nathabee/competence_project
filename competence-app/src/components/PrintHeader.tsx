'use client';

import React, { useEffect, useRef } from 'react';
import { PDFLayout } from '../types/pdf'; 

interface PrintHeaderProps {
  layout: PDFLayout;
}

const PrintHeader: React.FC<PrintHeaderProps> = ({ layout }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (canvas && context) {
      const image = new Image();
      // Set the image source to the Base64 encoded string
      image.src = layout.header_icon_base64; // Updated to use the new property

      image.onload = () => {
        // Set canvas size based on image size and draw it
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);
      };

      image.onerror = (error) => {
        console.error("Image failed to load:", error);
      };
    }
  }, [layout.header_icon_base64]); // Updated dependency to use the new property
  
  return (
    <div className="print-header-container">
      <div id="print-header-logo">
        <canvas ref={canvasRef} id="headerCanvas"></canvas>
      </div>
      <div id="print-header-school">
        <h1>{layout.schule_name}</h1>
      </div>
    </div>
  );
};

export default PrintHeader;
