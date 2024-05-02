import { setupChatToggle } from '@livekit/components-core';
import { mergeProps } from '../mergeProps';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { setEventStore } from '../../../../lib/Slicers/toggleSlice';
import { useSelector } from 'react-redux';

/** @public */
export interface UseChatToggleProps {
  props: React.ButtonHTMLAttributes<HTMLButtonElement>;
}

/**
 * The `useChatToggle` hook provides state and functions for toggling the chat window.
 * @remarks
 * Depends on the `LayoutContext` to work properly.
 * @see {@link ChatToggle}, {@link Chat}
 * @public
 */
export function useParticipantToggle({ props }: UseChatToggleProps) {
  const { className } = React.useMemo(() => setupChatToggle(), []);
  const [isOpen, setIsOpen] = React.useState(false)
  const dispatch = useDispatch()
  const { isParticipantModalOpen } = useSelector((state: any) => state?.participant);

  const mergedProps = React.useMemo(() => {
    return mergeProps(props, {
      className,
      onClick: () => {
        setIsOpen(prev => !prev)
      },
    });
  }, [props, className]);

  React.useEffect(() => {
    dispatch(setEventStore(isOpen))
  }, [isOpen])

  React.useEffect(() => {
    setIsOpen(isParticipantModalOpen)
  }, [isParticipantModalOpen])

  return { mergedProps, isOpen };
}
