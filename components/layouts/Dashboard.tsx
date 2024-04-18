'use client';
import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SideNav from './SideNav';
import Image from 'next/image';
import logo from '../assets/image/logo.png';
import placeholder from '../assets/icons/placeholder.png';
import { useSelector } from 'react-redux';

const drawerWidth = 300;
type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const Dashboard = ({ children }: Props) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const { userData } = useSelector((state: any) => state.auth);
  const [isClient, setIsClient] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
    // @ts-ignore
  };

  const handleDrawerClose = () => {
    setOpen(false);
    // @ts-ignore
  };

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return '';
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        open={open}
        sx={{
          backgroundColor: 'white',
          color: 'black',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />

            <div className="ps-5">
              <Image src={logo} width={150} height={42} alt="" />
            </div>
          </IconButton>

          {open && (
            <div>
              <Image src={logo} width={150} height={42} alt="" />
            </div>
          )}

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              '& .name-text': {
                fontFamily: 'Inter',
                fontSize: '16px',
                fontWeight: 600,
                lineHeight: '19.94px',
                color: '#100324',
              },
              '& .role-text': {
                fontFamily: 'Inter',
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '16.94px',
                color: '#10032480',
              },
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <p className="m-0 name-text">{userData?.fullName}</p>
                <p className="m-0 role-text text-end">{userData?.role}</p>
              </div>
              <div className="ms-3">
                <Image
                  src={
                    userData?.profileImage?.endsWith('profileImage.png')
                      ? placeholder
                      : userData?.profileImage
                  }
                  alt="user"
                  width={42}
                  height={42}
                />
              </div>
            </div>
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <SideNav />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 5, mt: 5 }}>
        {children}
      </Box>
    </Box>
  );
};

export default Dashboard;
