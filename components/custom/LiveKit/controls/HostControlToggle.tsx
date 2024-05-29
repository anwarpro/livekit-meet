import * as React from 'react';
import { useChatToggle } from '../hooks/useChatToggle';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setIsHostControlOpen } from '../../../../lib/Slicers/toggleSlice';
import { useHostControlToggle } from '../hooks/useHostControlToggle';

/** @public */
export interface ChatToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const HostControlToggle = /* @__PURE__ */ React.forwardRef<
  HTMLButtonElement,
  ChatToggleProps
>(function ChatToggle(props: ChatToggleProps, ref) {
  const { mergedProps } = useHostControlToggle({ props });

  return (
    <button ref={ref} {...mergedProps}>
      {props.children}
    </button>
  );
});
