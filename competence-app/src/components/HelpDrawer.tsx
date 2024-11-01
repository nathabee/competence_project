import { useState } from 'react';
import { Drawer, Button, Typography } from '@mui/material';

interface HelpDrawerProps {
  helpContent: JSX.Element; // Changing type to JSX.Element to support structured content
}

const HelpDrawer: React.FC<HelpDrawerProps> = ({ helpContent }) => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setOpen(open);
  };

  return (
    <>
      <Button variant="contained" onClick={toggleDrawer(true)}>
        Besoin d&apos;aide ?
      </Button>
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: '33vw',                    // Set drawer width to 33% of the viewport
            background: 'var(--custom-gradient)', // Custom gradient background
            color: 'var(--custom-text)',       // Text color for better contrast
            padding: '1rem',                   // Padding around content
            borderRadius: '0 5px 5px 0',       // Rounded right edges for a stylish look
            transition: 'box-shadow 0.3s ease', // Smooth shadow transition on hover
          },
        }}
        
      >
        <div className="drawer-content">
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Bienvenue dans la section d&apos;aide
          </Typography>

          {/* Render structured helpContent with Typography elements */}
          {helpContent}

          <Button onClick={toggleDrawer(false)}>Fermer</Button>
        </div>
      </Drawer>
    </>
  );
};

export default HelpDrawer;
