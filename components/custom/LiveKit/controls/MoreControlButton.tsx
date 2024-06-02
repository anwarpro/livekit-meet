import React from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Popover, Typography, useMediaQuery } from '@mui/material';
import { ChatIcon, GearIcon } from '../assets/icons';
import { SettingsMenuToggle } from './SettingsMenuToggle';
import { ChatToggle } from './ChatToggle';
import { ParticipantToggle } from './ParticipantToggle';
import ParticipantsIcon from '../assets/icons/ParticipantsIcon';
import { HostControlToggle } from './HostControlToggle';
import ControlCameraIcon from '@mui/icons-material/ControlCamera';

const MoreControlButton = ({ showText, showIcon }: any) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const isSmDevice = useMediaQuery(`(max-width:492px)`);

  return (
    <>
      <button className="lk-button" onClick={handleClick}>
        {/* <IconButton aria-label="delete"> */}
        <MoreVertIcon />
        {/* </IconButton> */}
      </button>

      <Popover
        sx={{
          '& .MuiPopover-paper': {
            background: '#1e1e1e',
          },
          '& .MuiPaper-root': {},
        }}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'start',
            alignItems: 'start',
            py: 2,
            mx: 2,
            color: 'white',
          }}
        >
          {isSmDevice && (
            <ParticipantToggle className="w-100 d-flex justify-content-start">
              <ParticipantsIcon />
              Participant
            </ParticipantToggle>
          )}
          {/* {isSmDevice && (
            <ChatToggle className="w-100 d-flex justify-content-start">
              <ChatIcon />
              Chat
            </ChatToggle>
          )} */}
          <SettingsMenuToggle className="w-100 d-flex justify-content-start">
            <GearIcon />
            Settings
          </SettingsMenuToggle>
          <HostControlToggle className=" w-100 d-flex justify-content-between">
            <ControlCameraIcon />
            Host Control
          </HostControlToggle>
        </Box>
      </Popover>
    </>
  );
};

export default MoreControlButton;
