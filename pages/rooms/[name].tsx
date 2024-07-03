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
import { useSelector } from 'react-redux';
import { clearRoom, setRoom } from '../../lib/Slicers/meetSlice';
import { Box } from '@mui/material';
import { useDispatch } from 'react-redux';
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
    setPreJoinChoices(values);
  }

  const [joinApiCalled, setJoinApiCalled] = React.useState(false);
  const [joinApiError, setJoinApiError] = React.useState('');
  React.useEffect(() => {
    if (roomName && !joinApiCalled) {
      setJoinApiCalled(true);
      if (user_t) {
        meetService
          .joinMeet(roomName, user_t)
          .then((res: any) => {
            dispatch(setRoom(res?.data?.data));
            setJoinApiError('');
          })
          .catch((err) => {
            dispatch(clearRoom());
            setJoinApiError(err?.response?.data.message);
          });
      } else {
        if (user?.userData?._id) {
          meetService
            .joinMeet(roomName, '', user?.token)
            .then((res: any) => {
              dispatch(setRoom(res?.data?.data));
              setJoinApiError('');
            })
            .catch((err) => {
              dispatch(clearRoom());
              setJoinApiError(err?.response?.data.message);
            });
        }
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
              userLabel={''}
              errorLabel={joinApiError}
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

  return (
    <Box sx={{ height: '100dvh' }}>
      {liveKitUrl && (
        <LiveKitRoom
          room={room}
          token={roomInfo?.accessToken}
          serverUrl={liveKitUrl}
          connectOptions={connectOptions}
          video={false}
          audio={false}
          onDisconnected={onLeave}
        >
          <VideoConference
            chatMessageFormatter={formatChatMessageLinks}
            SettingsComponent={SettingsMenu}
            room={room}
          />
          <DebugMode />
        </LiveKitRoom>
      )}
    </Box>
  );
};
