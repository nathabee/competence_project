// components/DynamicHelpDrawer.tsx
'use client';

import { usePathname } from 'next/navigation';
import HelpDrawer from './HelpDrawer';

const DynamicHelpDrawer: React.FC = () => {
  const pathname = usePathname();
  let helpContent = '';

  switch (pathname) {
    case '/dashboard':
      helpContent = "Ceci est la page d&apos;historique de tests.";
      break;
    case '/eleve':
      helpContent = "Ceci est la page pour gerer les eleves. creation ou selection.";
      break;
    case '/pdf':
        helpContent = "Ceci est la page pour visualiser et imprimer les PDF sans icone. Appuyer sur imprimer pour imprimer";
        break;
    case '/pdfimage':
        helpContent = "Ceci est la page pour visualiser et imprimer les PDF avec icone. Appuyer sur imprimer pour imprimer";
        break;
    case '/configuration':
        helpContent = "Ceci est la page pour selectionner la configuration d'impression.";
        break;
    case '/catalogue':
        helpContent = "Ceci est la page pour selectionner le catalogue.";
        break;
    case '/overview':
        helpContent = "Ceci est la page pour montrer le bilan du rapport selectionne";
        break;
    case '/test':
        helpContent = "Ceci est la page pour gerer les rapports : selectionner un rapport existant pour le retravailler ou pour le reimprimer. ou creer un nouveau rapport";
        break;
    // Add more cases as needed
    default:
      helpContent = "Bienvenue! Utilisez la navigation pour explorer l&apos;application.";
      break;
  }

  return <HelpDrawer helpContent={helpContent} />;
};

export default DynamicHelpDrawer;
