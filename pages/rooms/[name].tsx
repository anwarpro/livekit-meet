'use client';
import { formatChatMessageLinks, LiveKitRoom, LocalUserChoices } from '@livekit/components-react';
import {
  ExternalE2EEKeyProvider,
  Room,
  RoomConnectOptions,
  RoomOptions,
  VideoCodec,
  VideoPresets,
  setLogLevel,
} from 'livekit-client';

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';
import { DebugMode } from '../../lib/Debug';
import { decodePassphrase, useServerUrl } from '../../lib/client-utils';
import { SettingsMenu } from '../../lib/livekit/SettingsMenu';
import meetService from '../../service/meet/meetService';
import Footer from '../../components/layouts/Footer';
import { useSelector } from 'react-redux';
import { clearRoom, setRoom } from '../../lib/Slicers/meetSlice';
import { Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import ParticipantList from '../../lib/livekit/ParticipantList';
import RoomsUtils from '../../lib/livekit/RoomsUtils';
// import { LiveKitRoom } from '../../components/custom/LiveKit/LiveKitRoom';
import { VideoConference } from '../../components/custom/LiveKit/prefabs/VideoConference';

const PreJoinNoSSR = dynamic(
  async () => {
    return (await import('../../components/custom/LiveKit/prefabs/PreJoin')).PreJoin;
  },
  { ssr: false },
);

const Home: NextPage = () => {
  const router = useRouter();
  const { name: roomName, user_t } = router.query as { name: string; user_t: string };
  const user = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const { roomInfo } = useSelector((state: any) => state.room);
  const [preJoinChoices, setPreJoinChoices] = React.useState<LocalUserChoices | undefined>(
    undefined,
  );

  function handlePreJoinSubmit(values: LocalUserChoices) {
    console.log('🚀 ~ handlePreJoinSubmit ~ LocalUserChoices:', values);
    setPreJoinChoices(values);
  }

  React.useEffect(() => {
    if (roomName) {
      if (user_t) {
        meetService
          .joinMeet(roomName, user_t)
          .then((res: any) => {
            dispatch(setRoom(res?.data?.data));
          })
          .catch((err) => {
            dispatch(clearRoom());
          });
      } else {
        if (user?.userData?._id) {
          meetService
            .joinMeet(roomName, '', user?.token)
            .then((res: any) => {
              dispatch(setRoom(res?.data?.data));
            })
            .catch((err) => {
              dispatch(clearRoom());
            });
        }
      }

      const input: any = document.getElementById('username');
      if (input) {
        input.value = user?.userData?.fullName || 'Guest User';
        input.disabled = true;
      }
    }
  }, [roomName, user]);

  return (
    <>
      <Head>
        <title>PH Meet | Conference app hosted by Programming Hero</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main data-lk-theme="default" style={{ background: '#111' }}>
        {roomName && !Array.isArray(roomName) && preJoinChoices ? (
          <ActiveRoom
            roomName={roomName}
            userChoices={preJoinChoices}
            onLeave={() => {
              router.push('/');
            }}
          ></ActiveRoom>
        ) : (
          <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
            <PreJoinNoSSR
              onError={(err) => console.log('error while setting up prejoin', err)}
              defaults={{
                username: '',
                videoEnabled: false,
                audioEnabled: false,
              }}
              userLabel={user?.userData?.fullName}
              joinLabel="Join Meeting"
              onValidate={(values: LocalUserChoices) => {
                if (roomInfo?.accessToken) {
                  return true;
                } else {
                  return false;
                }
              }}
              onSubmit={handlePreJoinSubmit}
            ></PreJoinNoSSR>
          </div>
        )}
      </main>
    </>
  );
};

export default Home;

type ActiveRoomProps = {
  userChoices: LocalUserChoices;
  roomName: string;
  region?: string;
  onLeave?: () => void;
};
const ActiveRoom = ({ roomName, userChoices, onLeave }: ActiveRoomProps) => {
  const router = useRouter();
  const { region, hq, codec } = router.query;
  const e2eePassphrase =
    typeof window !== 'undefined' && decodePassphrase(location.hash.substring(1));
  const liveKitUrl = useServerUrl(region as string | undefined);
  const worker =
    typeof window !== 'undefined' &&
    e2eePassphrase &&
    new Worker(new URL('livekit-client/e2ee-worker', import.meta.url));

  const e2eeEnabled = !!(e2eePassphrase && worker);
  const keyProvider = new ExternalE2EEKeyProvider();
  const roomOptions = React.useMemo((): RoomOptions => {
    let videoCodec: VideoCodec | undefined = (
      Array.isArray(codec) ? codec[0] : codec ?? 'vp9'
    ) as VideoCodec;
    if (e2eeEnabled && (videoCodec === 'av1' || videoCodec === 'vp9')) {
      videoCodec = undefined;
    }
    return {
      videoCaptureDefaults: {
        deviceId: userChoices.videoDeviceId ?? undefined,
        resolution: hq === 'true' ? VideoPresets.h2160 : VideoPresets.h720,
      },
      publishDefaults: {
        dtx: false,
        videoSimulcastLayers:
          hq === 'true'
            ? [VideoPresets.h1080, VideoPresets.h720]
            : [VideoPresets.h540, VideoPresets.h216],
        red: !e2eeEnabled,
        videoCodec,
      },
      audioCaptureDefaults: {
        deviceId: userChoices.audioDeviceId ?? undefined,
      },
      adaptiveStream: { pixelDensity: 'screen' },
      dynacast: true,
      e2ee: e2eeEnabled
        ? {
            keyProvider,
            worker,
          }
        : undefined,
    };
    // @ts-ignore
    setLogLevel('debug', 'lk-e2ee');
  }, [userChoices, hq, codec]);
  const room = React.useMemo(() => new Room(roomOptions), []);
  const connectOptions = React.useMemo((): RoomConnectOptions => {
    return {
      autoSubscribe: true,
    };
  }, []);
  const { roomInfo } = useSelector((state: any) => state.room);
  const [open, setOpen] = React.useState<boolean>(false);
  const toggleDrawer = () => {
    setOpen((prevState) => !prevState);
  };
  const [isHandRaised, setIsHandRaised] = React.useState<string>("null");
  // "null" - not set yet 
  // "true" - clicked to set true
  // "false" - clicked to set false 
  // "first" - not clicked, but hand raised already 
  const [handRaisedInfo, setHandRaisedInfo] = React.useState<string[]>([]);

  const handleHandRaised = () => {
    console.log("here:", isHandRaised);
    if(isHandRaised === "true" || isHandRaised === "first") {
      setIsHandRaised("false");
    } else {
      setIsHandRaised("true");
    }
  };

  React.useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const participantButton = document.getElementsByClassName('participant-button')?.[0];
        const handRaisedButton = document.getElementsByClassName('hand-raised')?.[0];
        if (!handRaisedButton && mutation.addedNodes.length) {
          const targetElement = document.getElementsByClassName('lk-control-bar')?.[0];
          if (targetElement) {
            const newHandRaisedButton = document.createElement('button');
            newHandRaisedButton.className = 'lk-button hand-raised';
            newHandRaisedButton.addEventListener('click', () => handleHandRaised());
            newHandRaisedButton.innerHTML = `
            <img height="25" src='data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IS0tIFVwbG9hZGVkIHRvOiBTVkcgUmVwbywgd3d3LnN2Z3JlcG8uY29tLCBHZW5lcmF0b3I6IFNWRyBSZXBvIE1peGVyIFRvb2xzIC0tPgo8c3ZnIGZpbGw9IiNmZmYiIHdpZHRoPSIzMHB4IiBoZWlnaHQ9IjMwcHgiIHZpZXdCb3g9IjAgMCA1NiA1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNIDI1LjEyODkgNTMuNTExNyBDIDMzLjM3ODkgNTMuNTExNyAzOS4xNjgwIDQ5LjAzNTIgNDIuMjg1MSA0MC4yNDYxIEwgNDYuNDEwMiAyOC42NDQ1IEMgNDcuNDQxNCAyNS43MTQ5IDQ2LjUwMzkgMjMuMzAwOCA0NC4wNjY0IDIyLjQxMDIgQyA0MS44ODY3IDIxLjYxMzMgMzkuNzMwNSAyMi41NTA4IDM4LjY5OTIgMjQuOTY0OSBMIDM3LjE3NTggMjguNzE0OSBDIDM3LjEyODkgMjguODA4NiAzNy4wNTg2IDI4Ljg3ODkgMzYuOTY0OSAyOC44Nzg5IEMgMzYuODQ3NiAyOC44Nzg5IDM2LjgwMDggMjguNzg1MiAzNi44MDA4IDI4LjY2ODAgTCAzNi44MDA4IDkuODcxMSBDIDM2LjgwMDggNy4xMjg5IDM1LjA4OTggNS40MTgwIDMyLjQ2NDkgNS40MTgwIEMgMzEuNTAzOSA1LjQxODAgMzAuNjM2NyA1Ljc0NjEgMjkuOTgwNSA2LjM1NTUgQyAyOS42NzU4IDMuOTY0OSAyOC4xMjg5IDIuNDg4MyAyNS44MDg2IDIuNDg4MyBDIDIzLjUzNTEgMi40ODgzIDIxLjk0MTQgNC4wMTE3IDIxLjU4OTggNi4zMDg2IEMgMjEuMDAzOSA1LjcyMjcgMjAuMTYwMiA1LjQxODAgMTkuMzE2NCA1LjQxODAgQyAxNi44Nzg5IDUuNDE4MCAxNS4yNjE3IDcuMTA1NSAxNS4yNjE3IDkuNzA3MSBMIDE1LjI2MTcgMTIuMzA4NiBDIDE0LjYyODkgMTEuNjUyNCAxMy42OTE0IDExLjMwMDggMTIuNjgzNiAxMS4zMDA4IEMgMTAuMjQ2MSAxMS4zMDA4IDguNTU4NiAxMy4xMDU1IDguNTU4NiAxNS43MzA1IEwgOC41NTg2IDM1Ljg2MzMgQyA4LjU1ODYgNDYuODMyMCAxNS4yMTQ5IDUzLjUxMTcgMjUuMTI4OSA1My41MTE3IFogTSAyNS4wMTE3IDUwLjI1MzkgQyAxNi43MTQ5IDUwLjI1MzkgMTEuNjUyNCA0NC45MzM2IDExLjY1MjQgMzUuNDg4MyBMIDExLjY1MjQgMTYuMDU4NiBDIDExLjY1MjQgMTUuMDc0MiAxMi4yODUxIDE0LjM3MTEgMTMuMjY5NSAxNC4zNzExIEMgMTQuMjMwNSAxNC4zNzExIDE0LjkzMzYgMTUuMDc0MiAxNC45MzM2IDE2LjA1ODYgTCAxNC45MzM2IDI4LjAzNTIgQyAxNC45MzM2IDI4LjkwMjQgMTUuNjM2NyAyOS40ODgzIDE2LjM4NjcgMjkuNDg4MyBDIDE3LjE4MzYgMjkuNDg4MyAxNy45MTAyIDI4LjkwMjQgMTcuOTEwMiAyOC4wMzUyIEwgMTcuOTEwMiAxMC4xMjg5IEMgMTcuOTEwMiA5LjEyMTEgMTguNTQzMCA4LjQ0MTQgMTkuNTAzOSA4LjQ0MTQgQyAyMC40ODgzIDguNDQxNCAyMS4xNjgwIDkuMTIxMSAyMS4xNjgwIDEwLjEyODkgTCAyMS4xNjgwIDI2LjgzOTggQyAyMS4xNjgwIDI3LjcwNzEgMjEuODcxMSAyOC4yOTMwIDIyLjY0NDUgMjguMjkzMCBDIDIzLjQ0MTQgMjguMjkzMCAyNC4xNjgwIDI3LjcwNzEgMjQuMTY4MCAyNi44Mzk4IEwgMjQuMTY4MCA3LjIyMjcgQyAyNC4xNjgwIDYuMjM4MyAyNC44MjQyIDUuNTExNyAyNS44MDg2IDUuNTExNyBDIDI2Ljc0NjEgNS41MTE3IDI3LjQyNTggNi4yMzgzIDI3LjQyNTggNy4yMjI3IEwgMjcuNDI1OCAyNi44Mzk4IEMgMjcuNDI1OCAyNy42NjAyIDI4LjA4MjAgMjguMjkzMCAyOC45MDI0IDI4LjI5MzAgQyAyOS42OTkyIDI4LjI5MzAgMzAuNDAyNCAyNy42NjAyIDMwLjQwMjQgMjYuODM5OCBMIDMwLjQwMjQgMTAuMTI4OSBDIDMwLjQwMjQgOS4xMjExIDMxLjA4MjAgOC40NDE0IDMyLjA0MzAgOC40NDE0IEMgMzMuMDI3MyA4LjQ0MTQgMzMuNjgzNiA5LjEyMTEgMzMuNjgzNiAxMC4xMjg5IEwgMzMuNjgzNiAzMy4xOTE0IEMgMzMuNjgzNiAzNC4yNjk1IDM0LjM2MzMgMzUuMDQzMCAzNS4zNDc2IDM1LjA0MzAgQyAzNi4xOTE0IDM1LjA0MzAgMzYuODk0NSAzNC42NjgwIDM3LjQzMzYgMzMuNDk2MSBMIDQwLjYyMTEgMjYuMzcxMSBDIDQxLjA0MzAgMjUuMzYzMyA0MS44ODY3IDI0Ljg0NzYgNDIuNzUzOSAyNS4xNzU4IEMgNDMuNjkxNCAyNS41NTA4IDQ0LjAxOTUgMjYuNDQxNCA0My41NzQyIDI3LjY2MDIgTCAzOS40MjU4IDM5LjIzODMgQyAzNi41NjY0IDQ3LjIzMDUgMzEuNTUwOCA1MC4yNTM5IDI1LjAxMTcgNTAuMjUzOSBaIi8+PC9zdmc+'/>
            <span>hand raised</span>
              `;
            targetElement.appendChild(newHandRaisedButton);
            observer.disconnect();
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Box sx={{ height: '100dvh' }}>
      {liveKitUrl && (
        <LiveKitRoom
          room={room}
          token={roomInfo?.accessToken}
          serverUrl={liveKitUrl}
          connectOptions={connectOptions}
          video={userChoices.videoEnabled}
          audio={userChoices.audioEnabled}
          onDisconnected={onLeave}
        >
          <VideoConference
            chatMessageFormatter={formatChatMessageLinks}
            SettingsComponent={SettingsMenu}
          />

          <RoomsUtils
            room={room}
            handRaisedInfo={handRaisedInfo}
            setHandRaisedInfo={setHandRaisedInfo}
            isHandRaised={isHandRaised}
            setIsHandRaised={setIsHandRaised}
            roomName={roomName}
          />
          {/* <ParticipantList setOpen={setOpen} open={open} handRaisedInfo={handRaisedInfo} /> */}

          <DebugMode />
        </LiveKitRoom>
      )}
    </Box>
  );
};
