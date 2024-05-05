import * as React from 'react';
import type {
  MessageDecoder,
  MessageEncoder,
  TrackReferenceOrPlaceholder,
  WidgetState,
} from '@livekit/components-core';
import { isEqualTrackRef, isTrackReference, isWeb, log } from '@livekit/components-core';
import { RoomEvent, Track } from 'livekit-client';

import {
  CarouselLayout,
  ConnectionStateToast,
  FocusLayoutContainer,
  LayoutContextProvider,
  MessageFormatter,
  RoomAudioRenderer,
  useCreateLayoutContext,
  useParticipants,
  useTracks,
} from '@livekit/components-react';
import { useWarnAboutMissingStyles } from '../hooks/useWarnAboutMissingStyles';
import { FocusLayout, GridLayout } from '../layout';
import { ParticipantTile } from '../participant/ParticipantTile';
import { ControlBar } from './ControlBar';
import { Chat } from './Chat';
import { Participant } from './Participant';
import { useParticipantToggle } from '../hooks/useParticipantToggle';
import { useSelector } from 'react-redux';
import {usePinnedTracks} from '../hooks/usePinnedTracks'
import { useRouter } from 'next/router';
import meetService from '../../../../service/meet/meetService';

/**
 * @public
 */
export interface VideoConferenceProps extends React.HTMLAttributes<HTMLDivElement> {
  chatMessageFormatter?: MessageFormatter;
  chatMessageEncoder?: MessageEncoder;
  chatMessageDecoder?: MessageDecoder;
  room: any;
  /** @alpha */
  SettingsComponent?: React.ComponentType;
}

/**
 * The `VideoConference` ready-made component is your drop-in solution for a classic video conferencing application.
 * It provides functionality such as focusing on one participant, grid view with pagination to handle large numbers
 * of participants, basic non-persistent chat, screen sharing, and more.
 *
 * @remarks
 * The component is implemented with other LiveKit components like `FocusContextProvider`,
 * `GridLayout`, `ControlBar`, `FocusLayoutContainer` and `FocusLayout`.
 * You can use this components as a starting point for your own custom video conferencing application.
 *
 * @example
 * ```tsx
 * <LiveKitRoom>
 *   <VideoConference />
 * <LiveKitRoom>
 * ```
 * @public
 */
