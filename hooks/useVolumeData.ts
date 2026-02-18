'use client';

import { useViewerStore } from '@/store/viewerStore';

export const useVolumeData = () => {
  return useViewerStore((state) => ({
    volume: state.volume,
    metadata: state.metadata,
    segmentation: state.segmentation,
    showSegmentation: state.showSegmentation,
    slices: state.slices,
    zoom: state.zoom,
    windowing: state.windowing,
    isLoading: state.isLoading,
    error: state.error,
  }));
};
