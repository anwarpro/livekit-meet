import * as React from 'react';
import type { Participant } from 'livekit-client';
import { Track } from 'livekit-client';
import type { ParticipantClickEvent, TrackReferenceOrPlaceholder } from '@livekit/components-core';
import { isTrackReference, isTrackReferencePinned } from '@livekit/components-core';
import {
  AudioTrack,
  ConnectionQualityIndicator,
  LockLockedIcon,
  ParticipantContext,
  ScreenShareIcon,
  TrackMutedIndicator,
  TrackRefContext,
  VideoTrack,
  useEnsureTrackRef,
  useFeatureContext,
  useIsEncrypted,
  useMaybeLayoutContext,
  useMaybeParticipantContext,
  useMaybeTrackRefContext,
  useParticipantTile,
  useParticipants,
} from '@livekit/components-react';
import { ParticipantName } from './ParticipantName';
import { ParticipantPlaceholder } from './ParticipantPlaceholder';
import { FocusToggle } from '../controls/FocusToggle';
import { useSelector } from 'react-redux';
import meetService from '../../../../service/meet/meetService';
import { useRouter } from 'next/router';
import pinIcon from '../../../assets/icons/pin.svg';
import Image from 'next/image';

/**
 * The `ParticipantContextIfNeeded` component only creates a `ParticipantContext`
 * if there is no `ParticipantContext` already.
 * @example
 * ```tsx
 * <ParticipantContextIfNeeded participant={trackReference.participant}>
 *  ...
 * </ParticipantContextIfNeeded>
 * ```
 * @public
 */
export function ParticipantContextIfNeeded(
  props: React.PropsWithChildren<{
    participant?: Participant;
  }>,
) {
  const hasContext = !!useMaybeParticipantContext();
  return props.participant && !hasContext ? (
    <ParticipantContext.Provider value={props.participant}>
      {props.children}
    </ParticipantContext.Provider>
  ) : (
    <>{props.children}</>
  );
}

/**
 * Only create a `TrackRefContext` if there is no `TrackRefContext` already.
 */
function TrackRefContextIfNeeded(
  props: React.PropsWithChildren<{
    trackRef?: TrackReferenceOrPlaceholder;
  }>,
) {
  const hasContext = !!useMaybeTrackRefContext();
  return props.trackRef && !hasContext ? (
    <TrackRefContext.Provider value={props.trackRef}>{props.children}</TrackRefContext.Provider>
  ) : (
    <>{props.children}</>
  );
}

/** @public */
export interface ParticipantTileProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The track reference to display. */
  trackRef?: TrackReferenceOrPlaceholder;
  disableSpeakingIndicator?: boolean;
  room?: any;
  pinEmail?: { email: string };
  setPinEmail: React.Dispatch<React.SetStateAction<{ email: string }>>;
  setIsRemotePin: React.Dispatch<React.SetStateAction<string>>;
  isRemotePin: string;

  onParticipantClick?: (event: ParticipantClickEvent) => void;
}

/**
 * The `ParticipantTile` component is the base utility wrapper for displaying a visual representation of a participant.
 * This component can be used as a child of the `TrackLoop` component or by passing a track reference as property.
 *
 * @example Using the `ParticipantTile` component with a track reference:
 * ```tsx
 * <ParticipantTile trackRef={trackRef} />
 * ```
 * @example Using the `ParticipantTile` component as a child of the `TrackLoop` component:
 * ```tsx
 * <TrackLoop>
 *  <ParticipantTile />
 * </TrackLoop>
 * ```
 * @public
 */
export const ParticipantTile = /* @__PURE__ */ React.forwardRef<
  HTMLDivElement,
  ParticipantTileProps
