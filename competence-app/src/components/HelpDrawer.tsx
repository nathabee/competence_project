// components/HelpDrawer.tsx
import { useState } from 'react';
import { Drawer, Button, Typography } from '@mui/material';

interface HelpDrawerProps {
  helpContent: string;
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
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        <div style={{ width: '300px', padding: '1rem' }}>
          <Typography variant="h6">Section d&apos;aide</Typography>
          <Typography variant="body1">{helpContent}</Typography>
          <Button onClick={toggleDrawer(false)}>Fermer</Button>
        </div>
      </Drawer>
    </>
  );
};

export default HelpDrawer;
