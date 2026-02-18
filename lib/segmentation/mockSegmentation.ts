import { v4 as uuid } from 'uuid';
import type { SegmentationData, VolumeData } from '@/types/viewer';

export const buildMockSegmentation = (volume: VolumeData): SegmentationData => {
  const [xDim, yDim, zDim] = volume.dimensions;
  const mask = new Uint8Array(volume.voxelData.length);

  const cx = xDim / 2;
  const cy = yDim / 2;
  const cz = zDim / 2;
  const rx = Math.max(2, xDim * 0.12);
  const ry = Math.max(2, yDim * 0.1);
  const rz = Math.max(2, zDim * 0.15);

  for (let z = 0; z < zDim; z += 1) {
    for (let y = 0; y < yDim; y += 1) {
      for (let x = 0; x < xDim; x += 1) {
        const dx = (x - cx) / rx;
        const dy = (y - cy) / ry;
        const dz = (z - cz) / rz;
        if (dx * dx + dy * dy + dz * dz <= 1) {
          const idx = z * xDim * yDim + y * xDim + x;
          mask[idx] = 1;
        }
      }
    }
  }

  return {
    id: uuid(),
    dimensions: volume.dimensions,
    mask,
    color: [255, 64, 96, 180],
  };
};

export const calculateSegmentationStats = (segmentation: SegmentationData | null): { voxels: number; ratio: number } => {
  if (!segmentation) return { voxels: 0, ratio: 0 };
  let voxels = 0;
  for (let i = 0; i < segmentation.mask.length; i += 1) {
    if (segmentation.mask[i] > 0) voxels += 1;
  }
  return {
    voxels,
    ratio: voxels / Math.max(segmentation.mask.length, 1),
  };
};
