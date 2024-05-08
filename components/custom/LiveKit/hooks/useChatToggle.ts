import { setupChatToggle } from '@livekit/components-core';
import { mergeProps } from '../mergeProps';
import * as React from 'react';
import { useLayoutContext } from '@livekit/components-react';
import { useDispatch } from 'react-redux';
import { setEventStore, setIsChatOpen } from '../../../../lib/Slicers/toggleSlice';
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
export function useChatToggle({ props }: UseChatToggleProps) {
    const { dispatch, state } = useLayoutContext().widget;
    const { className } = React.useMemo(() => setupChatToggle(), []);
    const dispatchParticipant = useDispatch();
    const { isChatOpen } = useSelector((state: any) => state.participant);
    const mergedProps = React.useMemo(() => {
        return mergeProps(props, {
            className,
            onClick: () => {
                dispatchParticipant(setEventStore(false))
                if (isChatOpen) {
                    dispatchParticipant(setIsChatOpen(false))
                } else {
                    dispatchParticipant(setIsChatOpen(true))
                }
                if (dispatch) dispatch({ msg: 'toggle_chat' });
            },
            'aria-pressed': state?.showChat ? 'true' : 'false',
            'data-lk-unread-msgs': state
                ? state.unreadMessages < 10
                    ? state.unreadMessages.toFixed(0)
                    : '9+'
                : '0',
        });
    }, [props, className, dispatch, state]);

    return { mergedProps };
}
