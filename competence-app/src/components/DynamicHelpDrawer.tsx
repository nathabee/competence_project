'use client';

import { usePathname } from 'next/navigation';
import HelpDrawer from './HelpDrawer';
import { Typography, Divider } from '@mui/material';
import GeneralHelpContent from './GeneralHelpContent';
import useTranslation from '@/utils/translationHelper';

// Helper function to normalize pathname
const normalizePathname = (pathname: string): string => {
  return pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;
};

const DynamicHelpDrawer: React.FC = () => {
  const pathname = usePathname();
  const normalizedPathname = normalizePathname(pathname);
  const t  = useTranslation(); // Hook to use translations

  let helpContent: JSX.Element;
  
  switch (normalizedPathname) {
    case '/dashboard':
      helpContent = (
        <div>
          <GeneralHelpContent />
          <Typography variant="h5" className="help-drawer-heading">
            {t('hlp_histo')}
          </Typography>
          <Typography variant="body1" component="p" className="help-drawer-paragraph">
            {t('pgH_histo_description')}
          </Typography>
          <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />
          <Typography variant="h6" className="help-drawer-subheading">
            {t('hlp_refresh_data')}
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            {t('pgH_refresh_data_description')}
          </Typography>
          <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />
          <Typography variant="h6" className="help-drawer-subheading">
            {t('hlp_red_reports')}
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            {t('pgH_red_reports_description')}
          </Typography>
          <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />
          <Typography variant="h6" className="help-drawer-subheading">
            {t('hlp_expand_icon')}
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            {t('pgH_expand_icon_description')}
          </Typography>
        </div>
      );
      break;

    case '/eleve':
      helpContent = (
        <div>
          <GeneralHelpContent />
          <Typography variant="h5" className="help-drawer-heading">
            {t('hlp_studMgmt')}
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            {t('pgH_studMgmt_description')}
          </Typography>
          <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />
          <Typography variant="h6" className="help-drawer-subheading">
            {t('hlp_filter_students')}
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            {t('pgH_filter_students_description')}
          </Typography>
          <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />
          <Typography variant="h6" className="help-drawer-subheading">
            {t('hlp_add_student')}
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            {t('pgH_add_student_description')}
          </Typography>
          <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />
          <Typography variant="h6" className="help-drawer-subheading">
            {t('hlp_select_student')}
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            {t('pgH_select_student_description')}
          </Typography>
        </div>
      );
      break;

    case '/pdf':
    case '/pdfimage':
      helpContent = (
        <div>
          <GeneralHelpContent />
          <Typography variant="h5" className="help-drawer-heading">
            {t('hlp_PDF')}
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            {t('pgH_PDF_description')}
          </Typography>
          <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />
          <Typography variant="h6" className="help-drawer-subheading">
            {t('hlp_print')}
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            {t('pgH_print_description')}
          </Typography>
          <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />
          <Typography variant="h6" className="help-drawer-subheading">
            {t('hlp_report_first_page')}
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            {t('pgH_report_first_page_description')}
          </Typography>
          <Typography variant="h6" className="help-drawer-subheading">
            {t('hlp_report_following_pages')}
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            {t('pgH_report_following_pages_description')}
          </Typography>
        </div>
      );
      break;

    case '/configuration':
      helpContent = (
        <div>
          <GeneralHelpContent />
          <Typography variant="h5" className="help-drawer-heading">
            {t('hlp_confMgmt')}
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            {t('pgH_confMgmt_description')}
          </Typography>
        </div>
      );
      break;

    case '/catalogue':
      helpContent = (
        <div>
          <GeneralHelpContent />
          <Typography variant="h5" className="help-drawer-heading">
            {t('hlp_ctgMgmt')}
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            {t('pgH_ctgMgmt_description')}
          </Typography>
          <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />
          <Typography variant="h6" className="help-drawer-subheading">
            {t('hlp_choose_catalogue')}
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            {t('pgH_choose_catalogue_description')}
          </Typography>
        </div>
      );
      break;

    case '/overview':
      helpContent = (
        <div>
          <GeneralHelpContent />
          <Typography variant="h5" className="help-drawer-heading">
            {t('hlp_overview')}
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            {t('pgH_overview_description')}
          </Typography>
          <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />
          <Typography variant="h6" className="help-drawer-subheading">
            {t('hlp_page_layout')}
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            {t('pgH_page_layout_description')}
          </Typography>
          <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />
          <Typography variant="h6" className="help-drawer-subheading">
            {t('hlp_summary_scores')}
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            {t('pgH_summary_scores_description')}
          </Typography>
          <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />
          <Typography variant="h6" className="help-drawer-subheading">
            {t('hlp_difficulties_summary')}
          </Typography>
          <Typography variant="body2" component="p" className="help-drawer-paragraph">
            {t('pgH_difficulties_summary_description')}
          </Typography>
        </div>
      );
      break;

    case '/test':
      helpContent = (
        <div>
          <GeneralHelpContent />
          <Typography variant="h5" className="help-drawer-heading">
            {t('hlp_rptMgmt')}
          </Typography>
          <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />
          <Typography variant="h6" className="help-drawer-subheading">
            {t('hlp_select_report')}
          </Typography>
          <Typography variant="body1" component="p" className="help-drawer-paragraph">
            {t('pgH_select_report_description')}
          </Typography>
          <Divider sx={{ my: 2, borderColor: 'var(--custom-divider-color)' }} />
          <Typography variant="h6" className="help-drawer-subheading">
            {t('hlp_save_report')}
          </Typography>
          <Typography variant="body1" component="p" className="help-drawer-paragraph">
            {t('pgH_save_report_description')}
          </Typography>
        </div>
      );
      break;


      default:
        //console.log("DynamicHelpDrawer default route:", normalizedPathname);
        helpContent = (
          <div>
            <GeneralHelpContent />
            <Typography variant="h5" className="help-drawer-heading">
            {t('hlp_wellcomeMsg')}
            </Typography>
          </div>
        );
        break;
    }
  
    return <HelpDrawer helpContent={helpContent} />;
  };
  
  export default DynamicHelpDrawer;