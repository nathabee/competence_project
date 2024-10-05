 // src/types/score.ts

// rule associated to an item
// some item never give point
// some item become 0 point with NA, 1 with A...etc

export interface ScoreRule {
    id: number; 
    description: string ; 
}

 
// for a given rule , hier are the choice se have "resulat"  , and the score you get for this rule and thie resultat
export interface ScoreRulePoint {
    id: number; 
    scorerule: number; // Add this field if it's an ID reference
    scorelabel: string ; 
    score: number ; 
    description: string ; 
}

 
 