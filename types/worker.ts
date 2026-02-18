import type { NiftiHeaderSummary, VolumeData } from '@/types/viewer';

export interface NiftiParseRequest {
  type: 'PARSE_NIFTI';
  payload: {
    fileName: string;
    buffer: ArrayBuffer;
  };
}

export interface NiftiParseSuccess {
  type: 'PARSE_SUCCESS';
  payload: {
    volume: VolumeData;
    metadata: NiftiHeaderSummary;
  };
}

export interface NiftiParseError {
  type: 'PARSE_ERROR';
  payload: {
    message: string;
  };
}

export type NiftiWorkerRequest = NiftiParseRequest;
export type NiftiWorkerResponse = NiftiParseSuccess | NiftiParseError;
