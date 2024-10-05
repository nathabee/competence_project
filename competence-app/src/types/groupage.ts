// src/types/groupage.ts

import { Catalogue } from './catalogue'; 

export interface GroupageData {
    id: number;
    catalogue: Catalogue;   
    position: number;
    desc_groupage: string;
    label_groupage: string;
    max_point: number;
    seuil1: number;
    seuil2: number;
    max_item: number;
    link: string;
    items: Item[];   
}

export interface Item {
    id: number;
    temps: string;
    description: string;
    observation: string;
    scorerule: number;   
    max_score: number;
    itempos: number;
    link: string; 
}
