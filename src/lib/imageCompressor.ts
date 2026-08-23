/**
 * Client-side image compression using HTML5 Canvas.
 * - Resizes images to max 1200px (preserving aspect ratio)
 * - Converts to WebP format (or JPEG fallback)
 * - Reduces quality iteratively to fit under target size (400KB)
 * - Returns base64 Data URL or rejects with error
 */

export interface CompressionResult {
  dataUrl: string;
  sizeInBytes: number;
  sizeInKB: number;
  width: number;
  height: number;
}

const MAX_DIMENSION = 1200;
const MAX_ALLOWED_BYTES = 400 * 1024; // 400 KB

export function compressImageFile(file: File): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('請選擇有效的圖片檔案 (JPG, PNG, WebP)'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('讀取圖片檔案失敗'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('解析圖片失敗'));
      img.onload = () => {
        try {
          let { width, height } = img;

          // Scale down proportionally if larger than MAX_DIMENSION
          if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
            if (width > height) {
              height = Math.round((height * MAX_DIMENSION) / width);
              width = MAX_DIMENSION;
            } else {
              width = Math.round((width * MAX_DIMENSION) / height);
              height = MAX_DIMENSION;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            return reject(new Error('無法初始化畫布進行圖片處理'));
          }

          // Smooth rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Try WebP first, then reduce quality if needed
          let quality = 0.82;
          let mimeType = 'image/webp';
          let dataUrl = canvas.toDataURL(mimeType, quality);

          // If browser doesn't support WebP export properly, fallback to image/jpeg
          if (!dataUrl.startsWith('data:image/webp')) {
            mimeType = 'image/jpeg';
            dataUrl = canvas.toDataURL(mimeType, quality);
          }

          // Calculate approximate byte size of base64
          let byteSize = Math.round((dataUrl.length * 3) / 4);

          // If over 400KB, try reducing quality
          if (byteSize > MAX_ALLOWED_BYTES && quality > 0.5) {
            quality = 0.65;
            dataUrl = canvas.toDataURL(mimeType, quality);
            byteSize = Math.round((dataUrl.length * 3) / 4);
          }

          if (byteSize > MAX_ALLOWED_BYTES && quality > 0.4) {
            quality = 0.45;
            dataUrl = canvas.toDataURL(mimeType, quality);
            byteSize = Math.round((dataUrl.length * 3) / 4);
          }

          // Strict limit check (400KB)
          if (byteSize > MAX_ALLOWED_BYTES) {
            return reject(
              new Error('圖片檔案太大，壓縮後仍超過 400KB，請選擇解析度較小或檔案較小的圖片。')
            );
          }

          resolve({
            dataUrl,
            sizeInBytes: byteSize,
            sizeInKB: Math.round(byteSize / 1024),
            width,
            height,
          });
        } catch (err) {
          reject(new Error(`圖片壓縮處理失敗: ${(err as Error).message}`));
        }
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
