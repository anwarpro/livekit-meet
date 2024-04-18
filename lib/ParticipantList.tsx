import React, { Dispatch, SetStateAction, useEffect } from 'react';
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
  console.log(participants);
  useEffect(() => {
    const targetElements = document.getElementsByClassName('lk-participant-tile');
    if (targetElements) {
      for (let i = 0; i < targetElements.length; i++) {
        const targetElement = targetElements[i];
        const nameDiv = targetElement?.querySelector(
          '.lk-participant-metadata .lk-participant-metadata-item .lk-participant-name',
        );
        const nameData = nameDiv?.getAttribute("data-lk-participant-name");
        console.log("name", nameData);
        if (nameData) {
          const name = JSON.parse(nameData)?.name;
          const email = JSON.parse(nameData)?.email;
          if (email !== null) {
            const participantSrc = participants.find((par) => par.identity === email)?.metadata;
            const placeholderDiv = targetElement?.querySelector('.lk-participant-placeholder');
            if (
              placeholderDiv &&
              participantSrc !== '' &&
              !participantSrc?.includes('profileImage')
            ) {
              placeholderDiv.innerHTML = `<img src=${participantSrc} width="320" height="320"/>`;
            }
            const nameDiv = targetElement?.querySelector(
              '.lk-participant-metadata .lk-participant-metadata-item .lk-participant-name',
            )!;
            nameDiv.innerHTML = name;
          } else {
            const nameDiv = targetElement?.querySelector(
              '.lk-participant-metadata .lk-participant-metadata-item .lk-participant-name',
            )!;
            nameDiv.innerHTML = name;
          }
        }
      }
    }
  }, [participants]);
  const DrawerList = (
    <Box
      sx={{
        width: 280,
        '& .participant-title': {
          ml: 2,
          textTransform: 'capitalize',
          fontSize: '20px',
          fontWeight: '600',
          mt: 2,
          borderBottom: '1px solid #1003240D',
          pb: 2,
        },
      }}
      role="presentation"
    >
      <p className="participant-title">total participants : {participants.length}</p>
      <List>
        {participants?.map((p, index) => {
          let name = p.name;
          if(name?.startsWith("{")) {
            name = JSON.parse(name)?.name;
          }
          return (<ListItem key={p.identity} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary={name !== '' ? name : p.identity} />
            </ListItemButton>
          </ListItem>)
        })}
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
