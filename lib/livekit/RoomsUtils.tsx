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
  setIsHandRaised: Dispatch<SetStateAction<boolean>>;
};

const RoomsUtils = ({
  room,
  handRaisedInfo,
  setHandRaisedInfo,
  isHandRaised,
  setIsHandRaised,
  roomName,
}: IProps) => {
  console.log('🚀 ~ RoomsUtils ~ handRaisedInfo =====>:', handRaisedInfo);
  console.log('🚀 ~ RoomsUtils ~ isHandRaised ======>:', isHandRaised);
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const participants = useParticipants();
  const { userData } = useSelector((state: any) => state.auth);

  const [uniqHandRaise, setUniqHandRaise] = useState<object[]>([]);
  console.log('🚀 ~ uniqHandRaiseSet:', uniqHandRaise);

  const fetchData = () => {
    meetService
      .getHandRaisedInfo(roomName)
      .then((res: any) => {
        setHandRaisedInfo(res?.data?.data);
        if (
          room?.state === 'connected' &&
          res?.data?.data?.includes(room?.localParticipant?.identity)
        ) {
          setIsHandRaised(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
              email: userData?.email,
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

  useEffect(() => {
    console.log('room:', room?.state);
    if (room?.state === 'connected' && roomName) {
      fetchData();
    }
  }, [room?.state, roomName, uniqHandRaise]);

  room.on(
    RoomEvent.DataReceived,
    (payload: Uint8Array, participant: any, kind: string, topic: string) => {
      console.log('🚀 ~ participant:', participant);
      if (topic === 'hand_raised') {
        const eachHandRaisedInfo = decoder.decode(payload);
        let parsedHandRaisedInfo = JSON.parse(eachHandRaisedInfo);
        if (
          uniqHandRaise.every(
            (item) => JSON.stringify(item) !== JSON.stringify(parsedHandRaisedInfo),
          )
        ) {
          const data: any = {
            email: participant?.identity,
            topic: 'hand_raised',
            value: !parsedHandRaisedInfo?.value,
          };

          if (uniqHandRaise.some((item) => JSON.stringify(item) === JSON.stringify(data))) {
            const filterData = uniqHandRaise.filter(
              (dt) => JSON.stringify(dt) !== JSON.stringify(data),
            );
            console.log('🚀 ~ filterData:', filterData);
            filterData.push(parsedHandRaisedInfo);
            setUniqHandRaise(filterData);
          } else {
            setUniqHandRaise([...uniqHandRaise, parsedHandRaisedInfo]);
          }
        }
      }
    },
  );

  return <></>;
};

export default RoomsUtils;
