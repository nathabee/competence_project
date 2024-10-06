 // src/types/report.ts

  
// src/types/report.ts

  
export interface GroupageData {
    id: number;
    position: number;     // Position within the group
    desc_groupage: string; // Description of the groupage
    label_groupage: string; // Label for the groupage
    link: string;         // Link to additional information, if applicable
    max_point: number;    // Maximum points achievable
    seuil1: number;       // Threshold values
    seuil2: number;
    max_item: number;     // Maximum number of items
    catalogue: number;    // ID of the related catalogue
  }

  
export interface Item {
    id: number;
    temps: string;  // Assuming this represents time duration; update type if necessary
    description: string;
    observation: string;
    max_score: number;
    itempos: number;  // Position of the item
    link: string;      // Link to the item, if applicable
    groupagedata: number;  // Assuming it's an ID for the related groupage
    scorerule: number;     // Assuming it's an ID for the scoring rule
  }
  
  export interface ResultatDetail {
    id: number;
    item: Item;  // Changed to use Item interface for clarity and consistency
    score: number;
    scorelabel: string;
    observation: string;
  }
  
  export interface Resultat {
    id: number;
    groupage: GroupageData;  // GroupageData object for the associated group
    score: number;            // Score for the resultat
    seuil1_percent: number;   // Threshold percentage 1
    seuil2_percent: number;   // Threshold percentage 2
    seuil3_percent: number;   // Threshold percentage 3
    resultat_details: ResultatDetail[];  // Array of ResultatDetail
  }
  
  export interface ReportCatalogue {
    id: number;
    description: string;     // Description of the report catalogue
    resultats: Resultat[];   // Array of Resultat objects
  }
  
  export interface Report {
    id: number;
    eleve: number;          // ID of the student (Eleve)
    professeur: number;     // ID of the teacher (User)
    pdflayout: number;      // ID of the PDF layout
    created_at: string;     // Creation date
    updated_at: string;     // Last updated date
    report_catalogues: ReportCatalogue[];  // Array of ReportCatalogue
  }

  export interface CatalogueDescription {
    id: number;
    description: string;      // Description of the catalogue
  }
  

    
  export interface Catalogue {
    id: number;
    annee: { annee: string }; // Year structure
    niveau: { niveau: string }; // Level structure
    etape: { etape: string };   // Step structure
    matiere: { matiere: string }; // Subject structure
    description: string;        // Description of the catalogue
  }
  


  export interface CatalogueSelectionProps {
    catalogue: Catalogue[];    // Array of Catalogues
  }
  
  export interface ScoreRulePoint {
    id: number;
    scorerule: number;         // ID of the scoring rule
    scorelabel: string;        // Label for the score
    score: number;             // Score value
  }
  
  export interface ScoreRule {
    id: number; 
    description: string;       // Description of the scoring rule
  }
  