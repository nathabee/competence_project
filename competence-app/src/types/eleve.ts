// types/eleve.ts

import { User } from './user';


export interface Eleve {
  id: number; // or whatever the type is
  nom: string;
  prenom: string;
  niveau: string; // will be the niveau_id
  niveau_niveau: string; // niveau.niveau associated to the eleve (short description)
  datenaissance:  string; // Keeping this as a string to represent the date format (YYYY-MM-DD)
  professeurs: number[]; // Array of User IDs
  professeurs_details: User[]; // Array of serialized User objects
}

// Define the props for EleveSelection
export interface EleveSelectionProps {
  eleves: Eleve[];  
}