// src/app/layout.tsx

'use client'; // Runs on the client side

import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import '@shared/styles/global.css'; // Shared app styles

import { AuthProvider } from '@shared/context/AuthContext';
import BootstrapClient from '@shared/components/BootstrapClient'; // Now shared
import Navbar from '@/components/Navbar'; 

 

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <BootstrapClient /> {/* Handle Bootstrap JS in client-side */}
          <div className="layout-container">
            <Navbar /> {/* Include Navbar, which handles its own sidebar state */}
            <div className="content-container">
              <main>{children}</main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
} 