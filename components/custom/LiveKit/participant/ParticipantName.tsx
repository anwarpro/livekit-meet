import * as React from 'react';
import { setupParticipantName } from '@livekit/components-core';
import { UseParticipantInfoOptions, useEnsureParticipant } from '@livekit/components-react';
import { mergeProps } from '../mergeProps';
import { useObservableState } from '../hooks/useObservableState';

/** @public */
export interface ParticipantNameProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    UseParticipantInfoOptions {}

/**
 * The `ParticipantName` component displays the name of the participant as a string within an HTML span element.
 * If no participant name is undefined the participant identity string is displayed.
 *
 * @example
 * ```tsx
 * <ParticipantName />
 * ```
 * @public
 */
export const ParticipantName = /* @__PURE__ */ React.forwardRef<
  HTMLSpanElement,
  ParticipantNameProps
>(function ParticipantName({ participant, ...props }: ParticipantNameProps, ref) {
  const p = useEnsureParticipant(participant);

  const { className, infoObserver } = React.useMemo(() => {
    return setupParticipantName(p);
  }, [p]);

  const { identity, name, metadata } = useObservableState(infoObserver, {
    name: p.name,
    identity: p.identity,
    metadata: p.metadata,
  });

  const mergedProps = React.useMemo(() => {
    return mergeProps(props, { className, 'data-lk-participant-name': name });
  }, [props, className, name]);

  return (
    <span ref={ref} {...mergedProps}>
      {name !== '' ? name : identity}
      {props.children}
    </span>
  );
});
