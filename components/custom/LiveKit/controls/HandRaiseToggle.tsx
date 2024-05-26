import React, { useEffect, useState } from 'react';
import BackHandIcon from '@mui/icons-material/BackHand';
import {
  useLocalParticipant,
  useMaybeRoomContext,
  useParticipants,
  useRemoteParticipants,
} from '@livekit/components-react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import meetService from '../../../../service/meet/meetService';
import { setHandRaised } from '../../../../lib/Slicers/handRaisedSlicer';
import { DataPacket_Kind, RemoteParticipant, RoomEvent } from 'livekit-client';
import Image from 'next/image';
import handRiseIcon from '../assets/icons/hand-rise.svg';
import handRiseActiveIcon from '../assets/icons/hand-rise-active.svg';
import CustomToastAlert from '../../CustomToastAlert';
import { CustomTooltripWithArrow } from '../../CustomTooltripWithArrow';

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
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const { control: hostControl } = useSelector((state: any) => state.hostControl);

  const findRemoteParticipantName = (email: string) => {
    const filterRemoteParticipant = remoteParticipants.find((rp) => rp.identity === email);
    return filterRemoteParticipant?.name;
  };

  const [savedHandRaise, setSavedHandRaise] = useState<
    { email: string; createdAt: string; _id: string }[]
  >([]);
  const checkHandRaise2 = (data: { email: string; createdAt: string; _id: string }[]) => {
    const sortedData = [...data];
    sortedData.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    const newData = [...savedHandRaise];
    const justHandRaised: { email: string; createdAt: string; _id: string }[] = [];
    sortedData.forEach((dt) => {
      const myJoinTime = new Date(localParticipant.joinedAt!);
      if (
        dt.email !== localParticipant.identity &&
        new Date(dt.createdAt) > myJoinTime &&
        !savedHandRaise.some((sd) => sd.email === dt.email) &&
        remoteParticipants.some((rp) => rp.identity === dt.email)
      ) {
        newData.push(dt);
        justHandRaised.push(dt);
      }
    });
    if (justHandRaised.length > 0) {
      setOpenToast(true);
      if (justHandRaised?.length > 1) {
        setToastMessage(
          `${findRemoteParticipantName(justHandRaised?.[0]?.email)} and ${
            justHandRaised?.length - 1
          } others hand raised`,
        );
      } else {
        setToastMessage(`${findRemoteParticipantName(justHandRaised?.[0].email)} hand raised`);
      }
      let audio = new Audio('/meet_message.mp3');
      audio.play();
    }
    const notInMySavedList = newData.filter(
      (sd) => !sortedData.some((dt) => sd.email === dt.email),
    );

    const notInSaveButInRoom = notInMySavedList.filter((nd) =>
      remoteParticipants.some((rp) => rp.identity === nd.email),
    );
    const newHandData = newData.filter(
      (nd) => !notInSaveButInRoom.some((sd) => nd.email === sd.email),
    );
    setSavedHandRaise(newHandData);
  };

  const fetchData = () => {
    meetService
      .getHandRaisedInfo(room?.name!)
      .then((res: any) => {
        setHandRaisedInfo(res?.data?.data);
        dispatch(setHandRaised(res?.data?.data));
        checkHandRaise2(res?.data?.data);
        if (
          room?.state === 'connected' &&
          res?.data?.data?.some((d: any) => d?.email === room?.localParticipant?.identity)
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
            } else {
              setUniqHandRaise([...uniqHandRaise, parsedHandRaisedInfo]);
            }
          }
        }
      },
    );
  return (
    <CustomTooltripWithArrow
      title="You're not allowed to hand raise"
      className={`${hostControl?.handRaise ? 'd-block' : 'd-none'}`}
    >
      <div>
        <button
          aria-pressed={isHandRaised ? 'true' : 'false'}
          onClick={() => handleHandRaised()}
          className="lk-button lk-chat-toggle"
          disabled={hostControl?.handRaise}
        >
          {showIcon && <Image src={handRiseIcon} height="22" width="22" alt="hand" />}
          {showText && 'Hand Raise'}
        </button>
        <CustomToastAlert
          open={openToast}
          setOpen={setOpenToast}
          duration={2000}
          customStyle={{ marginBottom: '60px' }}
          status={'info'}
          message={toastMessage}
          vertical="bottom"
        />
      </div>
    </CustomTooltripWithArrow>
  );
};

export default HandRaiseToggle;
