// src/types/catalogue.ts

export interface Catalogue {
    id: number;
    annee: { annee: string }; // Adjust based on your actual structure
    niveau: { niveau: string };
    etape: { etape: string };
    matiere: { matiere: string };
    description: string;
}

export interface CatalogueSelectionProps {
    catalogue: Catalogue[];
}
