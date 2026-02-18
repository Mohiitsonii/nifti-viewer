import type { Orientation, VolumeData } from '@/types/viewer';

const getIndex = (x: number, y: number, z: number, width: number, height: number) => z * width * height + y * width + x;

export const getSliceDimensions = (volume: VolumeData, orientation: Orientation): [number, number] => {
  const [x, y, z] = volume.dimensions;
  switch (orientation) {
    case 'axial':
      return [x, y];
    case 'sagittal':
      return [y, z];
    case 'coronal':
      return [x, z];
    default:
      return [x, y];
  }
};

export const getSliceData = (volume: VolumeData, orientation: Orientation, sliceIndex: number): Float32Array => {
  const [xDim, yDim, zDim] = volume.dimensions;
  const [width, height] = getSliceDimensions(volume, orientation);
  const output = new Float32Array(width * height);

  let ptr = 0;
  for (let j = 0; j < height; j += 1) {
    for (let i = 0; i < width; i += 1) {
      if (orientation === 'axial') {
        output[ptr] = volume.voxelData[getIndex(i, j, Math.min(sliceIndex, zDim - 1), xDim, yDim)];
      } else if (orientation === 'sagittal') {
        output[ptr] = volume.voxelData[getIndex(Math.min(sliceIndex, xDim - 1), i, j, xDim, yDim)];
      } else {
        output[ptr] = volume.voxelData[getIndex(i, Math.min(sliceIndex, yDim - 1), j, xDim, yDim)];
      }
      ptr += 1;
    }
  }

  return output;
};
