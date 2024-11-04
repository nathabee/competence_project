// components/DynamicHelpDrawer.tsx
'use client';

import { usePathname } from 'next/navigation';
import HelpDrawer from './HelpDrawer';
import { Typography, Divider } from '@mui/material';
import GeneralHelpContent from './GeneralHelpContent';

// Helper function to normalize pathname
/*
the URL structure differs slightly because it creates a separate file for each path as a directory. 
This difference results in a trailing slash (/) at the end of the URL for static files by default. 

Why There’s a Trailing Slash in Static Exports
When you use next export to generate a static site, Next.js creates each page as a folder with an index.html 
file inside, which is standard for many static site generators. For example:

/dashboard becomes a directory with an index.html file inside, so the URL for this page ends with 
a / to follow the directory structure (/dashboard/).
If you serve these files, accessing /dashboard (without the trailing slash) may lead to a redirect
 to /dashboard/ since /dashboard is treated as a folder.
However, when you run Next.js in server mode (without next export), it uses clean URLs without trailing 
slashes by default, so you’ll see /dashboard instead of /dashboard/.
*/
const normalizePathname = (pathname: string): string => {
  return pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;
};

const DynamicHelpDrawer: React.FC = () => {
  const pathname = usePathname();
  const normalizedPathname = normalizePathname(pathname);

  let helpContent: JSX.Element;
  //console.log("DynamicHelpDrawer normalizedPathname2", normalizedPathname);
  switch (normalizedPathname) { 
    case '/dashboard':
      helpContent = (
        <div>
          <GeneralHelpContent />

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
          <GeneralHelpContent />
          <Typography variant="h5" className="help-drawer-heading">
            Ceci est la page pour gérer les élèves.
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
             Création ou sélection d&apos;eleve et de rapport.
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
    case '/pdfimage':
      helpContent = (
        <div>
          <GeneralHelpContent />
          <Typography variant="h5" className="help-drawer-heading">
          PDF avec/sans icône
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            Ceci est la page pour visualiser et imprimer les PDF avec/sans icône. Appuyer sur imprimer pour imprimer.
          </Typography>
          <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />
          <Typography variant="h6" className="help-drawer-subheading">
            Imprimer
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            Un fichier PDF sera genere sur le rapport selectionne avec les donnes visualisables a l&apos;ecran.
            Le fichier est un format imprimable standard.
          </Typography>
          <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />
          <Typography variant="h6" className="help-drawer-subheading">
            Contenu de la premiere page du rapport
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            Le rapport contient l&apos;entete avec le logo , la date du test, le nom de l&apos;eleve et de l&apos;enseignant ainsi que son niveau.
            Le graphe araigne est dessigne en fonction des seuils configures par l&apos;Administrateur de l&apos;application. Ces seuils sont modifiables.
            Les labels sont ceux utilises par le catalogue de test. L&apos;administrateur peut aussi les modifier.
            Les logos, Nom utilises en entete et les messages de bas de page sont configurable par l&apos;administrateur</Typography>
          <Typography variant="h6" className="help-drawer-subheading">
            Contenu des pages suivantes rapport
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            Le rapport imprime les test en erreur si ils appartiennent a la loi de selection - a definir -
            Pour l&apos;instant on imprime tous les test tombe a moins de 50% de reussite si ils appartiennet a une categorie en echec
            Cette loi permettant de definir les tests a imprimer sera a ameliorer ulterieurement</Typography>
        </div>
      );
      break;



    case '/configuration':
      helpContent = (
        <div>
          <GeneralHelpContent />
          <Typography variant="h5" className="help-drawer-heading">
            Ceci est la page pour sélectionner la configuration d&apos;impression.
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            Les logos, Nom utilises en entete et les messages de bas de page sont configurable par l&apos;administrateur et sont selectionnes dans cette configuration par l&apos;enseignant
          </Typography>
        </div>
      );
      break;

    case '/catalogue':
      helpContent = (
        <div>
          <GeneralHelpContent />
          <Typography variant="h5" className="help-drawer-heading">
            Ceci est la page pour sélectionner le catalogue.
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            Les types de tests (categorie de tests, avec seuils et tests associes) sont definis dans ce que l&apos;on appelle ici le catalogue de test.
            Ce catalogue est entierement configurable par l&apos;administrateur.
            Il est possible de modifier toutes les donnees definissant les tests : type de test, type de valeurs attendues, valorisation des tests
            Labelles des tests et de categories associes et icones des categories.
          </Typography>
          <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />
          <Typography variant="h6" className="help-drawer-subheading">
            Choix du/des catalogue de test
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            En CP on choisira 2 catalogues ( Francais point repere + Mathematique point repere pour les tests de debut d&apos;annees)
            En Grande Section on choisit un catalogue unique .
            Des filtres ont ete mis en place pour faciliter le choix du catalogue
            L&apos;administrateur restreint les catalogues visibles par professeur dans la console d&apos;administration de facon a ne plus proposer des catalogues perimes ou des niveaux non suivis par l&apos;enseignant</Typography>
        </div>
      );
      break;

    case '/overview':
      helpContent = (
        <div>
          <GeneralHelpContent />
          <Typography variant="h5" className="help-drawer-heading">
            Résumé des tests en cours
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            Ceci est la page pour montrer le bilan du rapport sélectionné.
            Toutes les donnees associees au rapport selectionne sont affichees
            Le rapport a ete cree pour un eleve , par un professeur avec un/des catalogues de tests
            Quand le rapport est cree ceci n&apos;est plus configurable.
            L&apos;adiminstrateur pourrait modifier la configuration dans le panneau d&apos;administration si necessaire
          </Typography>
          <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />
          <Typography variant="h6" className="help-drawer-subheading">
            Mise en page sélectionnée
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            Le rapport contient l&apos;entete avec le logo , la date du test, le nom de l&apos;eleve et de l&apos;enseignant ainsi que son niveau.
            Le graphe araigne est dessigne en fonction des seuils configures par l&apos;Administrateur de l&apos;application. Ces seuils sont modifiables.
            Les labels sont ceux utilises par le catalogue de test. L&apos;administrateur peut aussi les modifier.
            Les logos, Nom utilises en entete et les messages de bas de page sont configurable par l&apos;administrateur
            </Typography>
            <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />
            <Typography variant="h6" className="help-drawer-subheading">
              Résumé des scores
            </Typography>
            <Typography variant="body2" component="p" className="help-drawer-paragraph">
              Resultat des tests aggreges et avec calcul d&apos;avancement en fonction des seuils configures
            </Typography>
            <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />
            <Typography variant="h6" className="help-drawer-subheading">
              Résumé des difficultés
            </Typography>
            <Typography variant="body2" component="p" className="help-drawer-paragraph">          
              Catagorie passes sont un seuil - a definir lors du developpemnt  </Typography>
            <Typography variant="h6" className="help-drawer-subheading">
              Resume des difficultes rencontrees
            </Typography>
            <Typography variant="body2" component="p" className="help-drawer-paragraph">
              Le rapport imprime les test en erreur si ils appartiennent a la loi de selection - a definir -
              Pour l&apos;instant on imprime tous les test tombe a moins de 50% de reussite si ils appartiennet a une categorie en echec
              Cette loi permettant de definir les tests a imprimer sera a ameliorer ulterieurement</Typography>
        </div>
      );
      break;

    case '/test':
      helpContent = (
        <div>
          <GeneralHelpContent />
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
      console.log("DynamicHelpDrawer default route:", normalizedPathname);
      helpContent = (
        <div>
          <GeneralHelpContent />
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
