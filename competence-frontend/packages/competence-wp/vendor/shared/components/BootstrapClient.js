// src/components/BootstrapClient.tsx
'use client'; // Mark this as a Client Component
import { useEffect } from 'react';
/*************************************** */
// NOT CHECKED ON WORDPRESS COMPATIBiLITY YET
/*************************************** */
export default function BootstrapClient() {
    useEffect(() => {
        import('bootstrap/dist/js/bootstrap.bundle.min.js');
    }, []);
    return null; // This component doesn't render anything
}
