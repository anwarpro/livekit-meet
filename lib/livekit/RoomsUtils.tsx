import { useParticipants } from '@livekit/components-react';
import { RoomEvent } from 'livekit-client';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const RoomsUtils = ({ room, handRaisedInfo, setHandRaisedInfo, isHandRaised }: any) => {
  console.log("🚀 ~ RoomsUtils ~ handRaisedInfo =====>:", handRaisedInfo)
  console.log('🚀 ~ RoomsUtils ~ isHandRaised ======>:', isHandRaised);
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const participants = useParticipants();
  const { userData } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (room?.state === 'connected' && isHandRaised !== null) {
      const data = encoder.encode(
        JSON.stringify({
          id: userData?._id,
          topic: 'hand_raised',
          value: isHandRaised,
        }),
      );
      room.localParticipant.publishData(data, {
        reliable: true,
        destinationIdentities: participants?.map((par) => par.identity),
        topic: 'hand_raised',
      });
    }
  }, [isHandRaised, room]);

  room.on(
    RoomEvent.DataReceived,
    (payload: Uint8Array, participant: any, kind: string, topic: string) => {
      if (topic === 'hand_raised') {
        const eachHandRaisedInfo = decoder.decode(payload);
        let parsedHandRaisedInfo = JSON.parse(eachHandRaisedInfo);
        parsedHandRaisedInfo.participant = participant.identity;
        setHandRaisedInfo(parsedHandRaisedInfo);
      }
    },
  );
  return <></>;
};

export default RoomsUtils;
