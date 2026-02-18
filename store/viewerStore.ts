import { create } from 'zustand';
import type { NiftiHeaderSummary, Orientation, SegmentationData, SliceState, VolumeData, Windowing } from '@/types/viewer';

interface ViewerStoreState {
  volume: VolumeData | null;
  metadata: NiftiHeaderSummary | null;
  segmentation: SegmentationData | null;
  showSegmentation: boolean;
  slices: SliceState;
  zoom: number;
  windowing: Windowing;
  isLoading: boolean;
  error: string | null;
  setVolume: (volume: VolumeData, metadata: NiftiHeaderSummary) => void;
  setSegmentation: (segmentation: SegmentationData | null) => void;
  setSlice: (orientation: Orientation, value: number) => void;
  setWindowing: (windowing: Partial<Windowing>) => void;
  setZoom: (zoom: number) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleSegmentation: () => void;
  reset: () => void;
}

const defaultSlices: SliceState = {
  axial: 0,
  sagittal: 0,
  coronal: 0,
};

export const useViewerStore = create<ViewerStoreState>((set) => ({
  volume: null,
  metadata: null,
  segmentation: null,
  showSegmentation: true,
  slices: defaultSlices,
  zoom: 1,
  windowing: { center: 40, width: 400 },
  isLoading: false,
  error: null,
  setVolume: (volume, metadata) =>
    set({
      volume,
      metadata,
      slices: {
        axial: Math.floor(volume.dimensions[2] / 2),
        sagittal: Math.floor(volume.dimensions[0] / 2),
        coronal: Math.floor(volume.dimensions[1] / 2),
      },
      windowing: {
        center: (volume.max + volume.min) / 2,
        width: Math.max(volume.max - volume.min, 1),
      },
      error: null,
    }),
  setSegmentation: (segmentation) => set({ segmentation }),
  setSlice: (orientation, value) =>
    set((state) => ({
      slices: {
        ...state.slices,
        [orientation]: Math.max(0, Math.floor(value)),
      },
    })),
  setWindowing: (windowing) =>
    set((state) => ({ windowing: { ...state.windowing, ...windowing } })),
  setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(zoom, 6)) }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  toggleSegmentation: () => set((state) => ({ showSegmentation: !state.showSegmentation })),
  reset: () =>
    set({
      volume: null,
      metadata: null,
      segmentation: null,
      showSegmentation: true,
      slices: defaultSlices,
      zoom: 1,
      windowing: { center: 40, width: 400 },
      isLoading: false,
      error: null,
    }),
}));
