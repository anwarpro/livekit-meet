import React, { useEffect, useState } from 'react';
import BackHandIcon from '@mui/icons-material/BackHand';
import { useLocalParticipant, useMaybeRoomContext, useParticipants, useRemoteParticipants } from '@livekit/components-react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import meetService from '../../../../service/meet/meetService';
import { setHandRaised } from '../../../../lib/Slicers/handRaisedSlicer';
import { DataPacket_Kind, RemoteParticipant, RoomEvent } from 'livekit-client';
import Image from 'next/image';
import handRiseIcon from '../assets/icons/hand-rise.svg';

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
  const { localParticipant } = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();
  const [checkOthers, setCheckOthers] = useState(false);

  // const findRemoteParticipantJoinedTime = (email: string)=> {
  //   const filterRemoteParticipant = remoteParticipants.find((rp)=> rp.identity===email);
  //   if(!filterRemoteParticipant) return new Date("11/11/1999");
  //   console.log("hand remote",new Date(filterRemoteParticipant.joinedAt!));
  //   return new Date(filterRemoteParticipant.joinedAt!);
  // }

  const checkHandRaise = (data:any)=> {
    if(!checkOthers) return false;

    const filterData = data?.filter(
      (np:any) => {
        // console.log("hand time",findRemoteParticipantJoinedTime(np?.email), new Date(localParticipant.joinedAt!));
        return np?.createdAt && localParticipant?.joinedAt && (new Date(np?.createdAt) > new Date(localParticipant.joinedAt)) && np?.email !== localParticipant.identity
      }
    )
    console.log("hand", filterData);
  }
  console.log("hand unique", uniqHandRaise);
  const fetchData = (check: boolean) => {
    meetService
      .getHandRaisedInfo(room?.name!)
      .then((res: any) => {
        setHandRaisedInfo(res?.data?.data);
        dispatch(setHandRaised(res?.data?.data));
        if(check) checkHandRaise(res?.data?.data);
        if (
          room?.state === 'connected' &&
          res?.data?.data?.some((d:any) => d?.email === room?.localParticipant?.identity)
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
          fetchData(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isHandRaised, room]);

  useEffect(() => {
    if (room?.state === 'connected' && room.name) {
      fetchData(true);
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
            setCheckOthers(true);
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
      {showIcon && <Image src={handRiseIcon} height="22" width="22" alt="hand" />}
      {showText && 'Hand Raise'}
    </button>
  );
};

export default HandRaiseToggle;
