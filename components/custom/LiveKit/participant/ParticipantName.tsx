import * as React from 'react';
import { setupParticipantName } from '@livekit/components-core';
import { UseParticipantInfoOptions, useEnsureParticipant } from '@livekit/components-react';
import { mergeProps } from '../mergeProps';
import { useObservableState } from '../hooks/useObservableState';
import { useSelector } from 'react-redux';
import BackHandIcon from '@mui/icons-material/BackHand';
import handRiseIcon from '../assets/icons/hand-rise.svg';
import Image from 'next/image';

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
  const { handRaised } = useSelector((state: any) => state.handRaise);

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
      {handRaised?.some((hData:any)=> hData?.email === p.identity) && (
        // <BackHandIcon sx={{ fontSize: '1.3rem', color: 'orange', ml: 1 }} />
        <Image className='ms-2' src={handRiseIcon} height="24" width="24" alt="" />
      )}
      {props.children}
    </span>
  );
});
