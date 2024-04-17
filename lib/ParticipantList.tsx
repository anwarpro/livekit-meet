import React, { Dispatch, SetStateAction } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PersonIcon from '@mui/icons-material/Person';
import { useParticipants } from '@livekit/components-react';

type IProps = {
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
};
export default function ParticipantList({ open, setOpen }: IProps) {
  const participants = useParticipants();
  const DrawerList = (
    <Box sx={{ width: 280}} role="presentation">
      <List>
        {participants?.map((p, index) => (
          <ListItem key={p.identity} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary={p.name !== '' ? p.name : p.identity} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <Drawer open={open} anchor={'right'} BackdropProps={{ invisible: true }}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
