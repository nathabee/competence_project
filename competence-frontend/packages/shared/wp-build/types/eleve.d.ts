import { User } from './user';
export interface Niveau {
    id: number;
    niveau: string;
    description: string;
}
export interface Eleve {
    id: number;
    nom: string;
    prenom: string;
    niveau: number;
    niveau_description: string;
    datenaissance: string;
    professeurs_details: User[];
}
export interface EleveSelectionProps {
    eleves: Eleve[];
}
