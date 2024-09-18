// src/app/page.tsx
'use client'; // Mark this as a Client Component

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Example: redirect or other side effects
    router.push('/dashboard');
  }, [router]);

  return <div>Welcome to Competence App!</div>;
}
