// src/i18n.ts
'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';


const resources = {
  en: {
    translation: {
      welcome: 'Welcome to our application',
      news: 'News: Multi-language selection english and french added. at the moment just for the student page',
      form: {
        name: 'Last Name',
        firstName: 'First Name',
        level: 'Level',
        birthDate: 'Date of Birth',
        chooseLevel: 'Choose a level',
        professors: 'Professors',
        createStudent: 'Create Student',
        addStudent: 'Add New Student', 
        searchPlaceholder: 'Search by name or first name...', 
      },
      option: {
        all: 'All', 
      },
      tableHeaders: {
        name: 'Last Name',
        firstName: 'First Name',
        level: 'Level',
        birthDate: 'Date of Birth',
        professors: 'Professors',
      },
      messages: {
        required: 'This field is required',
        noInfo: 'No student information available.',
        chosenStudent: 'Chosen student',
        noProfessors: 'No assigned professors',
        loadingStudents: 'Loading student data...', 
        loadError: 'Error loading. Please try again.', 
        selectStudent: 'Please select a student.',  
        noStudent: 'No student found.', 
      },
      pageHeaders: {
        studentManagement: 'Student Management', 
        studentSelection: 'Student Selection', 
      },
      report: {
        selectedStudentReport: 'Reports obtained by selected student: {{name}}', // New, with dynamic name
      },
      niveau: {
        description0: 'Senior Kindergarten',  
        description1: 'Grade 1',  
        description2: 'Grade 2',  
        description3: 'Grade 3',  
        description4: 'Grade 4',  
        description5: 'Grade 5',  
      },
    }
  },
 
 
  fr: {
    translation: {
      welcome: 'Bienvenue dans notre application',
      news: 'Nouveautés : internationalisation francais et anglais. Provisoirement seulement au niveau de la page eleve.',
      form: {
        name: 'Nom',
        firstName: 'Prénom',
        level: 'Niveau',
        birthDate: 'Date de naissance',
        chooseLevel: 'Choisir un niveau',
        professors: 'Professeurs',
        createStudent: 'Créer Élève',
        addStudent: 'Ajouter un nouvel élève', 
        searchPlaceholder: 'Rechercher par nom ou prénom...', 
      },
      option: {
        all: 'Tous', 
      },
      tableHeaders: {
        name: 'Nom',
        firstName: 'Prénom',
        level: 'Niveau',
        birthDate: 'Date de Naissance',
        professors: 'Professeurs',
      },
      messages: {
        required: 'Ce champ est requis',
        noInfo: "Pas d'information sur l'élève disponible.",
        chosenStudent: 'Élève choisi',
        noProfessors: 'Aucun professeur assigné',
        loadingStudents: 'Chargement des données élèves...', 
        loadError: 'Erreur chargement des élèves. Recommencez SVP.', 
        selectStudent: 'Veuillez sélectionner un élève.', 
        noStudent: 'Pas d&apos;élève trouvé.', 
      },
      pageHeaders: {
        studentManagement: 'Gestion des Élèves', 
        studentSelection: 'Sélection des Élèves', 
      },
      report: {
        selectedStudentReport: 'Report obtenus par l’élève sélectionné: {{name}}',  
      },
      niveau: {
        description0: 'Grande Section',  
        description1: 'CP',  
        description2: 'CE1',  
        description3: 'CE2',  
        description4: 'CM1',  
        description5: 'CM2',  
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr',
    fallbackLng: 'fr',
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });

export default i18n;
