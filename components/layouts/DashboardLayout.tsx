import React, { ReactElement } from 'react';
import Footer from './Footer';
import { Grid, Paper, styled } from '@mui/material';
import SideNav from './SideNav';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useAppSelector } from '../../types/common';
import RootLayout from './RootLayout';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#1A2027',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  //   textAlign: 'center',
  color: '#fff',
  height: '100vh',
}));

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const DashboardLayout = ({ children }: Props) => {
  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={2}>
          <Item>
            <SideNav />
          </Item>
        </Grid>
        <Grid item xs={10}>
          <Item>{children}</Item>
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default DashboardLayout;
