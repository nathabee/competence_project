'use client';
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchBase64Image } from '@shared/utils/helper';
import { getToken, isTokenExpired } from '@shared/utils/jwt';
import defaultTranslation from '@shared/utils/defaultTranslation.json';
const { language_list: initialLanguageList } = defaultTranslation, initialTranslations = __rest(defaultTranslation, ["language_list"]);
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [token, internalSetToken] = useState(null);
    const [user, internalSetUser] = useState(null);
    const [userRoles, internalSetUserRoles] = useState([]);
    const [isLoggedIn, internalSetIsLoggedIn] = useState(false);
    const [activeCatalogues, internalSetActiveCatalogues] = useState([]);
    const [activeEleve, internalSetActiveEleve] = useState(null);
    const [catalogue, internalSetCatalogue] = useState([]);
    const [eleves, internalSetEleves] = useState([]);
    const [scoreRulePoints, internalSetScoreRulePoints] = useState(null);
    const [activeReport, internalSetActiveReport] = useState(null);
    const [activeLayout, internalSetActiveLayout] = useState(null);
    const [layouts, internalSetLayouts] = useState([]);
    const [niveaux, internalSetNiveaux] = useState(null);
    const [languageList, internalSetLanguageList] = useState({});
    const [translations, internalSetTranslations] = useState({});
    const [activeLang, internalSetActiveLang] = useState('en');
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedToken = localStorage.getItem('authToken');
            if (savedToken) {
                internalSetToken(savedToken);
                internalSetIsLoggedIn(true);
                internalSetIsLoggedIn(true);
                const roles = JSON.parse(localStorage.getItem('userRoles') || '[]');
                internalSetUserRoles(roles);
                const savedUser = JSON.parse(localStorage.getItem('userInfo') || 'null');
                internalSetUser(savedUser);
                const savedNiveaux = JSON.parse(localStorage.getItem('niveaux') || '[]');
                internalSetNiveaux(savedNiveaux);
                const savedCatalogues = JSON.parse(localStorage.getItem('activeCatalogues') || '[]');
                const savedEleve = JSON.parse(localStorage.getItem('activeEleve') || 'null');
                const savedReport = JSON.parse(localStorage.getItem('activeReport') || 'null');
                const savedLayout = JSON.parse(localStorage.getItem('activeLayout') || 'null');
                const savedLayouts = JSON.parse(localStorage.getItem('layouts') || '[]');
                internalSetActiveCatalogues(savedCatalogues);
                internalSetActiveEleve(savedEleve);
                internalSetActiveReport(savedReport);
                internalSetActiveLayout(savedLayout);
                internalSetLayouts(savedLayouts);
                const parsedLanguageList = JSON.parse(initialLanguageList.replace(/'/g, '"'));
                internalSetLanguageList(parsedLanguageList);
                internalSetTranslations(initialTranslations);
                //console.log("context end init   languageList",languageList)
                //console.log("context end init   translations",translations)
                //console.log("context end init   activeLang",activeLang)
            }
            else {
                logout();
            }
        }
    }, []);
    // retrieve image whenever new report is active
    useEffect(() => {
        const token = getToken();
        if (token && activeReport) {
            //console.log("authentify ok going to fetch data" );
            const fetchImages = async () => {
                try {
                    await Promise.all(activeReport.report_catalogues.map(async (reportCatalogue) => {
                        await Promise.all(reportCatalogue.resultats.map(async (resultat) => {
                            if (resultat.groupage.groupage_icon_id) {
                                const imageKey = `competence_icon_${resultat.groupage.groupage_icon_id}`;
                                //console.log("call fetchBase64Image with imageKey",imageKey) 
                                await fetchBase64Image(imageKey, resultat.groupage.groupage_icon_id, token);
                            }
                        }));
                    }));
                }
                catch (error) {
                    console.error("Error fetching images:", error);
                }
            };
            fetchImages();
        }
        else if (!token || isTokenExpired(token)) {
            console.error("Token is either missing or expired.");
            // Handle the token expiration logic here
        }
    }, [activeReport]); // Run effect when activeReport changes
    const login = (token, userInfo) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('authToken', token);
            internalSetToken(token);
            internalSetUser(userInfo);
            internalSetUserRoles(userInfo.roles);
            internalSetIsLoggedIn(true);
            if (userInfo.lang !== activeLang) {
                internalSetActiveLang(userInfo.lang || 'en');
            }
            localStorage.setItem('userRoles', JSON.stringify(userInfo.roles));
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
        }
    };
    const logout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            internalSetToken(null);
            internalSetIsLoggedIn(false);
            localStorage.removeItem('userRoles');
            localStorage.removeItem('userInfo');
            localStorage.removeItem('activeCatalogues');
            localStorage.removeItem('activeReport');
            localStorage.removeItem('activeEleve');
            localStorage.removeItem('activeReport');
            localStorage.removeItem('activeLayout');
            localStorage.removeItem('eleves');
            localStorage.removeItem('catalogue');
            localStorage.removeItem('niveaux');
            localStorage.removeItem('layouts');
            localStorage.removeItem('scoreRulePoints');
            internalSetIsLoggedIn(false);
            internalSetUser(null);
            internalSetUserRoles([]);
            internalSetActiveCatalogues([]);
            internalSetActiveEleve(null);
            internalSetActiveReport(null);
            internalSetActiveLayout(null);
            internalSetCatalogue([]);
            internalSetEleves([]);
            internalSetLayouts([]);
            internalSetScoreRulePoints([]);
            // Remove all items from local storage that start with 'competence_'
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('competence_')) {
                    localStorage.removeItem(key);
                }
            });
            localStorage.clear();
        }
    };
    const setToken = (newToken) => {
        internalSetToken(newToken);
        if (typeof window !== 'undefined') {
            if (newToken) {
                localStorage.setItem('authToken', newToken);
            }
            else {
                localStorage.removeItem('authToken');
            }
        }
    };
    const setCatalogue = (newCatalogue) => {
        internalSetCatalogue(newCatalogue);
        if (typeof window !== 'undefined') {
            localStorage.setItem('catalogue', JSON.stringify(newCatalogue));
        }
    };
    const setEleves = (newEleves) => {
        if (typeof newEleves === 'function') {
            internalSetEleves((prevEleves) => newEleves(prevEleves));
        }
        else {
            internalSetEleves(newEleves);
        }
        if (typeof window !== 'undefined') {
            localStorage.setItem('eleves', JSON.stringify(newEleves));
        }
    };
    const setTranslations = (newTranslations) => {
        internalSetTranslations(newTranslations);
        if (typeof window !== 'undefined') {
            localStorage.setItem('translations', JSON.stringify(newTranslations));
        }
        //console.log("newt value of  translations",translations);
    };
    const setActiveLang = (lang = 'en') => {
        if (lang !== activeLang) { // Only set if lang has changed
            internalSetActiveLang(lang);
            if (typeof window !== 'undefined') {
                localStorage.setItem('lang', lang);
            }
        }
    };
    const setLanguageList = (newLanguageLists) => {
        //console.log("old value before internalSetLanguageList ", languageList);
        //console.log("auth context setLanguageList called with ", newLanguageLists);
        internalSetLanguageList(newLanguageLists);
        //console.log("new value after internalSetLanguageList ", languageList);
    };
    const setActiveLayout = (layout) => {
        internalSetActiveLayout(layout);
        if (typeof window !== 'undefined') {
            localStorage.setItem('activeLayout', JSON.stringify(layout));
        }
    };
    const setScoreRulePoints = (points) => {
        internalSetScoreRulePoints(points);
        if (typeof window !== 'undefined') {
            localStorage.setItem('scoreRulePoints', JSON.stringify(points));
        }
    };
    const setActiveReport = (report) => {
        if (report) {
            const updatedReport = Object.assign(Object.assign({}, report), { report_catalogues: report.report_catalogues.map((catalogue) => (Object.assign(Object.assign({}, catalogue), { resultats: catalogue.resultats }))) });
            internalSetActiveReport(updatedReport);
            if (typeof window !== 'undefined') {
                localStorage.setItem('activeReport', JSON.stringify(updatedReport));
            }
        }
        else {
            internalSetActiveReport(null);
            if (typeof window !== 'undefined') {
                localStorage.removeItem('activeReport');
            }
        }
    };
    const setNiveaux = (newNiveaux) => {
        internalSetNiveaux(newNiveaux);
        if (typeof window !== 'undefined') {
            localStorage.setItem('niveaux', JSON.stringify(newNiveaux));
        }
    };
    return (React.createElement(AuthContext.Provider, { value: {
            token,
            setToken,
            user,
            userRoles,
            isLoggedIn,
            login,
            logout,
            activeLang,
            setActiveLang,
            translations,
            setTranslations,
            languageList,
            setLanguageList,
            activeCatalogues,
            setActiveCatalogues: (catalogues) => {
                internalSetActiveCatalogues(catalogues);
                if (typeof window !== 'undefined') {
                    localStorage.setItem('activeCatalogues', JSON.stringify(catalogues));
                }
            },
            activeEleve,
            setActiveEleve: (eleve) => {
                internalSetActiveEleve(eleve);
                setActiveReport(null);
                if (typeof window !== 'undefined') {
                    localStorage.setItem('activeEleve', JSON.stringify(eleve));
                    localStorage.removeItem('activeReport');
                }
            },
            catalogue,
            setCatalogue,
            eleves,
            setEleves,
            scoreRulePoints,
            setScoreRulePoints,
            activeReport,
            setActiveReport,
            activeLayout,
            setActiveLayout,
            layouts,
            setLayouts: (layouts) => {
                internalSetLayouts(layouts);
                if (typeof window !== 'undefined') {
                    localStorage.setItem('layouts', JSON.stringify(layouts));
                }
            },
            niveaux,
            setNiveaux,
        } }, children));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
