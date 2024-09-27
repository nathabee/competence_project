// src/types/groupage.ts

import { Catalogue } from './catalogue';
import { ScoreRule } from './score';


export interface GroupageData {
    id: number;
    catalogue: Catalogue; // Adjust based on your actual structure
    position: number ;
    desc_groupage:   string ;
    label_groupage:  string ;
    max_point: number ;
    seuil1: number ;
    seuil2:  number ;
    max_item: number ;
    link: string;
}

 
 
export interface Item {
    id: number;
    groupagedata: GroupageData; // Adjust based on your actual structure
    temps: string ;
    description:   string ;
    observation:  string ;
    max_point: number ;
    scorerule: ScoreRule ;
    max_score:  number ;
    itempos: number ;
    link: string; 
}

 
 