import * as React from 'react';
import { mergeProps } from '../utils';
import { RoomEvent, Track, type LocalAudioTrack, type LocalVideoTrack } from 'livekit-client';
import { useMaybeRoomContext, useMediaDeviceSelect } from '@livekit/components-react';
import { BackgroundBlur, VirtualBackground } from '@livekit/track-processors';

const vsEffectAction = [
  {
    id: 'BG1',
    label: 'Visual Background',
  },
  {
    id: 'BE1',
    label: 'Blur Effect',
  },
];

/** @public */
export interface MediaDeviceSelectProps
  extends Omit<React.HTMLAttributes<HTMLUListElement>, 'onError'> {
  kind: MediaDeviceKind;
  onActiveDeviceChange?: (deviceId: string) => void;
  onDeviceListChange?: (devices: MediaDeviceInfo[]) => void;
  onDeviceSelectError?: (e: Error) => void;
  initialSelection?: string;
  /** will force the browser to only return the specified device
   * will call `onDeviceSelectError` with the error in case this fails
   */
  exactMatch?: boolean;
  track?: LocalAudioTrack | LocalVideoTrack;
  /**
   * this will call getUserMedia if the permissions are not yet given to enumerate the devices with device labels.
   * in some browsers multiple calls to getUserMedia result in multiple permission prompts.
   * It's generally advised only flip this to true, once a (preview) track has been acquired successfully with the
   * appropriate permissions.
   *
   * @see {@link MediaDeviceMenu}
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices | MDN enumerateDevices}
   */
  requestPermissions?: boolean;
  onError?: (e: Error) => void;
}

/**
 * The `MediaDeviceSelect` list all media devices of one kind.
 * Clicking on one of the listed devices make it the active media device.
 *
 * @example
 * ```tsx
 * <LiveKitRoom>
 *   <MediaDeviceSelect kind='audioinput' />
 * </LiveKitRoom>
 * ```
 * @public
 */
export const MediaDeviceSelect = /* @__PURE__ */ React.forwardRef<
  HTMLUListElement,
  MediaDeviceSelectProps
>(function MediaDeviceSelect(
  {
    kind,
    initialSelection,
    onActiveDeviceChange,
    onDeviceListChange,
    onDeviceSelectError,
    exactMatch,
    track,
    requestPermissions,
    onError,
    ...props
  }: MediaDeviceSelectProps,
  ref,
) {
  const room = useMaybeRoomContext();
  const handleError = React.useCallback(
    (e: Error) => {
      if (room) {
        // awkwardly emit the event from outside of the room, as we don't have other means to raise a MediaDeviceError
        room.emit(RoomEvent.MediaDevicesError, e);
      }
      onError?.(e);
    },
    [room, onError],
  );
  const { devices, activeDeviceId, setActiveMediaDevice, className } = useMediaDeviceSelect({
    kind,
    room,
    track,
    requestPermissions,
    onError: handleError,
  });
  React.useEffect(() => {
    if (initialSelection !== undefined) {
      setActiveMediaDevice(initialSelection);
    }
  }, [setActiveMediaDevice]);

  React.useEffect(() => {
    if (typeof onDeviceListChange === 'function') {
      onDeviceListChange(devices);
    }
  }, [onDeviceListChange, devices]);

  React.useEffect(() => {
    if (activeDeviceId && activeDeviceId !== '') {
      onActiveDeviceChange?.(activeDeviceId);
    }
  }, [activeDeviceId]);

  const handleActiveDeviceChange = async (deviceId: string) => {
    try {
      await setActiveMediaDevice(deviceId, { exact: exactMatch });
    } catch (e) {
      if (e instanceof Error) {
        onDeviceSelectError?.(e);
      } else {
        throw e;
      }
    }
  };
  // Merge Props
  const mergedProps = React.useMemo(
    () => mergeProps(props, { className }, { className: 'lk-list' }),
    [className, props],
  );

  function isActive(deviceId: string, activeDeviceId: string, index: number) {
    return deviceId === activeDeviceId || (index === 0 && activeDeviceId === 'default');
  }

  const [isActiveEffect, setIsActiveEffect] = React.useState<{ id: string; status: boolean }>({
    id: '',
    status: false,
  });
  const imgPaths = [
    '/samantha-gades-BlIhVfXbi9s-unsplash.jpg',
    '/ali-kazal-tbw_KQE3Cbg-unsplash.jpg',
    // Add more image paths as needed
  ];
  const getRandomImgPath = () => {
    const randomIndex = Math.floor(Math.random() * imgPaths.length);
    return imgPaths[randomIndex];
  };
  const state = {
    defaultDevices: new Map<MediaDeviceKind, string>(),
    bitrateInterval: undefined as any,
    blur: BackgroundBlur(10, { delegate: 'GPU' }),
    virtualBackground: VirtualBackground(getRandomImgPath()),
  };

  const handleToggleVsEffect = async (room: any, state: any, label: string) => {
    if (!room) return;
    if (label === 'BG1') {
      try {
        const camTrack = room.localParticipant.getTrackPublication(Track.Source.Camera)!
          .track as LocalVideoTrack;
        if (camTrack.getProcessor()?.name !== 'virtual-background') {
          await camTrack.setProcessor(state.virtualBackground);
          setIsActiveEffect({ id: label, status: true });
        } else {
          await camTrack.stopProcessor();
          setIsActiveEffect({ id: label, status: false });
        }
      } catch (e: any) {
        setIsActiveEffect({ id: label, status: false });
        // appendLog(`ERROR: ${e.message}`);
      } finally {
        // setButtonDisabled('toggle-blur-button', false);
        // renderParticipant(currentRoom.localParticipant);
        // updateButtonsForPublishState();
      }
    }
    if (label === 'BE1') {
      try {
        const camTrack = room.localParticipant.getTrackPublication(Track.Source.Camera)!
          .track as LocalVideoTrack;
        if (camTrack.getProcessor()?.name !== 'background-blur') {
          await camTrack.setProcessor(state.blur);
          setIsActiveEffect({ id: label, status: true });
        } else {
          await camTrack.stopProcessor();
          setIsActiveEffect({ id: label, status: false });
        }
      } catch (e: any) {
        setIsActiveEffect({ id: label, status: false });
        // appendLog(`ERROR: ${e.message}`);
      } finally {
        // setButtonDisabled('toggle-blur-button', false);
        // renderParticipant(currentRoom.localParticipant);
        // updateButtonsForPublishState();
      }
    }
  };

  return (
    <ul ref={ref} {...mergedProps}>
      <li className="mb-2 pb-2 border-bottom">
        <span className="ms-2">Devices</span>
      </li>
      {devices.map((device, index) => (
        <li
          key={device.deviceId}
          id={device.deviceId}
          data-lk-active={isActive(device.deviceId, activeDeviceId, index)}
          aria-selected={isActive(device.deviceId, activeDeviceId, index)}
          role="option"
        >
          <button className="lk-button" onClick={() => handleActiveDeviceChange(device.deviceId)}>
            {device.label}
          </button>
        </li>
      ))}
      <li className="my-2 py-2 border-bottom">
        <span className="ms-2">Apply Visual Effect</span>
      </li>
      {vsEffectAction.map((device, index) => (
        <li
          key={device.id}
          id={device.id}
          data-lk-active={device.id === isActiveEffect.id && isActiveEffect.status}
          aria-selected={device.id === isActiveEffect.id && isActiveEffect.status}
          role="option"
        >
          <button
            className="lk-button"
            onClick={() => handleToggleVsEffect(room, state, device.id)}
          >
            {device.label}
          </button>
        </li>
      ))}
    </ul>
  );
});
