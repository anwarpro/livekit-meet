import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import PeopleIcon from '@mui/icons-material/People';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import { useRouter } from 'next/router';
import graphIcon from '../assets/icons/graph.png';
import UserIcon from '../assets/icons/user.png';
import shoppingCartIcon from '../assets/icons/shopping-cart.png';
import googleMeet from '../assets/icons/google-meet.png';
import recordingIcon from '../assets/icons/recording.png';
import serverIcon from '../assets/icons/maintenance.png';
import Image from 'next/image';

const navItems = [
  // {
  //   title: 'Dashboard',
  //   href: '/dashboard',
  //   icon: graphIcon,
  // },
  {
    title: 'Account',
    href: '/dashboard/user',
    icon: graphIcon,
  },
  {
    title: 'Instant Meet',
    href: '/dashboard/instant-meet',
    icon: googleMeet,
  },
  {
    title: 'Schedule Management',
    href: '/dashboard/schedule',
    icon: UserIcon,
  },
  {
    title: 'Schedule Reports',
    href: '/dashboard/report',
    icon: shoppingCartIcon,
  },
  {
    title: 'Recording',
    href: '/dashboard/recording',
    icon: recordingIcon,
  },
  {
    title: 'Server Manage',
    href: '/dashboard/manage-server',
    icon: serverIcon,
  },
];

const SideNav = () => {
  const { pathname } = useRouter();
  const DrawerList = (
    <Box
      role="presentation"
      sx={{
        '& .active-item': {
          color: '#100324',
          background: '#10032408',
          borderRadius: '56px',
          '& .MuiTypography-root': {
            fontFamily: 'Inter',
            fontSize: '16px',
            fontWeight: 700,
          },
        },
        '& .item': {
          color: '#100324B2',
          '& .MuiTypography-root': {
            fontFamily: 'Inter',
            fontSize: '16px',
            fontWeight: 400,
          },
        },
      }}
    >
      <List>
        {navItems.map((item, index) => (
          <ListItem
            key={index}
            disablePadding
            sx={{
              padding: '5px 19px',
            }}
          >
            <ListItemButton
              href={item.href}
              className={`${pathname === item.href ? 'active-item' : 'item'} `}
              sx={{
                '&:hover': {
                  borderRadius: '56px',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 'unset', pr: 2 }}>
                <Image src={item.icon} width={20} height={20} alt="navIcon" />
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  return <div>{DrawerList}</div>;
};

export default SideNav;
