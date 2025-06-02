export interface MyImage {
    id: number;
    icon_base64?: string;
    url?: string;
}
export interface GroupageData {
    id: number;
    position: number;
    desc_groupage: string;
    label_groupage: string;
    link: string;
    max_point: number;
    seuil1: number;
    seuil2: number;
    max_item: number;
    catalogue: number;
    groupage_icon_id: number;
}
export interface Item {
    id: number;
    temps: string;
    description: string;
    observation: string;
    max_score: number;
    itempos: number;
    link: string;
    groupagedata: number;
    scorerule: number;
}
export interface ResultatDetail {
    id: number;
    item: Item;
    score: number;
    scorelabel: string;
    observation: string;
}
export interface Resultat {
    id: number;
    groupage: GroupageData;
    score: number;
    seuil1_percent: number;
    seuil2_percent: number;
    seuil3_percent: number;
    resultat_details: ResultatDetail[];
}
export interface ReportCatalogue {
    id: number;
    catalogue: CatalogueDescription;
    resultats: Resultat[];
}
export interface Report {
    id: number;
    eleve: number;
    professeur: number;
    pdflayout: number;
    created_at: string;
    updated_at: string;
    report_catalogues: ReportCatalogue[];
}
export interface CatalogueDescription {
    id: number;
    description: string;
}
export interface Catalogue {
    id: number;
    annee: {
        annee: string;
    };
    niveau: {
        niveau: string;
    };
    etape: {
        etape: string;
    };
    matiere: {
        matiere: string;
    };
    description: string;
}
export interface CatalogueSelectionProps {
    catalogue: Catalogue[];
}
export interface ScoreRulePoint {
    id: number;
    scorerule: number;
    scorelabel: string;
    score: number;
}
export interface ScoreRule {
    id: number;
    description: string;
}
