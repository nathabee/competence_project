import { User } from './user';

export interface Eleve {
  id: number;
  nom: string;
  prenom: string;
  classe: string;
  textnote1: string | null;
  textnote2: string | null;
  textnote3: string | null;
  professeurs: User[];  // Array of User (Teachers)
}

 

export interface EleveSelectionProps {
  eleve: Eleve[];
}