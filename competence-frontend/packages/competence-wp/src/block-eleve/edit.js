// wordpress block-eleve edit.js
'use client';

import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { EleveForm }  from '@shared/components/EleveForm';
import { EleveDisplay  } from '@shared/components/EleveDisplay';
import { EleveSelection }  from '@shared/components/EleveSelection';

import { AuthProvider ,useAuth} from  '@shared/context/AuthContext';




export default function Edit() {

	/*
    <AuthProvider>
      <InnerBlock />
    </AuthProvider>*/

  return (
      <InnerBlock />
  );
}

function InnerBlock() {
  const { token } = useAuth();

  if (!token) {
    window.location.href = '/wp-admin/admin.php?page=competence_login';
    return null;
  }

  return (
    <div {...useBlockProps()}>
      <div className="mb-4">
        <EleveForm />
        <EleveSelection />
        <EleveDisplay />
      </div>
    </div>
  );
}
