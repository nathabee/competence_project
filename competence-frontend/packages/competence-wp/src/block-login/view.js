'use client';

import { Login } from '@shared/components/Login';
import { AuthProvider } from '@shared/context/AuthContext';

export default function LoginBlockView() {
  return (
    <AuthProvider>
      <div>
        <Login
          redirectUrl="/competence_home"
          onSuccess={() => (window.location.href = '/competence_dashboard')}
        />
      </div>
    </AuthProvider>
  );
}
