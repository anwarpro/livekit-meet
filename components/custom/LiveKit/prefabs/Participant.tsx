import * as React from 'react';
import { ChatCloseIcon, MicDisabledIcon } from '../assets/icons';
import { useMaybeRoomContext, useParticipants } from '@livekit/components-react';

import { ParticipantToggle } from '../controls/ParticipantToggle';
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import handRiseIcon from '../assets/icons/hand-rise.svg';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import MicOffIcon from '@mui/icons-material/MicOff';
import meetService from '../../../../service/meet/meetService';
import CustomToastAlert from '../../CustomToastAlert';
import SettingsVoiceIcon from '@mui/icons-material/SettingsVoice';
import { useRouter } from 'next/router';
import { Track } from 'livekit-client';
import { getSourceIcon } from '../assets/icons/util';

export function Participant({ ...props }) {
  const Router = useRouter();
  const { name: roomName } = Router.query as { name: string };
  const participants = useParticipants();
  const { handRaised } = useSelector((state: any) => state.handRaise);
  participants.sort((a: any, b: any) => {
    const aBool = handRaised?.some((hData: any) => hData?.email === a.identity);
    const bBool = handRaised?.some((hData: any) => hData?.email === b.identity);
    const aData = handRaised?.find((hData: any) => hData?.email === a.identity);
    const bData = handRaised?.find((hData: any) => hData?.email === b.identity);
    if (handRaised && aBool > bBool) {
      return -1;
    } else if (handRaised && aBool < bBool) {
      return 1;
    } else {
      return new Date(aData?.createdAt).getTime() - new Date(bData?.createdAt).getTime();
    }
  });

  const { userData } = useSelector((state: any) => state.auth);
  const room = useMaybeRoomContext();
  const [openSuccessToast, setIsOpenSuccessToast] = React.useState<boolean>(false);
  const [openErrorToast, setIsOpenErrorToast] = React.useState<boolean>(false);
  const [singleParticipantMute, setSingleParticipantMute] = React.useState<{
    identity: string;
  }>();

  const handleMuteParticipant = () => {
    setSingleParticipantMute({ identity: '' });
    const filteredParticipant = (participants || [])
      .map((pr) => pr.identity)
      .filter((identity) => identity !== userData.email);

    meetService
      .muteParticipant(room?.name || '', filteredParticipant)
      .then((res: any) => {
        setIsOpenSuccessToast(true);
      })
      .catch((err: any) => {
        setIsOpenErrorToast(true);
      });
  };

  const handleMuteSpacificParticipant = (p: any) => {
    meetService
      .muteParticipant(roomName, [p.identity])
      .then((res: any) => {
        setSingleParticipantMute({ identity: p.identity });
        setIsOpenSuccessToast(true);
      })
      .catch((err: any) => {
        console.log('single participant mute', err);
      });
  };

  return (
    <div {...props} className="lk-chat participant-modal">
      <div className="lk-chat-header d-flex justify-content-between align-items-center border-bottom border-dark border-2">
        <p className="participant-title m-0">Total Participants {participants.length}</p>
        {userData?.role === 'admin' && (
          <IconButton
            className="lk-button"
            sx={{ mr: 9 }}
            size="large"
            onClick={() => handleMuteParticipant()}
            title="Mute all "
          >
            <MicOffIcon style={{ fontSize: '1.3rem', color: '#fff' }} />
          </IconButton>
        )}

        <ParticipantToggle className="lk-close-button">
          <ChatCloseIcon />
        </ParticipantToggle>
      </div>
      <List style={{ overflow: 'auto' }}>
        {participants?.map((p, index) => {
          return (
            <ListItem key={p.identity}>
              {/* <ListItemButton> */}
              <ListItemIcon>
                <PersonIcon sx={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary={p.name} />
              {/* @ts-ignore */}
              {handRaised?.some((hData: any) => hData?.email === p.identity) && (
                <Image src={handRiseIcon} height="24" width="24" alt="" />
              )}
              {p.isSpeaking && (
                <IconButton sx={{ ml: 1, color: 'white' }} size="small">
                  <SettingsVoiceIcon onClick={() => handleMuteSpacificParticipant(p)} />
                </IconButton>
              )}
              {/* {Track.Source.Microphone && JSON.parse(localStorage.getItem('track')!) ? <MicDisabledIcon /> : ''} */}
              {/* </ListItemButton> */}
            </ListItem>
          );
        })}
      </List>
      {openSuccessToast && (
        <CustomToastAlert
          open={openSuccessToast}
          setOpen={setIsOpenSuccessToast}
          status="success"
          message={
            singleParticipantMute?.identity
              ? `${singleParticipantMute.identity} is muted`
              : 'All Participants Have Been Muted'
          }
          duration={2000}
          vertical="top"
        />
      )}
      {openErrorToast && (
        <CustomToastAlert
          open={openErrorToast}
          setOpen={setIsOpenErrorToast}
          status="error"
          message="Failed To Mute"
          duration={2000}
          vertical="top"
        />
      )}
    </div>
  );
}
