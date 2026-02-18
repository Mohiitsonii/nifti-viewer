import cornerstone from 'cornerstone-core';
import type { Orientation, SegmentationData, Windowing } from '@/types/viewer';
import { getSliceData, getSliceDimensions } from '@/lib/nifti/slice';
import type { VolumeData } from '@/types/viewer';

const clamp = (value: number, low: number, high: number): number => Math.min(high, Math.max(low, value));

export const renderSliceToCanvas = (
  canvas: HTMLCanvasElement,
  volume: VolumeData,
  orientation: Orientation,
  slice: number,
  windowing: Windowing,
  segmentation: SegmentationData | null,
  showSegmentation: boolean,
): void => {
  const [width, height] = getSliceDimensions(volume, orientation);
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) return;

  // Cornerstone is initialized to keep compatibility for future stack rendering extensions.
  if (!cornerstone.getEnabledElements().find((el) => el.element === canvas)) {
    cornerstone.enable(canvas);
  }

  const imageData = context.createImageData(width, height);
  const sliceData = getSliceData(volume, orientation, slice);

  const wMin = windowing.center - windowing.width / 2;
  const wMax = windowing.center + windowing.width / 2;

  for (let i = 0; i < sliceData.length; i += 1) {
    const normalized = clamp((sliceData[i] - wMin) / (wMax - wMin), 0, 1);
    const gray = Math.round(normalized * 255);

    imageData.data[i * 4] = gray;
    imageData.data[i * 4 + 1] = gray;
    imageData.data[i * 4 + 2] = gray;
    imageData.data[i * 4 + 3] = 255;
  }

  if (segmentation && showSegmentation && segmentation.dimensions.join('x') === volume.dimensions.join('x')) {
    const segSlice = getSliceData(
      {
        ...volume,
        voxelData: Float32Array.from(segmentation.mask),
      },
      orientation,
      slice,
    );

    for (let i = 0; i < segSlice.length; i += 1) {
      if (segSlice[i] > 0) {
        imageData.data[i * 4] = segmentation.color[0];
        imageData.data[i * 4 + 1] = segmentation.color[1];
        imageData.data[i * 4 + 2] = segmentation.color[2];
        imageData.data[i * 4 + 3] = segmentation.color[3];
      }
    }
  }

  context.putImageData(imageData, 0, 0);
};
