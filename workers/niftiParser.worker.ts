/// <reference lib="webworker" />

import * as nifti from 'nifti-reader-js';
import { v4 as uuid } from 'uuid';
import type { NiftiWorkerRequest, NiftiWorkerResponse } from '@/types/worker';
import type { NiftiHeaderSummary } from '@/types/viewer';

const toFloatArray = (header: nifti.NIFTI1 | nifti.NIFTI2, image: ArrayBuffer): Float32Array => {
  const typed = nifti.Utils.convertToTypedArray(header, image);
  if (typed instanceof Float32Array) {
    return typed;
  }
  return Float32Array.from(typed as ArrayLike<number>);
};

const handleParse = (fileName: string, buffer: ArrayBuffer): NiftiWorkerResponse => {
  let source = buffer;
  if (nifti.isCompressed(source)) {
    source = nifti.decompress(source);
  }
  if (!nifti.isNIFTI(source)) {
    return { type: 'PARSE_ERROR', payload: { message: 'Selected file is not a valid NIfTI file.' } };
  }

  const header = nifti.readHeader(source);
  if (!header) {
    return { type: 'PARSE_ERROR', payload: { message: 'Failed to read NIfTI header.' } };
  }

  const image = nifti.readImage(header, source);
  const voxelData = toFloatArray(header, image);

  const dimX = header.dims[1] || 1;
  const dimY = header.dims[2] || 1;
  const dimZ = header.dims[3] || 1;

  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;

  for (let i = 0; i < voxelData.length; i += 1) {
    const val = voxelData[i];
    if (val < min) min = val;
    if (val > max) max = val;
  }

  const metadata: NiftiHeaderSummary = {
    dimensions: [dimX, dimY, dimZ],
    voxelSpacing: [header.pixDims[1] || 1, header.pixDims[2] || 1, header.pixDims[3] || 1],
    datatypeCode: header.datatypeCode,
    littleEndian: header.littleEndian,
    description: header.description,
  };

  return {
    type: 'PARSE_SUCCESS',
    payload: {
      metadata,
      volume: {
        id: uuid(),
        dimensions: metadata.dimensions,
        voxelSpacing: metadata.voxelSpacing,
        voxelData,
        min,
        max,
        sourceFileName: fileName,
      },
    },
  };
};

self.onmessage = (event: MessageEvent<NiftiWorkerRequest>) => {
  try {
    if (event.data.type !== 'PARSE_NIFTI') return;

    const { fileName, buffer } = event.data.payload;
    const response = handleParse(fileName, buffer);

    if (response.type === 'PARSE_SUCCESS') {
      self.postMessage(response, [response.payload.volume.voxelData.buffer]);
      return;
    }

    self.postMessage(response);
  } catch (error) {
    self.postMessage({
      type: 'PARSE_ERROR',
      payload: { message: error instanceof Error ? error.message : 'Unexpected parser failure' },
    } satisfies NiftiWorkerResponse);
  }
};
