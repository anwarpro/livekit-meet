import React, { ReactElement } from 'react';
import Footer from './Footer';
import { Grid, Paper, styled } from '@mui/material';
import SideNav from './SideNav';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useAppSelector } from '../../types/common';
import RootLayout from './RootLayout';
import Header from './Header';

const Item = styled(Paper)(({ theme }) => ({
  // backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#1A2027',
  // ...theme.typography.body2,
  padding: theme.spacing(1),
  // color: '#fff',
  height: '100vh',
}));

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const DashboardLayout = ({ children }: Props) => {
  return (
    <div className="container-fluid">
      {/* <Header /> */}
      <Grid container spacing={1}>
        <Grid item xs={2}>
          <SideNav />
        </Grid>
        <Grid item xs={10}>
          {children}
        </Grid>
      </Grid>
      {/* <Footer /> */}
    </div>
  );
};

export default DashboardLayout;
