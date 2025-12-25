/**
 * Service to apply watermarks to images using HTML5 Canvas
 */
export const watermarkService = {
    /**
     * Applies a watermark to a base64 image
     * @param base64Image The original image in base64 format
     * @param text The watermark text (default: "renderman.ai")
     * @returns Promise resolving to the watermarked image as base64 string
     */
    applyWatermark: (base64Image: string, text: string = "renderman.ai"): Promise<string> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    reject(new Error('Could not get canvas context'));
                    return;
                }

                // Set canvas dimensions to match image
                canvas.width = img.width;
                canvas.height = img.height;

                // Draw original image
                ctx.drawImage(img, 0, 0);

                // Configure watermark style
                const fontSize = Math.max(16, Math.floor(img.height * 0.03)); // Responsive font size
                ctx.font = `bold ${fontSize}px Inter, sans-serif`;
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; // White text
                ctx.textAlign = 'right';
                ctx.textBaseline = 'bottom';

                // Add shadow for better visibility on light backgrounds
                ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
                ctx.shadowBlur = 4;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;

                // Position watermark (bottom right with padding)
                const padding = Math.floor(img.height * 0.02);
                const x = canvas.width - padding;
                const y = canvas.height - padding;

                // Draw text
                ctx.fillText(text, x, y);

                // Return as base64
                resolve(canvas.toDataURL('image/png'));
            };

            img.onerror = (err) => {
                reject(err);
            };

            img.src = base64Image;
        });
    }
};
