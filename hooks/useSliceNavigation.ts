'use client';

import { useMemo } from 'react';
import type { Orientation } from '@/types/viewer';
import { useViewerStore } from '@/store/viewerStore';

export const useSliceNavigation = (orientation: Orientation) => {
  const volume = useViewerStore((state) => state.volume);
  const slice = useViewerStore((state) => state.slices[orientation]);
  const setSlice = useViewerStore((state) => state.setSlice);

  const maxSlice = useMemo(() => {
    if (!volume) return 0;
    if (orientation === 'axial') return volume.dimensions[2] - 1;
    if (orientation === 'sagittal') return volume.dimensions[0] - 1;
    return volume.dimensions[1] - 1;
  }, [orientation, volume]);

  return {
    slice,
    maxSlice,
    setSlice: (value: number) => setSlice(orientation, Math.min(Math.max(value, 0), maxSlice)),
  };
};
