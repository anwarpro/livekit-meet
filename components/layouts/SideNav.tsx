import React from 'react';
import {
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  styled,
} from '@mui/material';

import GridViewIcon from '@mui/icons-material/GridView';
import PeopleIcon from '@mui/icons-material/People';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <GridViewIcon />,
  },
  {
    title: 'User Management',
    href: '/dashboard/user',
    icon: <PeopleIcon />,
  },
  {
    title: 'Schedule Management',
    href: '/dashboard/schedule',
    icon: <WatchLaterIcon />,
  },
  {
    title: 'Others',
    href: '/dashboard/others',
    icon: <AccountBalanceIcon />,
  },
];

const SideNav = () => {
  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {navItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton href={item.href}>
              <ListItemIcon>{item.icon}</ListItemIcon>
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
