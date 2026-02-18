const MAX_SIZE_BYTES = 1024 * 1024 * 1024;

export const validateNiftiFile = (file: File): string | null => {
  const validExtension = /\.nii(\.gz)?$/i.test(file.name);

  if (!validExtension) {
    return 'Unsupported file type. Please upload .nii or .nii.gz';
  }

  if (file.size === 0) {
    return 'Cannot load an empty file.';
  }

  if (file.size > MAX_SIZE_BYTES) {
    return 'File exceeds 1GB safety limit for browser processing.';
  }

  return null;
};
