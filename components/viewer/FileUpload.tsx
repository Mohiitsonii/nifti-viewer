'use client';

import { ChangeEvent } from 'react';
import { useNiftiLoader } from '@/hooks/useNiftiLoader';
import { useViewerStore } from '@/store/viewerStore';

export const FileUpload = () => {
  const { loadFile } = useNiftiLoader();
  const isLoading = useViewerStore((state) => state.isLoading);

  const onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await loadFile(file);
    event.target.value = '';
  };

  return (
    <label className="btn" aria-label="Upload NIfTI volume">
      {isLoading ? 'Loading...' : 'Upload NIfTI'}
      <input type="file" hidden accept=".nii,.nii.gz" onChange={onChange} disabled={isLoading} />
    </label>
  );
};
