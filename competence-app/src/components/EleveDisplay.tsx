'use client';

import React from 'react';
import { Eleve } from '@/types/eleve';
import UserDisplay from '@/components/UserDisplay';
import { useTranslation } from 'react-i18next';

interface EleveDisplayProps {
  eleve?: Eleve | null;
}

const EleveDisplay: React.FC<EleveDisplayProps> = ({ eleve }) => {
  const { t } = useTranslation();

  if (!eleve) {
    return <p>{t('eleveDisplay.noInfo')}</p>;
  }

  return (
    <div>
      <p>
        {t('eleveDisplay.chosenStudent')}: {eleve.nom} {eleve.prenom} {t(eleve.niveau_description)}, {t('tableHeaders.birthDate')}: {eleve.datenaissance}
      </p>
      <p>{t('tableHeaders.professors')}:</p>
      {eleve.professeurs_details.length > 0 ? (
        <ul>
          {eleve.professeurs_details.map(prof => (
            <li key={prof.id}>
              <UserDisplay user={prof} /> 
            </li>
          ))}
        </ul>
      ) : (
        <p>{t('eleveDisplay.noProfessors')}</p>
      )}
    </div>
  );
};

export default EleveDisplay;
