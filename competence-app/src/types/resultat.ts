import { GroupageData, Item } from './groupage';
import { User } from './user';
import { Eleve } from './eleve';

export interface ResultatDetail {
  id: number;
  resultat_id: number; // This is now a simple number
  eleve: Eleve; // Eleve details (already linked to active eleve)
  testdetail: Item; // Item details
  scorelabel: string | null;
  observation: string | null;
  score: number;
  professeur: User; // Full User object
}


export interface Resultat {
  id: number;
  eleve_id: number; // This could be useful if you need to reference the eleve ID directly
  eleve: Eleve; // Use the Eleve type directly
  groupage_id: number; // Could also be useful for reference
  groupage: GroupageData; // GroupageData object
  score: number; // The main score
  seuil1_percent: number; // Percent thresholds
  seuil2_percent: number; // Percent thresholds
  seuil3_percent: number; // Percent thresholds
  professeur: User; // Full User object
  resultat_details: ResultatDetail[]; // Array of ResultatDetail objects
}
