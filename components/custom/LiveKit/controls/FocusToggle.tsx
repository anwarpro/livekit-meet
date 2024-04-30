import * as React from 'react';
import { FocusToggleIcon, UnfocusToggleIcon } from '../assets/icons';
// import { useFocusToggle } from '../hooks';
import type { TrackReferenceOrPlaceholder } from '@livekit/components-core';
import {
  LayoutContext,
  useFocusToggle,
  // useFocusToggle,
  // useMaybeRoomContext,
  useMaybeTrackRefContext,
  // useParticipants,
} from '@livekit/components-react';
// import { useSelector } from 'react-redux';
// import { RoomEvent } from 'livekit-client';

/** @public */
export interface FocusToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  trackRef?: TrackReferenceOrPlaceholder;
}

/**
 * The `FocusToggle` puts the `ParticipantTile` in focus or removes it from focus.
 * @remarks
 * This component needs to live inside `LayoutContext` to work properly.
 *
 * @example
 * ```tsx
 * <ParticipantTile>
 *   <FocusToggle />
 * </ParticipantTile>
 * ```
 * @public
 */
export const FocusToggle = /* @__PURE__ */ React.forwardRef<HTMLButtonElement, FocusToggleProps>(
  function FocusToggle({ trackRef, ...props }: FocusToggleProps, ref) {
    const trackRefFromContext = useMaybeTrackRefContext();
    const { mergedProps, inFocus } = useFocusToggle({
      trackRef: trackRef ?? trackRefFromContext,
      props,
    });

    // const room = useMaybeRoomContext();
    // const encoder = new TextEncoder();
    // const decoder = new TextDecoder();
    // const participants = useParticipants();
    // const { userData } = useSelector((state: any) => state.auth);
    // const data = encoder.encode(
    //   JSON.stringify({
    //     role: userData?.role,
    //     email: userData?.email,
    //     topic: 'pin_screen',
    //     value: inFocus,
    //   }),
    // );
    // React.useEffect(() => {
    //   if (room?.state === 'connected') {
    //     room.localParticipant.publishData(data, {
    //       reliable: true,
    //       destinationIdentities: participants?.map((par) => par.identity),
    //       topic: 'pin_screen',
    //     });
    //   }
    // }, [data, inFocus, participants, room]);

    return (
      <LayoutContext.Consumer>
        {(layoutContext) =>
          layoutContext !== undefined && (
            <button ref={ref} {...mergedProps}>
              {props.children ? (
                props.children
              ) : inFocus ? (
                <UnfocusToggleIcon />
              ) : (
                <FocusToggleIcon />
              )}
            </button>
          )
        }
      </LayoutContext.Consumer>
    );
  },
);
