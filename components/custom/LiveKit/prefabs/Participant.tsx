import * as React from 'react';
import type { ChatMessage, ChatOptions } from '@livekit/components-core';
import { ChatCloseIcon } from '../assets/icons';
import { MessageFormatter, useParticipants } from '@livekit/components-react';

import { ParticipantToggle } from '../controls/ParticipantToggle';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { PersonPinCircleOutlined } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import BackHandIcon from '@mui/icons-material/BackHand';
import { useSelector } from 'react-redux';

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
  return (
    <div {...props} className="lk-chat">
      <div className="lk-chat-header">
        <p className="participant-title m-0">total participants : {participants.length}</p>
        <ParticipantToggle className="lk-close-button">
          <ChatCloseIcon />
        </ParticipantToggle>
      </div>
      <div>
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
    </div>
  );
}
