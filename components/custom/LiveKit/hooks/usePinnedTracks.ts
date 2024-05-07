import type { TrackReferenceOrPlaceholder } from '@livekit/components-core';
import * as React from 'react';
import type { LayoutContextType } from '../utils';
import { useEnsureLayoutContext } from '../utils';

/**
 * The `usePinnedTracks` hook returns a array of the pinned tracks of the current room.
 * @remarks
 * To function properly, this hook must be called within a `LayoutContext`.
 * @example
 * ```tsx
 * const pinnedTracks = usePinnedTracks();
 * ```
 * @public
 */
export function usePinnedTracks(layoutContext?: LayoutContextType, tracks?: TrackReferenceOrPlaceholder[], remotePinEmail?: string, selfPinEmail?: string): TrackReferenceOrPlaceholder[] {
  layoutContext = useEnsureLayoutContext(layoutContext);
  return React.useMemo(() => {
    if (remotePinEmail === "no_email" && selfPinEmail !== "no_self" && tracks !== undefined && tracks?.length >= 1) {
      const screenSharePinTrack = tracks.find(tr => tr.participant.identity === selfPinEmail && tr.source === "screen_share");
      if(screenSharePinTrack) return [screenSharePinTrack];
      const filterTrack = tracks.find(tr => tr.participant.identity === selfPinEmail);
      if(filterTrack) return [filterTrack];
    }
    if(remotePinEmail !== "no_email" && tracks !== undefined && tracks?.length >= 1) {
      const screenSharePinTrack = tracks.find(tr => tr.participant.identity === remotePinEmail && tr.source === "screen_share");
      if(screenSharePinTrack) return [screenSharePinTrack];
      const filterTrack = tracks.find(tr => tr.participant.identity === remotePinEmail);
      if(filterTrack) return [filterTrack];
    }
    return [];
  }, [tracks, remotePinEmail, selfPinEmail]);
}
