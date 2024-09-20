// src/app/admin/page.tsx

import { parseCookies } from 'nookies';
import { redirect } from 'next/navigation';

export default function AdminPage() {
  const cookies = parseCookies();
  const token = cookies.token; // Assuming your JWT token is stored in cookies

  if (!token) {
    redirect('/admin/login'); // Redirect to admin login if not authenticated
  }

  // Redirect to Django admin with the token in the header
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || 'http://127.0.0.1:8000/admin/'; // Fallback to home if undefined
  window.location.href = adminUrl;

  return <div>Redirecting to Admin...</div>;
}
