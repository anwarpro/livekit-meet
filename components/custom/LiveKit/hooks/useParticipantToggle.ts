import { setupChatToggle } from '@livekit/components-core';
import { mergeProps } from '../mergeProps';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { setEventStore, setIsChatOpen, setIsHostControlOpen } from '../../../../lib/Slicers/toggleSlice';
import { useSelector } from 'react-redux';
import { useLayoutContext } from '@livekit/components-react';

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
  const { dispatch: dispatchChat } = useLayoutContext().widget;

  const mergedProps = React.useMemo(() => {
    return mergeProps(props, {
      className,
      onClick: () => {
        dispatch(setIsHostControlOpen(false))
        dispatch(setIsChatOpen(false))
        if (dispatchChat) dispatchChat({ msg: 'hide_chat' });
        setIsOpen(prev => !prev)
      },
      'aria-pressed': isParticipantModalOpen ? 'true' : 'false',
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
