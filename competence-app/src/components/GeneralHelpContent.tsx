import React from 'react';
import { Typography, Divider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import '../app/globals.css'; 
import useTranslation from '@/utils/translationHelper';

const GeneralHelpContent = () => {
    const t  = useTranslation(); // Hook to use translations
    return (
        <>
            <Accordion
                sx={{
                    background: 'var(--custom-gradient)', // Custom gradient background
                    color: 'var(--custom-text)',          // Custom text color
                    boxShadow: 'none',                    // Remove the default shadow if needed
                    borderRadius: '5px',                  // Custom border radius
                    '&.Mui-expanded': {                   // Styles when the accordion is expanded
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    },
                }}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="general-help-content"
                    id="general-help-content-header"
                    sx={{
                        background: 'var(--custom-gradient)', // Apply gradient to the summary as well
                        borderRadius: '5px',
                    }}
                >
                    <Typography variant="h6" >Aide globale</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body1" component="p" className="help-drawer-paragraph">
                        L&apos;application d&apos;evaluation permet la saisie des resultats des tests d&apos;evaluation et la creation des rapports associes.
                        Les rapports peuvent etre sauvegardes sous format PDF de facon a etre imprimes par besoin.
                        Ces rapports contiennent les informations eleves, enseignant, graphes de type araignees et resultats des tests problematiques.
                    </Typography>

                    <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />

                    <Typography variant="h6" className="help-drawer-subheading">
                        Acces au Menu
                    </Typography>
                    <Typography variant="body1" component="p" className="help-drawer-paragraph">
                        Le menu se resorbe, il est possible de le recuperer en appuyant sur l&apos;icone en haut a gauche.
                    </Typography>

                    <Typography variant="h6" className="help-drawer-subheading">
                        Barre de statut
                    </Typography>
                    <Typography variant="body1" component="p" className="help-drawer-paragraph">
                        Cette barre superieure affiche le statut des actions en cours (eleve, catalogue, configuration ou rapport selectionnes).
                        Sur la barre superieure des actions s&apos;affichent en jaune pour indiquer ce qu&apos;il reste a faire avant l&apos;impression du rapport.
                        Par exemple si aucun eleve n&apos;est selectionne, l&apos;action de choisir un eleve sera proposee en jaune sur cette barre.
                        Il est aussi possible de naviguer la la page de gestion des elevs par le menu egalement.
                    </Typography>

                </AccordionDetails>
            </Accordion>
            <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />


            <Accordion
                sx={{
                    background: 'var(--custom-gradient)', // Custom gradient background
                    color: 'var(--custom-text)',          // Custom text color
                    boxShadow: 'none',                    // Remove the default shadow if needed
                    borderRadius: '5px',                  // Custom border radius
                    '&.Mui-expanded': {                   // Styles when the accordion is expanded
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    },
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="general-help-content"
                    id="general-help-content-header"
                    sx={{
                        background: 'var(--custom-gradient)', // Apply gradient to the summary as well
                        borderRadius: '5px',
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            animation: 'pulsate 1.5s ease-in-out infinite', // Apply pulsate animation
                            '@keyframes pulsate': {
                                '0%': {
                                    opacity: 1,
                                    transform: 'scale(1)',
                                    backgroundColor: 'yellow', // Highlight in yellow at the start
                                },
                                '50%': {
                                    opacity: 0.8,
                                    transform: 'scale(1.05)',
                                    backgroundColor: 'yellow', // Keep yellow highlight at the midpoint
                                },
                                '100%': {
                                    opacity: 1,
                                    transform: 'scale(1)',
                                    backgroundColor: 'yellow', // Ensure the highlight stays until the end
                                },
                            },
                            padding: '0.2rem', // Small padding for better visual effect
                            borderRadius: '5px', // Round the corners of the highlight
                            color: 'black', // Keep text color black or adjust as needed
                            display: 'inline-block', // Ensures the background color wraps only around the text
                        }}
                    >
                        Nouveaute
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body1" component="p" className="help-drawer-paragraph">

                        {t('news')}
                    </Typography>

                </AccordionDetails>
            </Accordion>
            <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />

        </>
    );
};

export default GeneralHelpContent;
