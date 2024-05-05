import React, { useEffect, useState } from 'react';
import BackHandIcon from '@mui/icons-material/BackHand';
import { useMaybeRoomContext, useParticipants } from '@livekit/components-react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import meetService from '../../../../service/meet/meetService';
import { setHandRaised } from '../../../../lib/Slicers/handRaisedSlicer';
import { DataPacket_Kind, RemoteParticipant, RoomEvent } from 'livekit-client';

const HandRaiseToggle = ({ showIcon, showText }: { showIcon: boolean; showText: boolean }) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const participants = useParticipants();
  const { userData } = useSelector((state: any) => state.auth);
  const [handRaisedInfo, setHandRaisedInfo] = React.useState<string[]>([]);
  const [isHandRaised, setIsHandRaised] = React.useState<boolean>(false);
  const room = useMaybeRoomContext();
  const [uniqHandRaise, setUniqHandRaise] = useState<object[]>([]);
  const dispatch = useDispatch();

  const fetchData = () => {
    meetService
      .getHandRaisedInfo(room?.name!)
      .then((res: any) => {
        setHandRaisedInfo(res?.data?.data);
        dispatch(setHandRaised(res?.data?.data));
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
          meetId: room.name,
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
    if (room?.state === 'connected' && room.name) {
      fetchData();
    }
  }, [room?.state, room?.name, uniqHandRaise]);

  const handleHandRaised = () => {
    setIsHandRaised((prevState) => !prevState);
  };

  room &&
    room.on(
      RoomEvent.DataReceived,
      (
        payload: Uint8Array,
        participant?: RemoteParticipant,
        kind?: DataPacket_Kind,
        topic?: string,
      ) => {
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
              filterData.push(parsedHandRaisedInfo);
              setUniqHandRaise(filterData);
              // if (parsedHandRaisedInfo.value) {
              //   let audio = new Audio('/meet_message.mp3');
              //   audio.play();
              // }
            } else {
              // if (parsedHandRaisedInfo.value) {
              //   let audio = new Audio('/meet_message.mp3');
              //   audio.play();
              // }
              setUniqHandRaise([...uniqHandRaise, parsedHandRaisedInfo]);
            }
          }
        }
      },
    );
  return (
    <button onClick={() => handleHandRaised()} className="lk-button lk-chat-toggle">
      {showIcon && <BackHandIcon sx={{ fontSize: '1.3rem' }} />} {showText && 'Hand Raise'}
    </button>
  );
};

export default HandRaiseToggle;
