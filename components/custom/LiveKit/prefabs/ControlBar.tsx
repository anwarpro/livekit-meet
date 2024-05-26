import { Track } from 'livekit-client';
import * as React from 'react';
import { DisconnectButton } from '../controls/DisconnectButton';
import { ChatIcon, GearIcon, LeaveIcon } from '../assets/icons';
import { supportsScreenSharing } from '@livekit/components-core';
import { mergeProps } from '../utils';
import {
  // ChatToggle,
  // TrackToggle,
  useLocalParticipantPermissions,
  useMaybeLayoutContext,
  usePersistentUserChoices,
} from '@livekit/components-react';
import {
  Button,
  Tooltip,
  TooltipProps,
  styled,
  tooltipClasses,
  useMediaQuery,
} from '@mui/material';
import { SettingsMenuToggle } from '../controls/SettingsMenuToggle';
import { StartMediaButton } from '../controls/StartMediaButton';
import { ParticipantToggle } from '../controls/ParticipantToggle';
import { MediaDeviceMenu } from './MediaDeviceMenu';
import ParticipantsIcon from '../assets/icons/ParticipantsIcon';
import BackHandIcon from '@mui/icons-material/BackHand';
import HandRaiseToggle from '../controls/HandRaiseToggle';
import { ChatToggle } from '../controls/ChatToggle';
import { TrackToggle } from '../controls/TrackToggle';
import { useSelector } from 'react-redux';
import { CustomTooltripWithArrow } from '../../CustomTooltripWithArrow';

/** @public */
export type ControlBarControls = {
  microphone?: boolean;
  camera?: boolean;
  chat?: boolean;
  participant?: boolean;
  screenShare?: boolean;
  leave?: boolean;
  settings?: boolean;
};

/** @public */
export interface ControlBarProps extends React.HTMLAttributes<HTMLDivElement> {
  variation?: 'minimal' | 'verbose' | 'textOnly';
  controls?: ControlBarControls;
  /**
   * If `true`, the user's device choices will be persisted.
   * This will enables the user to have the same device choices when they rejoin the room.
   * @defaultValue true
   * @alpha
   */
  saveUserChoices?: boolean;
}

/**
 * The `ControlBar` prefab gives the user the basic user interface to control their
 * media devices (camera, microphone and screen share), open the `Chat` and leave the room.
 *
 * @remarks
 * This component is build with other LiveKit components like `TrackToggle`,
 * `DeviceSelectorButton`, `DisconnectButton` and `StartAudio`.
 *
 * @example
 * ```tsx
 * <LiveKitRoom>
 *   <ControlBar />
 * </LiveKitRoom>
 * ```
 * @public
 */
