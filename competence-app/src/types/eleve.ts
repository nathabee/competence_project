

import { User } from './user';


export interface Eleve {
  id: number; // or whatever the type is
  nom: string;
  prenom: string;
  niveau: string; // Change this to match the type of 'niveau' in Django if it's not a string
  datenaissance:  Date | null; // Keeping this as a string to represent the date format (YYYY-MM-DD)
  professeurs: number[]; // Array of User IDs
  professeurs_details: User[]; // Array of serialized User objects
}

// Define the props for EleveSelection
export interface EleveSelectionProps {
  eleves: Eleve[];  
}