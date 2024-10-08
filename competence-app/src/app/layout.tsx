'use client'
// src/app/layout.tsx
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './globals.css'; // Import global styles
import BootstrapClient from '@/components/BootstrapClient'; // Import client-side Bootstrap component
import Navbar from '@/components/Navbar'; // Import Navbar component

import { AuthProvider } from '@/context/AuthContext'; 

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (

    <html lang="en">
      <body>

        <AuthProvider> 
          <BootstrapClient /> {/* Handle Bootstrap JS in client-side */}
          <div className="layout-container">
            <Navbar /> {/* Left-side Navbar */}
            <div className="content-container">
              <main>{children}</main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
