const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/mp4',
  'application/pdf',
];

export const MAX_FILE_SIZE = 50 * 1024 * 1024;

export const validateFile = (file) => {
  if (!file) return 'Please select a file.';
  if (file.size === 0) return 'The selected file is empty.';
  if (file.size > MAX_FILE_SIZE) return 'File too large. Maximum size is 50MB.';
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Invalid file type. Allowed: images, videos, audio, and PDFs.';
  }
  return null;
};

export const getFileTypeLabel = (type) => {
  const labels = { image: 'Image', video: 'Video', audio: 'Audio', pdf: 'PDF', other: 'File' };
  return labels[type] || 'File';
};
