import type { NiftiWorkerRequest, NiftiWorkerResponse } from '@/types/worker';

export const parseNiftiWithWorker = async (file: File): Promise<NiftiWorkerResponse> => {
  const buffer = await file.arrayBuffer();

  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('@/workers/niftiParser.worker.ts', import.meta.url));

    const cleanup = () => {
      worker.terminate();
    };

    worker.onmessage = (event: MessageEvent<NiftiWorkerResponse>) => {
      cleanup();
      resolve(event.data);
    };

    worker.onerror = (event) => {
      cleanup();
      reject(new Error(event.message || 'Worker execution failed'));
    };

    const message: NiftiWorkerRequest = {
      type: 'PARSE_NIFTI',
      payload: { fileName: file.name, buffer },
    };

    worker.postMessage(message, [buffer]);
  });
};
