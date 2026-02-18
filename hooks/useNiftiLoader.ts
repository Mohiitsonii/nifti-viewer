'use client';

import { useCallback } from 'react';
import { parseNiftiWithWorker } from '@/lib/nifti/workerClient';
import { validateNiftiFile } from '@/lib/nifti/validation';
import { buildMockSegmentation } from '@/lib/segmentation/mockSegmentation';
import { useViewerStore } from '@/store/viewerStore';

export const useNiftiLoader = () => {
  const setIsLoading = useViewerStore((state) => state.setIsLoading);
  const setVolume = useViewerStore((state) => state.setVolume);
  const setError = useViewerStore((state) => state.setError);
  const setSegmentation = useViewerStore((state) => state.setSegmentation);

  const loadFile = useCallback(
    async (file: File) => {
      const validationError = validateNiftiFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await parseNiftiWithWorker(file);
        if (result.type === 'PARSE_ERROR') {
          setError(result.payload.message);
          return;
        }

        setVolume(result.payload.volume, result.payload.metadata);
        setSegmentation(buildMockSegmentation(result.payload.volume));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to parse volume');
      } finally {
        setIsLoading(false);
      }
    },
    [setError, setIsLoading, setSegmentation, setVolume],
  );

  return { loadFile };
};
