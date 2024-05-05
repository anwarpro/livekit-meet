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
import {
  Button,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import PushPinIcon from '@mui/icons-material/PushPin';
import Image from 'next/image';
import pinImage from '../assets/icons/pin.svg';
import unPinImage from '../assets/icons/noun-pin.svg';

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
  remotePinEmail?: string;
  setRemotePinEmail: React.Dispatch<React.SetStateAction<string>>;
  selfPinEmail?: string;
  setSelfPinEmail: React.Dispatch<React.SetStateAction<string>>;
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
    remotePinEmail,
    setRemotePinEmail,
    selfPinEmail,
    setSelfPinEmail,
    ...htmlProps
  }: ParticipantTileProps,
  ref,
) {
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
  const participants = useParticipants();
  const [pinType, setPinType] = React.useState('no_pin');
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const handlePinRemote = () => {
    if (
      user?.userData?.role === 'admin' &&
      remotePinEmail !== trackReference.participant.identity
    ) {
      setRemotePinEmail(trackReference.participant.identity);
      setSelfPinEmail('no_self');
      meetService
        .updatePin(roomName, { pinEmail: trackReference.participant.identity })
        .then((res) => {
          const data = encoder.encode(
            JSON.stringify({
              email: trackReference.participant.identity,
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
  };
  const handlePinRemoveRemote = () => {
    if (user?.userData?.role === 'admin' && remotePinEmail !== 'no_email') {
      setRemotePinEmail('no_email');
      setSelfPinEmail('no_self');
      meetService
        .updatePin(roomName, { pinEmail: 'no_email' })
        .then((res) => {
          const data = encoder.encode(
            JSON.stringify({
              email: 'no_email',
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
  };
  const handlePinSelf = () => {
    if (remotePinEmail === 'no_email' && selfPinEmail !== trackReference.participant.identity) {
      setSelfPinEmail(trackReference.participant.identity);
      setRemotePinEmail('no_email');
    } else if (remotePinEmail !== 'no_email' && user?.userData?.role === 'admin') {
      handlePinRemoveRemote();
      setSelfPinEmail(trackReference.participant.identity);
    }
  };
  const handlePinRemoveSelf = () => {
    if (
      selfPinEmail !== 'no_self' &&
      (remotePinEmail === 'no_email' || user?.userData?.role === 'admin')
    ) {
      setSelfPinEmail('no_self');
      setRemotePinEmail('no_email');
    }
  };
  const handleChange = (value: string) => {
    console.log(value);
    if (value === 'remote_pin') {
      handlePinRemote();
    } else if (value === 'self_pin') {
      handlePinSelf();
    } else {
      if (remotePinEmail !== 'no_email') {
        handlePinRemoveRemote();
      } else if (selfPinEmail !== 'no_self') {
        handlePinRemoveSelf();
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
            onClick={(e) => handleFocusToggle(trackReference)}
          /> */}
          
            <FormControl sx={{ m: 1, marginLeft: 'auto' }} size="small">
              {
                user?.userData?.role !== "admin" && remotePinEmail === "no_email" && 
                <Button
                  id="basic-button"
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={()=> {
                    if(trackReference.participant.identity === selfPinEmail) {
                      handlePinRemoveSelf();
                    } else {
                      handlePinSelf();
                    }
                  }}
                >
                  {
                    (trackReference.participant.identity === remotePinEmail || trackReference.participant.identity == selfPinEmail) ?
                    <Image src={unPinImage} height={40} width={30} alt="pin_image" />
                    :
                    <Image src={pinImage} height={30} width={25} alt="unpin_image" />
                  }
                </Button>
              }
              {
                (user?.userData?.role === "admin" || remotePinEmail !== "no_email") &&
                <Button
                  id="basic-button"
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                >
                  {
                    (trackReference.participant.identity === remotePinEmail || trackReference.participant.identity == selfPinEmail) ?
                    <Image src={unPinImage} height={40} width={30} alt="pin_image" />
                    :
                    <Image src={pinImage} height={30} width={25} alt="unpin_image" />
                  }
                </Button>
              }
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                  {
                    (user?.userData?.role === "admin" || remotePinEmail === "no_email") ?
                    <>
                    {
                      ((trackReference.participant.identity===remotePinEmail && 
                      user?.userData?.role === "admin") || (trackReference.participant.identity===selfPinEmail)) &&
                      <MenuItem value="no_pin" onClick={() => handleChange('no_pin')}>
                        Remove pin
                      </MenuItem>
                    }
                    {
                      trackReference.participant.identity !== selfPinEmail &&
                      <MenuItem value={'self_pin'} onClick={() => handleChange('self_pin')}>
                      Pin for myself
                    </MenuItem>
                    }
                    {
                      user?.userData?.role === "admin" && trackReference.participant.identity !== remotePinEmail && 
                      <MenuItem value={'remote_pin'} onClick={() => handleChange('remote_pin')}>
                        Pin for everyone
                      </MenuItem>
                    }
                  </>
                  :
                  <Typography sx={{marginX: "1rem"}}>Admin has pinned a screen!</Typography>
                  }
              </Menu>
            </FormControl>
        </ParticipantContextIfNeeded>
      </TrackRefContextIfNeeded>
    </div>
  );
});
