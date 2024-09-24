'use client'
// src/app/layout.tsx
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './globals.css'; // Import global styles
import BootstrapClient from '@/components/BootstrapClient'; // Import client-side Bootstrap component
import Navbar from '@/components/Navbar'; // Import Navbar component

import { AuthProvider } from '@/context/AuthContext';
import { TestProvider } from '@/context/TestContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (

    <html lang="en">
      <body>

        <AuthProvider>
        <TestProvider>
          <BootstrapClient /> {/* Handle Bootstrap JS in client-side */}
          <Navbar />
          <main>{children}</main>

          </TestProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
