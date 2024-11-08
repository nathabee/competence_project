'use client';

import React from 'react';
import { Eleve } from '@/types/eleve';
import UserDisplay from '@/components/UserDisplay';

import useTranslation from '@/utils/translationHelper';

interface EleveDisplayProps {
  eleve?: Eleve | null;
}

const EleveDisplay: React.FC<EleveDisplayProps> = ({ eleve }) => {
  const  t = useTranslation();

  if (!eleve) {
    return <p>{t('msg_noInfo')}</p>;
  }

  return (
    <div>
      <p>
        {t('msg_chosenStud')}: {eleve.nom} {eleve.prenom} {t(eleve.niveau_description)}, {t('tbH_birthDt')}: {eleve.datenaissance}
      </p>
      <p>{t('tbH_prof')}:</p>
      {eleve.professeurs_details.length > 0 ? (
        <ul>
          {eleve.professeurs_details.map(prof => (
            <li key={prof.id}>
              <UserDisplay user={prof} /> 
            </li>
          ))}
        </ul>
      ) : (
        <p>{t('msg_noProf')}</p>
      )}
    </div>
  );
};

export default EleveDisplay;
