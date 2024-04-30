import * as React from 'react';
import { useParticipantToggle } from '../hooks/useParticipantToggle';

/** @public */
export interface ChatToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * The `ChatToggle` component is a button that toggles the visibility of the `Chat` component.
 * @remarks
 * For the component to have any effect it has to live inside a `LayoutContext` context.
 *
 * @example
 * ```tsx
 * <LiveKitRoom>
 *   <ToggleChat />
 * </LiveKitRoom>
 * ```
 * @public
 */
export const ParticipantToggle = /* @__PURE__ */ React.forwardRef<
  HTMLButtonElement,
  ChatToggleProps
>(function ParticipantToggle(props: ChatToggleProps, ref) {
  const { mergedProps, isOpen } = useParticipantToggle({ props });

  return (
    <button ref={ref} {...mergedProps}>
      {props.children}
    </button>
  );
});
