 

// src/app/login/page.tsx

import { Suspense } from 'react';
import LoginForm from '@/app/login/LoginForm';

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

 