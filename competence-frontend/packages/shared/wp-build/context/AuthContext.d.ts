import React from 'react';
import { Catalogue, Report, ScoreRulePoint } from '@shared/types/report';
import { PDFLayout } from '@shared/types/pdf';
import { Eleve, Niveau } from '@shared/types/eleve';
import { User } from '@shared/types/user';
type Translations = {
    [key: string]: string;
};
type LanguageList = {
    [key: string]: string;
};
interface AuthContextType {
    token: string | null;
    setToken: (token: string | null) => void;
    user: User | null;
    userRoles: string[];
    isLoggedIn: boolean;
    login: (token: string, userInfo: User) => void;
    logout: () => void;
    activeLang: string;
    setActiveLang: (lang: string) => void;
    translations: Translations;
    setTranslations: (translations: Translations) => void;
    languageList: LanguageList;
    setLanguageList: (languageList: LanguageList) => void;
    activeCatalogues: Catalogue[];
    setActiveCatalogues: (catalogues: Catalogue[]) => void;
    activeEleve: Eleve | null;
    setActiveEleve: (eleve: Eleve | null) => void;
    activeReport: Report | null;
    setActiveReport: (report: Report | null) => void;
    activeLayout: PDFLayout | null;
    setActiveLayout: (layout: PDFLayout | null) => void;
    catalogue: Catalogue[];
    setCatalogue: (catalogue: Catalogue[]) => void;
    eleves: Eleve[];
    setEleves: React.Dispatch<React.SetStateAction<Eleve[]>>;
    layouts: PDFLayout[];
    setLayouts: (layouts: PDFLayout[]) => void;
    scoreRulePoints: ScoreRulePoint[] | null;
    setScoreRulePoints: (points: ScoreRulePoint[]) => void;
    niveaux: Niveau[] | null;
    setNiveaux: (niveaux: Niveau[]) => void;
}
export declare const AuthProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useAuth: () => AuthContextType;
export {};
