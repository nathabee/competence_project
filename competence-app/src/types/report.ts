

export interface ReportCatalogue {
    id: number;
    report: number;
    catalogue: number;
    catalogue_desc: {
        description: string;
    };
}

export interface Report {
    id: number;
    eleve: number;
    professeur: number;
    pdflayout: number;
    report_catalogues: ReportCatalogue[];
    created_at: string;
    updated_at: string;
}

