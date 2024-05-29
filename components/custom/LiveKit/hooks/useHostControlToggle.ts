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

export function useHostControlToggle({ props }: UseChatToggleProps) {
    const { className } = React.useMemo(() => setupChatToggle(), []);
    const [isOpen, setIsOpen] = React.useState(false)
    const dispatch = useDispatch()
    const { isHostControlOpen } = useSelector((state: any) => state.participant);
    const { dispatch: dispatchChat } = useLayoutContext().widget;

    const mergedProps = React.useMemo(() => {
        return mergeProps(props, {
            className,
            onClick: () => {
                dispatch(setEventStore(false))
                dispatch(setIsChatOpen(false))
                if (dispatchChat) dispatchChat({ msg: 'hide_chat' });
                setIsOpen(prev => !prev)
            },
            'aria-pressed': isHostControlOpen ? 'true' : 'false',
        });
    }, [props, className]);

    React.useEffect(() => {
        dispatch(setIsHostControlOpen(isOpen))
    }, [isOpen])

    React.useEffect(() => {
        setIsOpen(isHostControlOpen)
    }, [isHostControlOpen])

    return { mergedProps, isOpen };
}
