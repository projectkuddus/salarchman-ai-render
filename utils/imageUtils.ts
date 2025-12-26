
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

/**
 * Pads an image to match a target aspect ratio by adding white bars (letterboxing/pillarboxing).
 * @param base64Str The input base64 image string.
 * @param aspectRatioStr The target aspect ratio string (e.g., "16:9", "4:3", "1:1").
 * @returns A promise that resolves to the padded base64 image string.
 */
export const padImageToAspectRatio = (base64Str: string, aspectRatioStr: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        // Parse aspect ratio
        const parts = aspectRatioStr.split(':');
        if (parts.length !== 2) {
            // If invalid format (e.g. "Similar to Input"), just return original
            resolve(base64Str);
            return;
        }

        const targetRatio = parseFloat(parts[0]) / parseFloat(parts[1]);
        if (isNaN(targetRatio)) {
            resolve(base64Str);
            return;
        }

        const img = new Image();
        img.src = base64Str;
        img.onload = () => {
            const currentRatio = img.width / img.height;

            // If ratios are very close, no need to pad
            if (Math.abs(currentRatio - targetRatio) < 0.01) {
                resolve(base64Str);
                return;
            }

            let newWidth = img.width;
            let newHeight = img.height;
            let offsetX = 0;
            let offsetY = 0;

            if (currentRatio > targetRatio) {
                // Image is wider than target -> Letterbox (add height)
                newHeight = Math.round(img.width / targetRatio);
                offsetY = Math.round((newHeight - img.height) / 2);
            } else {
                // Image is taller than target -> Pillarbox (add width)
                newWidth = Math.round(img.height * targetRatio);
                offsetX = Math.round((newWidth - img.width) / 2);
            }

            const canvas = document.createElement('canvas');
            canvas.width = newWidth;
            canvas.height = newHeight;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject(new Error('Could not get canvas context'));
                return;
            }

            // Fill with white background
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, newWidth, newHeight);

            // Draw image centered
            ctx.drawImage(img, offsetX, offsetY);

            // Return as PNG to preserve quality before final compression
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = (error) => reject(error);
    });
};
