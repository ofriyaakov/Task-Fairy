import React, { FC, ReactNode } from 'react';
import { Box } from '@mui/material';
import { Navbar } from '../Navbar/Navbar';
import { TopBar } from '../TopBar/TopBar';

interface PageLayoutProps {
  children: ReactNode;
}

const drawerWidth = 17;

const PageLayout: FC<PageLayoutProps> = ({ children }) => {
  return (
    <Box>
      <Navbar />
      <TopBar />
      <Box component="main" sx={{ flexGrow: 1, px: 3,py:1, ml: `${drawerWidth}%` }}>
        {children}
      </Box>
    </Box>
  );
};

export default PageLayout;
