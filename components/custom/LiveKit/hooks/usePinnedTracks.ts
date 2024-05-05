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
export function usePinnedTracks(layoutContext?: LayoutContextType, tracks?: TrackReferenceOrPlaceholder[], pinEmail?: string, isRemotePin?: string): TrackReferenceOrPlaceholder[] {
  console.log("🚀 ~ usePinnedTracks ~ pinEmail:", pinEmail)
  layoutContext = useEnsureLayoutContext(layoutContext);
  return React.useMemo(() => {
    if (isRemotePin === "self" && tracks !== undefined && tracks?.length >= 1 && pinEmail === "no_email") {
      const filterTrack = tracks.find(tr => tr.participant.identity === pinEmail);
      if (filterTrack) return [filterTrack];
    }
    else if (tracks !== undefined && tracks?.length >= 1) {
      const filterTrack = tracks.find(tr => tr.participant.identity === pinEmail);
      if (filterTrack) return [filterTrack];
    }
    return [];
  }, [isRemotePin, tracks, pinEmail]);
}
