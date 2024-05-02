import * as React from 'react';
import { mergeProps as mergePropsReactAria } from './mergeProps';
import { log, PinState, TrackReferenceOrPlaceholder, WidgetState } from '@livekit/components-core';


/** @internal */
export function isProp<U extends HTMLElement, T extends React.HTMLAttributes<U>>(
  prop: T | undefined,
): prop is T {
  return prop !== undefined;
}

/** @internal */
export function mergeProps<
  U extends HTMLElement,
  T extends Array<React.HTMLAttributes<U> | undefined>,
>(...props: T) {
  return mergePropsReactAria(...props.filter(isProp));
}

/** @internal */
export function cloneSingleChild(
  children: React.ReactNode | React.ReactNode[],
  props?: Record<string, any>,
  key?: any,
) {
  return React.Children.map(children, (child) => {
    // Checking isValidElement is the safe way and avoids a typescript
    // error too.
    if (React.isValidElement(child) && React.Children.only(children)) {
      return React.cloneElement(child, { ...props, key });
    }
    return child;
  });
}

/**
 * @internal
 */
export function warnAboutMissingStyles(el?: HTMLElement) {
  if (
    typeof window !== 'undefined' &&
    typeof process !== 'undefined' &&
    (process?.env?.NEXT_PUBLIC_ENVIRONMENT === 'uat' ||
      process?.env?.NEXT_PUBLIC_ENVIRONMENT === 'development')
  ) {
    const target = el ?? document.querySelector('.lk-room-container');
    if (target && !getComputedStyle(target).getPropertyValue('--lk-has-imported-styles')) {
      log.warn(
        "It looks like you're not using the `@livekit/components-styles package`. To render the UI with the default styling, please import it in your layout or page.",
      );
    }
  }
}

/**
 * @internal
 */
export class Mutex {
  private _locking: Promise<void>;

  private _locks: number;

  constructor() {
    this._locking = Promise.resolve();
    this._locks = 0;
  }

  isLocked() {
    return this._locks > 0;
  }

  lock() {
    this._locks += 1;

    let unlockNext: () => void;

    const willLock = new Promise<void>(
      (resolve) =>
      (unlockNext = () => {
        this._locks -= 1;
        resolve();
      }),
    );

    const willUnlock = this._locking.then(() => unlockNext);

    this._locking = this._locking.then(() => willLock);

    return willUnlock;
  }
}
/** @internal */
export type PinAction =
  | {
      msg: 'set_pin';
      trackReference: TrackReferenceOrPlaceholder;
    }
  | { msg: 'clear_pin' };

/** @internal */
export type PinContextType = {
  dispatch?: React.Dispatch<PinAction>;
  state?: PinState;
};


/** @internal */
export type ChatContextAction =
  | { msg: 'show_chat' }
  | { msg: 'hide_chat' }
  | { msg: 'toggle_chat' }
  | { msg: 'unread_msg'; count: number }
  | { msg: 'toggle_settings' };


/** @internal */
export type WidgetContextType = {
  dispatch?: React.Dispatch<ChatContextAction>;
  state?: WidgetState;
};

/** @public */
export type LayoutContextType = {
  pin: PinContextType;
  widget: WidgetContextType;
};

export function useEnsureLayoutContext(layoutContext?: LayoutContextType) {
  const layout = useMaybeLayoutContext();
  layoutContext ??= layout;
  if (!layoutContext) {
    throw Error('Tried to access LayoutContext context outside a LayoutContextProvider provider.');
  }
  return layoutContext;
}

/** @public */
export const LayoutContext = React.createContext<LayoutContextType | undefined>(undefined);

export function useMaybeLayoutContext(): LayoutContextType | undefined {
  return React.useContext(LayoutContext);
}