>(function ParticipantTile(
  {
    trackRef,
    children,
    onParticipantClick,
    disableSpeakingIndicator,
    room,
    pinEmail,
    setPinEmail,
    setIsRemotePin,
    isRemotePin,
    ...htmlProps
  }: ParticipantTileProps,
  ref,
) {
  console.log('🚀 ~ isRemotePin:', isRemotePin);
  console.log('🚀 ~ pinEmail:', pinEmail);
  const trackReference = useEnsureTrackRef(trackRef);

  const { elementProps } = useParticipantTile<HTMLDivElement>({
    htmlProps,
    disableSpeakingIndicator,
    onParticipantClick,
    trackRef: trackReference,
  });
  const isEncrypted = useIsEncrypted(trackReference.participant);
  const layoutContext = useMaybeLayoutContext();

  const autoManageSubscription = useFeatureContext()?.autoSubscription;

  const handleSubscribe = React.useCallback(
    (subscribed: boolean) => {
      if (
        trackReference.source &&
        !subscribed &&
        layoutContext &&
        layoutContext.pin.dispatch &&
        isTrackReferencePinned(trackReference, layoutContext.pin.state)
      ) {
        layoutContext.pin.dispatch({ msg: 'clear_pin' });
      }
    },
    [trackReference, layoutContext],
  );
  const user = useSelector((state: any) => state.auth);
  const router = useRouter();
  const { name: roomName } = router.query as { name: string };
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const participants = useParticipants();
  const handleFocusToggle = (trackReference: TrackReferenceOrPlaceholder) => {
    if (user?.userData?.role === 'admin') {
      if (pinEmail !== undefined && pinEmail.email !== trackReference.participant.identity) {
        setPinEmail({ email: trackReference.participant.identity });
        meetService
          .updatePin(roomName, {
            pinEmail: trackReference.participant.identity,
            isRemotePin: 'remote',
          })
          .then((res) => {
            const data = encoder.encode(
              JSON.stringify({
                email: trackReference.participant.identity,
                isRemotePin: 'remote',
                topic: 'pin_updated',
              }),
            );
            room.state === 'connected' &&
              room.localParticipant.publishData(data, {
                reliable: true,
                destinationIdentities: participants?.map((par) => par.identity),
                topic: 'pin_updated',
              });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        setPinEmail({ email: 'no_email' });
        meetService
          .updatePin(roomName, { pinEmail: 'no_email', isRemotePin: 'no_action' })
          .then((res) => {
            const data = encoder.encode(
              JSON.stringify({
                email: 'no_email',
                isRemotePin: '',
                topic: 'pin_updated',
              }),
            );
            room.state === 'connected' &&
              room.localParticipant.publishData(data, {
                reliable: true,
                destinationIdentities: participants?.map((par) => par.identity),
                topic: 'pin_updated',
              });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  const handleChangePin = (e: any) => {
    if (e.target.value === 'remote') {
      setIsRemotePin('remote');
      handleFocusToggle(trackReference);
    } else {
      setIsRemotePin('self');
      if (trackReference.participant.identity === pinEmail?.email) {
        setPinEmail({ email: 'no_self' });
      } else {
        setPinEmail({ email: trackReference?.participant.identity });
      }
    }
  };

  return (
    <div ref={ref} style={{ position: 'relative' }} {...elementProps}>
      <TrackRefContextIfNeeded trackRef={trackReference}>
        <ParticipantContextIfNeeded participant={trackReference.participant}>
          {children ?? (
            <>
              {isTrackReference(trackReference) &&
              (trackReference.publication?.kind === 'video' ||
                trackReference.source === Track.Source.Camera ||
                trackReference.source === Track.Source.ScreenShare) ? (
                <VideoTrack
                  trackRef={trackReference}
                  onSubscriptionStatusChanged={handleSubscribe}
                  manageSubscription={autoManageSubscription}
                />
              ) : (
                isTrackReference(trackReference) && (
                  <AudioTrack
                    trackRef={trackReference}
                    onSubscriptionStatusChanged={handleSubscribe}
                  />
                )
              )}
              <div className="lk-participant-placeholder">
                <ParticipantPlaceholder />
              </div>
              <div className="lk-participant-metadata">
                <div className="lk-participant-metadata-item">
                  {trackReference.source === Track.Source.Camera ? (
                    <>
                      {isEncrypted && <LockLockedIcon style={{ marginRight: '0.25rem' }} />}
                      <TrackMutedIndicator
                        trackRef={{
                          participant: trackReference.participant,
                          source: Track.Source.Microphone,
                        }}
                        show={'muted'}
                      ></TrackMutedIndicator>
                      <ParticipantName />
                    </>
                  ) : (
                    <>
                      <ScreenShareIcon style={{ marginRight: '0.25rem' }} />
                      <ParticipantName>&apos;s screen</ParticipantName>
                    </>
                  )}
                </div>
                <ConnectionQualityIndicator className="lk-participant-metadata-item" />
              </div>
            </>
          )}

          {/* <FocusToggle
            trackRef={trackReference}
            // onClick={(e) => handleFocusToggle(trackReference)}
          /> */}
          {user?.userData?.role === 'admin' ? (
            <select
              onChange={(e) => handleChangePin(e)}
              className="lk-button lk-focus-toggle-button"
              name=""
              id=""
            >
              <option>pin</option>
              <option value="self">self</option>
              <option value="remote">remote</option>
            </select>
          ) : isRemotePin === 'remote' ? (
            <button className="lk-button lk-focus-toggle-button">host pinned your screen</button>
          ) : (
            <select
              onChange={(e) => handleChangePin(e)}
              className="lk-button lk-focus-toggle-button"
              name=""
              id=""
            >
              <option>pin</option>
              <option value="self">self</option>
            </select>
          )}

          {/* //after finished pin func then design this 
          1.pin img lagbe sekhane click korle popOver open hobe
          2.popOver er modhe option choise korar system thakbe  */}
          {/* <button className="lk-button lk-focus-toggle-button">
            <Image src={pinIcon} height="24" width="24" alt="pin" />
          </button> */}
        </ParticipantContextIfNeeded>
      </TrackRefContextIfNeeded>
    </div>
  );
});
