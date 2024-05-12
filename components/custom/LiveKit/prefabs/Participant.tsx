import * as React from 'react';
import type { ChatMessage, ChatOptions } from '@livekit/components-core';
import { ChatCloseIcon } from '../assets/icons';
import { MessageFormatter, useParticipants } from '@livekit/components-react';

import { ParticipantToggle } from '../controls/ParticipantToggle';
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { PersonPinCircleOutlined } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import participantIcon from '../../../assets/icons/user-clone.svg';
import BackHandIcon from '@mui/icons-material/BackHand';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import MicOffIcon from '@mui/icons-material/MicOff';
import meetService from '../../../../service/meet/meetService';

/** @public */
export interface ChatProps extends React.HTMLAttributes<HTMLDivElement>, ChatOptions {
  messageFormatter?: MessageFormatter;
}

/**
 * The Chat component adds a basis chat functionality to the LiveKit room. The messages are distributed to all participants
 * in the room. Only users who are in the room at the time of dispatch will receive the message.
 *
 * @example
 * ```tsx
 * <LiveKitRoom>
 *   <Chat />
 * </LiveKitRoom>
 * ```
 * @public
 */
export function Participant({
  messageFormatter,
  messageDecoder,
  messageEncoder,
  channelTopic,
  ...props
}: ChatProps) {
  const participants = useParticipants();
  const { handRaised } = useSelector((state: any) => state.handRaise);
  const { userData } = useSelector((state: any) => state.auth);

  const handleMuteParticipant = () => {
    const filteredParticipant = (participants || [])
      .map((pr) => pr.identity)
      .filter((identity) => identity !== userData.email);
    console.log('🚀 ~ handleMuteParticipant ~ filterAdmin:', filteredParticipant);

    // meetService
    //   .muteParticipant(roomName, identity)
    //   .then((res: any) => {
    //     console.log(res);
    //   })
    //   .catch((err: any) => {
    //     console.log(err);
    //   });
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
      <List>
        {participants?.map((p, index) => {
          return (
            <ListItem key={p.identity} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <PersonIcon sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary={p.name} />
                {/* @ts-ignore */}
                {handRaised?.includes(p.identity) && (
                  <BackHandIcon sx={{ fontSize: '1.3rem', color: 'orange' }} />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
