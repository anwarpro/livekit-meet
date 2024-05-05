import * as React from 'react';
import { mergeProps } from '../utils';
import type { TrackReferenceOrPlaceholder } from '@livekit/components-core';
import { ParticipantTile } from '../participant/ParticipantTile';
import type { ParticipantClickEvent } from '@livekit/components-core';

/** @public */
export interface FocusLayoutContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * The `FocusLayoutContainer` is a layout component that expects two children:
 * A small side component: In a video conference, this is usually a carousel of participants
 * who are not in focus. And a larger main component to display the focused participant.
 * For example, with the `FocusLayout` component.
 *  @public
 */
export function FocusLayoutContainer(props: FocusLayoutContainerProps) {
  const elementProps = mergeProps(props, { className: 'lk-focus-layout' });

  return <div {...elementProps}>{props.children}</div>;
}

/** @public */
export interface FocusLayoutProps extends React.HTMLAttributes<HTMLElement> {
  /** The track to display in the focus layout. */
  trackRef?: TrackReferenceOrPlaceholder;
  room: any;
  remotePinEmail: string;
  selfPinEmail: string;
  setRemotePinEmail: React.Dispatch<React.SetStateAction<string>>;
  setSelfPinEmail: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * The `FocusLayout` component is just a light wrapper around the `ParticipantTile` to display a single participant.
 * @public
 */
export function FocusLayout({
  trackRef,
  room,
  remotePinEmail,
  setRemotePinEmail,
  selfPinEmail,
  setSelfPinEmail,
  ...htmlProps
}: FocusLayoutProps) {
  return (
    <ParticipantTile
      room={room}
      remotePinEmail={remotePinEmail} setRemotePinEmail={setRemotePinEmail} selfPinEmail={selfPinEmail} setSelfPinEmail={setSelfPinEmail}
      trackRef={trackRef}
      {...htmlProps}
    />
  );
}
