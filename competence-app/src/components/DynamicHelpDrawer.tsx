// components/DynamicHelpDrawer.tsx
'use client';

import { usePathname } from 'next/navigation';
import HelpDrawer from './HelpDrawer';
import { Typography , Divider } from '@mui/material';
import GeneralHelpContent from './GeneralHelpContent';

const DynamicHelpDrawer: React.FC = () => {
  const pathname = usePathname();
  let helpContent: JSX.Element;  // Declared only once outside the switch

    

  switch (pathname) {
    case '/dashboard':
      helpContent = (
        <div> 
          <GeneralHelpContent/>
          
          <Typography variant="h5" className="help-drawer-heading">
            Page d&apos;historique de tests.
          </Typography>
          <Typography variant="body1" component="p" className="help-drawer-paragraph">
            Cette page permet de visualiser l&apos;historique des rapports et de voir en rouge les rapports incomplets.
            Pour commencer, selectionner un eleve dans le menu eleve,            
          </Typography>
          <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />
          <Typography variant="h6" className="help-drawer-subheading">
            Rafraichir les donnees
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            Si des rapports ne s&apos;affichent pas tous, il est possible de rafraichir pour actualiser les rapports affiches.
          </Typography>
          <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />
          <Typography variant="h6" className="help-drawer-subheading">
            Rapport en rouge
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            Les rapports affiches en rouge necessite d&apos;etre edites a nouveau : il manque des donnees de tests. Dans ce cas, choisir dans le menu en haut a gauche.
          </Typography>
          <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />
          <Typography variant="h6" className="help-drawer-subheading">
             Icône d&apos;agrandissement &lsquo;▲&lsquo; :&lsquo;▼&lsquo;
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            Pour afficher le bilan d&apos;avancement des tests par categorie, il est possible de cliquer sur  &lsquo;▲&lsquo; (icône d&apos;agrandissement) 
            Pour ne plus les afficher, utiliser &lsquo;▼&lsquo; (icône de minimisation).
          </Typography>
        </div>
      );
      break;

    case '/eleve':
      helpContent = (
        <div>
          <GeneralHelpContent/>
          <Typography variant="h5" className="help-drawer-heading">
            Ceci est la page pour gérer les élèves. Création ou sélection d&apos;eleve et de rapport.
          </Typography>
          <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />
          <Typography variant="h6" className="help-drawer-subheading">
             Filtrer les eleves
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            Il est possible de faire une recherche par nom ou prenom d&apos;eleve, et aussi de filtrer par niveau.
          </Typography>
          <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />
          <Typography variant="h6" className="help-drawer-subheading">
             Ajouter un eleve
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            Si l&apos;eleve n&apos;existe pas encore dans la base de donnee, il est possible de le creer.
          </Typography>
          <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />
          <Typography variant="h6" className="help-drawer-subheading">
             Selectionner un eleve
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            l&apos;eleve selectionne sera affiche d&apos;une couleur differente. On ne peut que selectionner un seul eleve a la fois.
            Cet eleve sera utilise pour editer ou creer de nouveau rapport d&apos;evaluation.
            Toute selection d&apos;eleve entraine l&apos;affichage en bas de page des rapport deja existant de l&apos;eleve.
            Si aucun rapport n&apos;existe, aucun rapport ne sera affiche (verifier que le bouton &rdquo;montrer&rdquo; n&apos;pasvisible si le rapport attendu n&apos;apparait pas)
            Si un rapport apparait, il est possible de le selectionner &rdquo;selectionner ce rapport&rdquo; . 
          </Typography>
          <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />
          <Typography variant="h6" className="help-drawer-subheading">
            Selectionner un rapport
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            La selection d&apos;un rapport existant apres avoir choisi un eleve entraine la mise a jour de la configuration et des catalogues de tests.
            Ils viendront s&apos;aligner avec le rapport choisi</Typography>
        </div> 
      );
      break;

    case '/pdf':
      helpContent = (
        <div>
          <GeneralHelpContent/>
          <Typography variant="h5" className="help-drawer-heading">
            Ceci est la page pour visualiser et imprimer les PDF sans icône. Appuyer sur imprimer pour imprimer.
          </Typography>
        </div>
      );
      break;

    case '/pdfimage':
      helpContent = (
        <div>
          <GeneralHelpContent/>
          <Typography variant="h5" className="help-drawer-heading">
            Ceci est la page pour visualiser et imprimer les PDF avec icône. Appuyer sur imprimer pour imprimer.
          </Typography>
        </div>
      );
      break;

    case '/configuration':
      helpContent = (
        <div>
          <GeneralHelpContent/>
          <Typography variant="h5" className="help-drawer-heading">
            Ceci est la page pour sélectionner la configuration d&apos;impression.
          </Typography>
        </div>
      );
      break;

    case '/catalogue':
      helpContent = (
        <div>
          <GeneralHelpContent/>
          <Typography variant="h5" className="help-drawer-heading">
            Ceci est la page pour sélectionner le catalogue.
          </Typography>
        </div>
      );
      break;

    case '/overview':
      helpContent = (
        <div>
          <GeneralHelpContent/>
          <Typography variant="h5" className="help-drawer-heading">
            Ceci est la page pour montrer le bilan du rapport sélectionné.
          </Typography>
        </div>
      );
      break;

    case '/test':
      helpContent = (
        <div>
          <GeneralHelpContent/>
          <Typography variant="h5" className="help-drawer-heading">
            Ceci est la page pour gérer les rapports.
          </Typography>

          <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />
          <Typography variant="h6" className="help-drawer-subheading">
            Selectionner ce Rapport 
          </Typography>

          <Typography variant="body1" component="p" className="help-drawer-paragraph">
            Sélectionner un rapport existant pour le retravailler ou pour le réimprimer, ou créer un nouveau rapport.
            Si vous avez deja selectionne un rapport cette etape est facultative.
          </Typography>
 
          <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />
          <Typography variant="h6" className="help-drawer-subheading">
             Creation nouveau rapport.
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            Ceci initialise un rapport avec le catalogue de test choisi et la configuration utliser pour l&apos;impression ulterieure
e            Les choix de l&apos;eleve, du catalogue de test ou de la configuration ont ete realises precedemment
          </Typography>
          <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />
          <Typography variant="h6" className="help-drawer-subheading">
             Sauvegarde du rapport
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            Le rapport en cours d&apos;edition sera sauve. Apres sauvegarde si des tests sont incomplets leur categorie sera mise en jaune.
          </Typography>

        </div>
      );
      break;

    default:
      helpContent = (
        <div>
          <GeneralHelpContent/>
          <Typography variant="h5" className="help-drawer-heading">
            Bienvenue! Utilisez la navigation pour explorer l&apos;application.
          </Typography>
        </div>
      );
      break;
  }

  return <HelpDrawer helpContent={helpContent} />;
};

export default DynamicHelpDrawer;