export function ControlBar({
  variation,
  controls,
  saveUserChoices = true,
  ...props
}: ControlBarProps) {
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const layoutContext = useMaybeLayoutContext();
  React.useEffect(() => {
    if (layoutContext?.widget.state?.showChat !== undefined) {
      setIsChatOpen(layoutContext?.widget.state?.showChat);
    }
  }, [layoutContext?.widget.state?.showChat]);

  const isTooLittleSpace = useMediaQuery(`(max-width: ${isChatOpen ? 1120 : 1100}px)`);

  const defaultVariation = isTooLittleSpace ? 'minimal' : 'verbose';
  variation ??= defaultVariation;

  const visibleControls = { leave: true, ...controls };

  const localPermissions = useLocalParticipantPermissions();

  if (!localPermissions) {
    visibleControls.camera = false;
    visibleControls.chat = false;
    visibleControls.participant = false;
    visibleControls.microphone = false;
    visibleControls.screenShare = false;
  } else {
    visibleControls.camera ??= localPermissions.canPublish;
    visibleControls.microphone ??= localPermissions.canPublish;
    visibleControls.screenShare ??= localPermissions.canPublish;
    visibleControls.chat ??= localPermissions.canPublishData && controls?.chat;
    visibleControls.participant ??= localPermissions.canPublishData && controls?.participant;
  }

  const showIcon = React.useMemo(
    () => variation === 'minimal' || variation === 'verbose',
    [variation],
  );
  const showText = React.useMemo(
    () => variation === 'textOnly' || variation === 'verbose',
    [variation],
  );

  const browserSupportsScreenSharing = supportsScreenSharing();

  const [isScreenShareEnabled, setIsScreenShareEnabled] = React.useState(false);

  const onScreenShareChange = React.useCallback(
    (enabled: boolean) => {
      setIsScreenShareEnabled(enabled);
    },
    [setIsScreenShareEnabled],
  );

  const htmlProps = mergeProps({ className: 'lk-control-bar' }, props);

  const {
    saveAudioInputEnabled,
    saveVideoInputEnabled,
    saveAudioInputDeviceId,
    saveVideoInputDeviceId,
  } = usePersistentUserChoices({ preventSave: !saveUserChoices });

  const microphoneOnChange = React.useCallback(
    (enabled: boolean, isUserInitiated: boolean) =>
      isUserInitiated ? saveAudioInputEnabled(enabled) : null,
    [saveAudioInputEnabled],
  );

  const cameraOnChange = React.useCallback(
    (enabled: boolean, isUserInitiated: boolean) =>
      isUserInitiated ? saveVideoInputEnabled(enabled) : null,
    [saveVideoInputEnabled],
  );
  const { control: hostControl } = useSelector((state: any) => state.hostControl);
  console.log('🚀 ~ control:', hostControl);
  return (
    <div {...htmlProps}>
      {visibleControls.microphone && (
        <div className="lk-button-group">
          <CustomTooltripWithArrow
            title="You're not allowed to turn on your microphone"
            className={`${hostControl?.microphone ? 'd-block' : 'd-none'}`}
          >
            <TrackToggle
              source={Track.Source.Microphone}
              showIcon={showIcon}
              onChange={microphoneOnChange}
            >
              {showText && 'Microphone'}
            </TrackToggle>
          </CustomTooltripWithArrow>
          <div className="lk-button-group-menu">
            <MediaDeviceMenu
              kind="audioinput"
              onActiveDeviceChange={(_kind, deviceId) => saveAudioInputDeviceId(deviceId ?? '')}
            />
          </div>
        </div>
      )}
      {visibleControls.camera && (
        <div className="lk-button-group">
          <CustomTooltripWithArrow
            title="You're not allowed to turn on your camera"
            className={`${hostControl?.camera ? 'd-block' : 'd-none'}`}
          >
            <TrackToggle source={Track.Source.Camera} showIcon={showIcon} onChange={cameraOnChange}>
              {showText && 'Camera'}
            </TrackToggle>
          </CustomTooltripWithArrow>
          <div className="lk-button-group-menu">
            <MediaDeviceMenu
              kind="videoinput"
              onActiveDeviceChange={(_kind, deviceId) => saveVideoInputDeviceId(deviceId ?? '')}
            />
          </div>
        </div>
      )}
      {visibleControls.screenShare && browserSupportsScreenSharing && (
        <CustomTooltripWithArrow
          title="You're not allowed to share your screen"
          className={`${hostControl?.screenShare ? 'd-block' : 'd-none'}`}
        >
          <TrackToggle
            source={Track.Source.ScreenShare}
            captureOptions={{ audio: true, selfBrowserSurface: 'include' }}
            showIcon={showIcon}
            onChange={onScreenShareChange}
          >
            {showText && (isScreenShareEnabled ? 'Stop screen share' : 'Share screen')}
          </TrackToggle>
        </CustomTooltripWithArrow>
      )}
      {visibleControls.chat && (
        <ChatToggle>
          {showIcon && <ChatIcon />}
          {showText && 'Chat'}
        </ChatToggle>
      )}
      {visibleControls.participant && (
        <ParticipantToggle>
          {showIcon && <ParticipantsIcon />}
          {showText && 'Participant'}
        </ParticipantToggle>
      )}
      <HandRaiseToggle showIcon={showIcon} showText={showText} />
      {visibleControls.settings && showText && (
        <SettingsMenuToggle>
          {showIcon && <GearIcon />}
          {showText && 'Settings'}
        </SettingsMenuToggle>
      )}
      {visibleControls.leave && (
        <DisconnectButton>
          {showIcon && <LeaveIcon />}
          {showText && 'Leave'}
        </DisconnectButton>
      )}
      <StartMediaButton />
    </div>
  );
}
