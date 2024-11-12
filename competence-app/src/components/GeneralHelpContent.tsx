'use client';

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
                    background: 'var(--custom-gradient)',
                    color: 'var(--custom-text)',
                    boxShadow: 'none',
                    borderRadius: '5px',
                    '&.Mui-expanded': {
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    },
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="general-help-content"
                    id="general-help-content-header"
                    sx={{
                        background: 'var(--custom-gradient)',
                        borderRadius: '5px',
                    }}
                >
                    <Typography variant="h6">{t('hlp_globalHelp')}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body1" component="p" className="help-drawer-paragraph">
                        {t('hlp_introDescription')}
                    </Typography>

                    <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />

                    <Typography variant="h6" className="help-drawer-subheading">
                        {t('hlp_accessMenu')}
                    </Typography>
                    <Typography variant="body1" component="p" className="help-drawer-paragraph">
                        {t('hlp_accessMenuDesc')}
                    </Typography>

                    <Typography variant="h6" className="help-drawer-subheading">
                        {t('hlp_statusBar')}
                    </Typography>
                    <Typography variant="body1" component="p" className="help-drawer-paragraph">
                        {t('hlp_statusBarDesc')}
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />

            <Accordion
                sx={{
                    background: 'var(--custom-gradient)',
                    color: 'var(--custom-text)',
                    boxShadow: 'none',
                    borderRadius: '5px',
                    '&.Mui-expanded': {
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    },
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="general-help-content"
                    id="general-help-content-header"
                    sx={{
                        background: 'var(--custom-gradient)',
                        borderRadius: '5px',
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            animation: 'pulsate 1.5s ease-in-out infinite',
                            '@keyframes pulsate': {
                                '0%': {
                                    opacity: 1,
                                    transform: 'scale(1)',
                                    backgroundColor: 'yellow',
                                },
                                '50%': {
                                    opacity: 0.8,
                                    transform: 'scale(1.05)',
                                    backgroundColor: 'yellow',
                                },
                                '100%': {
                                    opacity: 1,
                                    transform: 'scale(1)',
                                    backgroundColor: 'yellow',
                                },
                            },
                            padding: '0.2rem',
                            borderRadius: '5px',
                            color: 'black',
                            display: 'inline-block',
                        }}
                    >
                        {t('hlp_news')}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body1" component="p" className="help-drawer-paragraph">
                        {t('hlp_newsDesc')}
                    </Typography>
                </AccordionDetails>
            </Accordion>
            <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />
        </>
    );
};

export default GeneralHelpContent;
