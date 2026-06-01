import imageCompression from "browser-image-compression";

export async function compressImage(file: File): Promise<Blob> {
  const compressed = await imageCompression(file, {
    maxSizeMB: 0.35,
    maxWidthOrHeight: 800,
    useWebWorker: true,
    fileType: "image/jpeg",
  });
  return compressed;
}

export function blobToObjectUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}
