/**
 * Safely parse Google Drive file URL and generate an embeddable preview URL.
 * Handles formats:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/file/d/FILE_ID/view
 * - https://drive.google.com/file/d/FILE_ID
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 * - https://docs.google.com/file/d/FILE_ID/edit
 * - Raw file ID
 */
export function parseGoogleDriveUrl(url: string | undefined | null): {
  isValid: boolean;
  fileId: string | null;
  embedUrl: string | null;
  errorMessage?: string;
} {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return { isValid: false, fileId: null, embedUrl: null };
  }

  const cleanUrl = url.trim();

  // Pattern 1: /file/d/ID/ or /file/d/ID
  const fileDMatch = cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    const fileId = fileDMatch[1];
    return {
      isValid: true,
      fileId,
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
    };
  }

  // Pattern 2: id=ID query param
  const idQueryMatch = cleanUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idQueryMatch && idQueryMatch[1]) {
    const fileId = idQueryMatch[1];
    return {
      isValid: true,
      fileId,
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
    };
  }

  // Pattern 3: Pure file ID (alphanumeric, underscores, hyphens, length >= 20)
  if (/^[a-zA-Z0-9_-]{20,50}$/.test(cleanUrl)) {
    return {
      isValid: true,
      fileId: cleanUrl,
      embedUrl: `https://drive.google.com/file/d/${cleanUrl}/preview`,
    };
  }

  return {
    isValid: false,
    fileId: null,
    embedUrl: null,
    errorMessage: '無法辨識 Google Drive 影片網址，請確認分享連結是否正確（例如 https://drive.google.com/file/d/ID/view）',
  };
}
