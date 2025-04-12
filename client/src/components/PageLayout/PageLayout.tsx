import React, { FC, ReactNode } from 'react';
import { Box } from '@mui/material';
import { Navbar } from '../Navbar/Navbar';

interface PageLayoutProps {
  children: ReactNode;
}

const drawerWidth = 240;

const PageLayout: FC<PageLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px` }}>
        {children}
      </Box>
    </Box>
  );
};

export default PageLayout;
