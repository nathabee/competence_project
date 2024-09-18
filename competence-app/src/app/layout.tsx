// src/app/layout.tsx
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './globals.css'; // Import global styles
import Navbar from '../components/Navbar'; // Import Navbar component
import BootstrapClient from '../components/BootstrapClient'; // Import client-side Bootstrap component

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <BootstrapClient /> {/* Handle Bootstrap JS in client-side */}
        <div>{children}</div>
      </body>
    </html>
  );
}