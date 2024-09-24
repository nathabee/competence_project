'use client';
import React from 'react';
import EleveComponent from './Eleve';
import { Eleve } from '@/types/eleve';

interface EleveListProps {
  eleves: Eleve[];
}

const EleveList: React.FC<EleveListProps> = ({ eleves }) => {
  return (
    <div>
      <h1>Students</h1>
      {eleves.map(eleve => <EleveComponent key={eleve.id} eleve={eleve} />)}
    </div>
  );
};

export default EleveList;
