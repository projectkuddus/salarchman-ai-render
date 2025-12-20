
/**
 * Compresses a base64 image string by resizing it and adjusting quality.
 * @param base64Str The input base64 image string.
 * @param maxWidth The maximum width of the output image. Defaults to 1536.
 * @param quality The quality of the output image (0 to 1). Defaults to 0.7.
 * @returns A promise that resolves to the compressed base64 image string.
 */
export const compressImage = (base64Str: string, maxWidth: number = 1536, quality: number = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = base64Str;
        img.onload = () => {
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject(new Error('Could not get canvas context'));
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            // Determine format based on input or default to jpeg for better compression
            // If the input was PNG, we might want to keep it PNG if transparency is needed,
            // but for this use case (architectural renders), JPEG is usually fine and compresses better.
            // However, let's stick to the original format if possible, or default to jpeg if it's huge.
            // For safety and size, we'll force JPEG as it's more predictable for size reduction.
            const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedBase64);
        };
        img.onerror = (error) => reject(error);
    });
};
