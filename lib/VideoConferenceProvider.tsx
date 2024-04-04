import {
  Chat,
  ControlBar,
  GridLayout,
  LayoutContextProvider,
  ParticipantLoop,
  ParticipantName,
  ParticipantTile,
  RoomAudioRenderer,
  VideoTrack,
  useParticipants,
  useTracks,
} from '@livekit/components-react';
import { RoomEvent, Track } from 'livekit-client';
import React from 'react';

const VideoConferenceProvider = () => {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { updateOnlyOn: [RoomEvent.ActiveSpeakersChanged], onlySubscribed: false },
  );

  const participants = useParticipants();
  console.log('🚀 ~ VideoConferenceProvider ~ participants:', participants);

  return (
    <div style={{ height: '100vh' }}>
      <RoomAudioRenderer />
      <GridLayout tracks={tracks}>
        <ParticipantTile />
      </GridLayout>
      <ParticipantLoop participants={participants}>
        <ParticipantName />
      </ParticipantLoop>
      <LayoutContextProvider>
        <ControlBar  controls={{ chat: true, screenShare: true }} />
      </LayoutContextProvider>
    </div>
  );
};

export default VideoConferenceProvider;
