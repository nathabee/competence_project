'use client';

import {  EleveDisplay }  from '@shared/components/EleveDisplay';
import  { EleveForm }  from '@shared/components/EleveForm';
import  { EleveSelection }  from '@shared/components/EleveSelection';
import { AuthProvider, useAuth } from '@shared/context/AuthContext';

export default function EleveBlockView() {
  return (
    <AuthProvider>
      <InnerEleve />
    </AuthProvider>
  );
}

function InnerEleve() {
  const { token } = useAuth();

  if (!token) {
    window.location.href = '/wp-admin/admin.php?page=competence_login';
    return null;
  }

  return (
    <div className="mb-4">
      <EleveForm />
      <EleveSelection />
      <EleveDisplay />
    </div>
  );
}
