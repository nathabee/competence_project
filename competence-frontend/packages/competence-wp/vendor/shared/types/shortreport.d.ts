export interface ShortProfesseur {
    last_name: string;
    first_name: string;
}
export interface ShortGroupageData {
    id: number;
    desc_groupage: string;
    label_groupage: string;
    position: number;
    max_point: number;
    seuil1: number;
    seuil2: number;
}
export interface ShortResultat {
    id: number;
    score: number;
    seuil1_percent: number;
    seuil2_percent: number;
    seuil3_percent: number;
    groupage: ShortGroupageData;
}
export interface ShortReportCatalogue {
    id: number;
    catalogue: string;
    resultats: ShortResultat[];
}
export interface ShortEleve {
    id: number;
    prenom: string;
    nom: string;
    niveau: string;
}
export interface ShortReport {
    id: number;
    eleve: ShortEleve;
    professeur: ShortProfesseur;
    report_catalogues: ShortReportCatalogue[];
    created_at: string;
    updated_at: string;
}
