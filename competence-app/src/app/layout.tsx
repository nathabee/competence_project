// src/app/layout.tsx
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './globals.css'; // Import global styles
import Navbar from '../components/Navbar'; // Import Navbar component
import BootstrapClient from '../components/BootstrapClient'; // Import client-side Bootstrap component

import { AuthProvider } from '../context/AuthContext';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (

    <html lang="en">
      <body>

        <AuthProvider>
          <BootstrapClient /> {/* Handle Bootstrap JS in client-side */}
          <Navbar />
          <main>{children}</main>

        </AuthProvider>
      </body>
    </html>
  );
}
