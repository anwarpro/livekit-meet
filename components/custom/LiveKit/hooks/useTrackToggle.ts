import * as React from 'react';
import type { ToggleSource } from '@livekit/components-core';
import { setupMediaToggle, setupManualToggle, log } from '@livekit/components-core';
import { mergeProps } from '../mergeProps';
import { TrackToggleProps, useMaybeRoomContext } from '@livekit/components-react';
import { useObservableState } from './useObservableState';


/** @public */
export interface UseTrackToggleProps<T extends ToggleSource>
  extends Omit<TrackToggleProps<T>, 'showIcon'> { }

/**
 * The `useTrackToggle` hook is used to implement the `TrackToggle` component and returns state
 * and functionality of the given track.
 *
 * @example
 * ```tsx
 * const { buttonProps, enabled } = useTrackToggle(trackRef);
 * return <button {...buttonProps}>{enabled ? 'disable' : 'enable'}</button>;
 * ```
 * @public
 */
export function useTrackToggle<T extends ToggleSource>({
  source,
  onChange,
  initialState,
  captureOptions,
  ...rest
}: UseTrackToggleProps<T>) {
  const room = useMaybeRoomContext();
  const track = room?.localParticipant?.getTrackPublication(source);
  /** `true` if a user interaction such as a click on the TrackToggle button has occurred. */
  const userInteractionRef = React.useRef(false);

  const { toggle, className, pendingObserver, enabledObserver } = React.useMemo(
    () => (room ? setupMediaToggle<T>(source, room, captureOptions) : setupManualToggle()),
    [room, source, JSON.stringify(captureOptions)],
  );

  const pending = useObservableState(pendingObserver, false);
  const enabled = useObservableState(enabledObserver, initialState ?? !!track?.isEnabled);

  React.useEffect(() => {
    onChange?.(enabled, userInteractionRef.current);
    userInteractionRef.current = false;
  }, [enabled, onChange]);

  React.useEffect(() => {
    if (initialState !== undefined) {
      log.debug('forcing initial toggle state', source, initialState);
      toggle(initialState);
    }
    // only execute once at the beginning
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const newProps = React.useMemo(() => mergeProps(rest, { className }), [rest, className]);

  const clickHandler: React.MouseEventHandler<HTMLButtonElement> = React.useCallback(
    (evt) => {
      userInteractionRef.current = true;
      toggle().finally(() => (userInteractionRef.current = false));
      rest.onClick?.(evt);
    },
    [rest, toggle],
  );






  console.log("enabled", enabled);
  localStorage.setItem("track", enabled);

  return {
    toggle,
    enabled,
    pending,
    track,
    buttonProps: {
      ...newProps,
      'aria-pressed': enabled,
      'data-lk-source': source,
      'data-lk-enabled': enabled,
      disabled: pending,
      onClick: clickHandler,
    } as React.ButtonHTMLAttributes<HTMLButtonElement>,
  };
}
