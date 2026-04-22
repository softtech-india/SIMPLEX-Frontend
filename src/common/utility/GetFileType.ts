export const getFileType = (filePath: string) => {
  const sanitizedPath = filePath.trim().split(/[?#]/)[0];
  const ext = sanitizedPath.split('.').pop()?.toLowerCase();
  if (!ext) return 'unknown';
  if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return 'image';
  if (ext === 'pdf') return 'pdf';
  return 'other';
};