export function VideoConference({
  chatMessageFormatter,
  chatMessageDecoder,
  chatMessageEncoder,
  room,
  SettingsComponent,
  ...props
}: VideoConferenceProps) {
  const [widgetState, setWidgetState] = React.useState<WidgetState>({
    showChat: false,
    unreadMessages: 0,
    showSettings: false,
    // @ts-ignore
    showParticipant: false,
  });
  const lastAutoFocusedScreenShareTrack = React.useRef<TrackReferenceOrPlaceholder | null>(null);
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { updateOnlyOn: [RoomEvent.ActiveSpeakersChanged], onlySubscribed: false },
  );

  const widgetUpdate = (state: WidgetState) => {
    log.debug('updating widget state', state);
    setWidgetState(state);
  };

  // custom pin code
  const router = useRouter();
  const { name: roomName } = router.query as { name: string};
  const [remotePinEmail, setRemotePinEmail] = React.useState("no_email");
  const [selfPinEmail, setSelfPinEmail] = React.useState("no_self");
  const decoder = new TextDecoder();
  const fetchPinData = ()=> {
    meetService.getPinInfo(roomName)
    .then((res:any) => {
      setRemotePinEmail(res.data?.data);
      setSelfPinEmail("no_self");
    }).catch(err => {
      console.log(err);
    })
  }
  room.on(
    RoomEvent.DataReceived,
    (payload: Uint8Array, participant: any, kind: string, topic: string) => {
      if (topic === 'pin_updated') {
        const email = JSON.parse(decoder.decode(payload));
        if(email.email !== remotePinEmail) {
          setRemotePinEmail(email.email);
          setSelfPinEmail("no_self");
        }
      }
    },
  );
  React.useEffect(()=> {
    if(roomName) {
      fetchPinData();
    }
  }, [roomName])

  const layoutContext = useCreateLayoutContext();
  const screenShareTracks = tracks
    .filter(isTrackReference)
    .filter((track) => track.publication.source === Track.Source.ScreenShare);

  const focusTrack = usePinnedTracks(layoutContext, tracks, remotePinEmail, selfPinEmail)?.[0];
  const carouselTracks = tracks.filter((track) => !isEqualTrackRef(track, focusTrack));

  React.useEffect(() => {
    // If screen share tracks are published, and no pin is set explicitly, auto set the screen share.
    if (
      screenShareTracks.some((track) => track.publication.isSubscribed) &&
      lastAutoFocusedScreenShareTrack.current === null
    ) {
      log.debug('Auto set screen share focus:', { newScreenShareTrack: screenShareTracks[0] });
      layoutContext.pin.dispatch?.({ msg: 'set_pin', trackReference: screenShareTracks[0] });
      lastAutoFocusedScreenShareTrack.current = screenShareTracks[0];
    } else if (
      lastAutoFocusedScreenShareTrack.current &&
      !screenShareTracks.some(
        (track) =>
          track.publication.trackSid ===
          lastAutoFocusedScreenShareTrack.current?.publication?.trackSid,
      )
    ) {
      log.debug('Auto clearing screen share focus.');
      layoutContext.pin.dispatch?.({ msg: 'clear_pin' });
      lastAutoFocusedScreenShareTrack.current = null;
    }
  }, [
    screenShareTracks
      .map((ref) => `${ref.publication.trackSid}_${ref.publication.isSubscribed}`)
      .join(),
    focusTrack?.publication?.trackSid,
  ]);

  useWarnAboutMissingStyles();
  const { isParticipantModalOpen } = useSelector((state: any) => state.participant);

  return (
    <div className="lk-video-conference" {...props}>
      {isWeb() && (
        <LayoutContextProvider
          value={layoutContext}
          // onPinChange={handleFocusStateChange}
          onWidgetChange={widgetUpdate}
        >
          <div className="lk-video-conference-inner">
            {!focusTrack ? (
              <div className="lk-grid-layout-wrapper">
                <GridLayout tracks={tracks}>
                  <ParticipantTile room={room} remotePinEmail={remotePinEmail} setRemotePinEmail={setRemotePinEmail} selfPinEmail={selfPinEmail} setSelfPinEmail={setSelfPinEmail} />
                </GridLayout>
              </div>
            ) : (
              <div className="lk-focus-layout-wrapper">
                <FocusLayoutContainer>
                  <CarouselLayout tracks={carouselTracks}>
                    <ParticipantTile room={room} remotePinEmail={remotePinEmail} setRemotePinEmail={setRemotePinEmail} selfPinEmail={selfPinEmail} setSelfPinEmail={setSelfPinEmail}/>
                  </CarouselLayout>
                  {focusTrack && <FocusLayout trackRef={focusTrack} room={room} remotePinEmail={remotePinEmail} setRemotePinEmail={setRemotePinEmail} selfPinEmail={selfPinEmail} setSelfPinEmail={setSelfPinEmail} />}
                </FocusLayoutContainer>
              </div>
            )}
            <ControlBar
              controls={{ chat: true, settings: !!SettingsComponent, participant: true }}
            />
          </div>
          <Chat
            style={{ display: widgetState.showChat ? 'grid' : 'none' }}
            messageFormatter={chatMessageFormatter}
            messageEncoder={chatMessageEncoder}
            messageDecoder={chatMessageDecoder}
          />
          <Participant
            // @ts-ignore
            style={{ display: isParticipantModalOpen ? 'grid' : 'none' }}
            messageFormatter={chatMessageFormatter}
            messageEncoder={chatMessageEncoder}
            messageDecoder={chatMessageDecoder}
          />
          {SettingsComponent && (
            <div
              className="lk-settings-menu-modal"
              style={{ display: widgetState.showSettings ? 'block' : 'none' }}
            >
              <SettingsComponent />
            </div>
          )}
        </LayoutContextProvider>
      )}
      <RoomAudioRenderer />
      <ConnectionStateToast />
    </div>
  );
}
