export type Orientation = 'axial' | 'sagittal' | 'coronal';

export interface NiftiHeaderSummary {
  dimensions: [number, number, number];
  voxelSpacing: [number, number, number];
  datatypeCode: number;
  littleEndian: boolean;
  description?: string;
}

export interface VolumeData {
  id: string;
  dimensions: [number, number, number];
  voxelSpacing: [number, number, number];
  voxelData: Float32Array;
  min: number;
  max: number;
  sourceFileName: string;
}

export interface SegmentationData {
  id: string;
  dimensions: [number, number, number];
  mask: Uint8Array;
  color: [number, number, number, number];
}

export interface Windowing {
  center: number;
  width: number;
}

export interface SliceState {
  axial: number;
  sagittal: number;
  coronal: number;
}
