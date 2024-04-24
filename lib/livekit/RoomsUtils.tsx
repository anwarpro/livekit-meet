import { useParticipants } from '@livekit/components-react';
import { RoomEvent } from 'livekit-client';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import meetService from '../../service/meet/meetService';

type IProps = {
  room: any;
  roomName: string;
  handRaisedInfo: string[];
  setHandRaisedInfo: Dispatch<SetStateAction<string[]>>;
  isHandRaised: boolean;
};

const RoomsUtils = ({
  room,
  handRaisedInfo,
  setHandRaisedInfo,
  isHandRaised,
  roomName,
}: IProps) => {
  console.log('🚀 ~ RoomsUtils ~ handRaisedInfo =====>:', handRaisedInfo);
  console.log('🚀 ~ RoomsUtils ~ isHandRaised ======>:', isHandRaised);
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const participants = useParticipants();
  const { userData } = useSelector((state: any) => state.auth);

  const fetchData = () => {
    meetService
      .getHandRaisedInfo(roomName)
      .then((res: any) => {
        setHandRaisedInfo(res?.data?.data);
        // if (
        //   room?.state === 'connected' &&
        //   res?.data?.data?.includes(room?.localParticipant?.identity)
        // ) {
        //   setIsHandRaised(true);
        // }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    console.log('room:', room?.state);
    if (room?.state === 'connected' && roomName) {
      fetchData();
    }
  }, [room?.state, roomName]);

  useEffect(() => {
    if (room?.state === 'connected' && isHandRaised !== null) {
      meetService
        .handRaise({
          meetId: roomName,
          participantEmail: room?.localParticipant?.identity,
          value: isHandRaised,
        })
        .then((res: any) => {
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
          fetchData();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isHandRaised, room]);

  room.on(
    RoomEvent.DataReceived,
    (payload: Uint8Array, participant: any, kind: string, topic: string) => {
      if (topic === 'hand_raised') {
        const eachHandRaisedInfo = decoder.decode(payload);
        let parsedHandRaisedInfo = JSON.parse(eachHandRaisedInfo);
        fetchData();
      }
    },
  );

  return <></>;
};

export default RoomsUtils;
