 // src/types/report.ts
 
 
export interface Report {
    id: number;
    eleve: number; // or Eleve interface if desired
    professeur: number; // or User interface
    pdflayout: number; // or PdfLayout interface
    report_catalogues: ReportCatalogue[];
}

export interface ReportCatalogue {
    id: number;
    catalogue: number; // or Catalogue interface
    resultats: Resultat[];
}

export interface Resultat {
    id: number;
    groupage: number; // or GroupageData interface
    score: number;
    seuil1_percent: number;
    seuil2_percent: number;
    seuil3_percent: number;
    resultat_details: ResultatDetail[];
}

export interface ResultatDetail {
    id: number;
    item: number; // or Item interface
    score: number;
    scorelabel: string;
    observation: string;
}

export interface ScoreRulePoint {
    id: number;
    scorerule: number;
    scorelabel: string;
    score: number;
}



 