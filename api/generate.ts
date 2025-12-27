
import { GoogleGenAI } from "@google/genai";

export const config = {
    runtime: 'nodejs', // Switch to Node.js for longer execution times
    maxDuration: 60, // Allow up to 60 seconds for generation
};

import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const {
            base64Image,
            styleName,
            styleInstruction,
            viewType,
            additionalPrompt,
            siteBase64Image,
            referenceBase64Images, // Changed from single to array
            aspectRatio,
            imageSize,
            selectedVerbs,
            ideationConfig,
            diagramType,
            createMode,
            atmospheres,
            elevationSide,
            additionalBaseImages
        } = req.body;

        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'Server configuration error: Missing API Key' });
        }

        const ai = new GoogleGenAI({ apiKey });

        const getMimeType = (dataUri: string) => {
            const match = dataUri.match(/^data:(image\/[a-zA-Z]+);base64,/);
            return match ? match[1] : 'image/png'; // Default to png if not found, but usually it will be there
        };

        const parts: any[] = [
            { text: additionalPrompt },
            {
                inlineData: {
                    data: base64Image.split(',')[1] || base64Image,
                    mimeType: getMimeType(base64Image),
                },
            }
        ];

        if (additionalBaseImages && Array.isArray(additionalBaseImages)) {
            additionalBaseImages.forEach((img: string) => {
                parts.push({
                    inlineData: {
                        data: img.split(',')[1] || img,
                        mimeType: getMimeType(img),
                    },
                });
            });
        }

        if (siteBase64Image) {
            parts.push({ inlineData: { data: siteBase64Image.split(',')[1] || siteBase64Image, mimeType: getMimeType(siteBase64Image) } });
        }

        if (referenceBase64Images && Array.isArray(referenceBase64Images)) {
            referenceBase64Images.forEach((img: string) => {
                parts.push({
                    inlineData: {
                        data: img.split(',')[1] || img,
                        mimeType: getMimeType(img),
                    },
                });
            });
        }

        if (req.body.material1Image) {
            parts.push({ inlineData: { data: req.body.material1Image.split(',')[1] || req.body.material1Image, mimeType: getMimeType(req.body.material1Image) } });
        }

        if (req.body.material2Image) {
            parts.push({ inlineData: { data: req.body.material2Image.split(',')[1] || req.body.material2Image, mimeType: getMimeType(req.body.material2Image) } });
        }

        const validAspectRatios = ['1:1', '2:3', '3:2', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9'];
        const finalAspectRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : undefined;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: { parts: parts },
            config: {
                imageConfig: { aspectRatio: finalAspectRatio, imageSize: imageSize }
            }
        });

        const partsResponse = response.candidates?.[0]?.content?.parts;
        let generatedImageBase64 = null;
        if (partsResponse) {
            for (const part of partsResponse) {
                if (part.inlineData && part.inlineData.data) {
                    generatedImageBase64 = part.inlineData.data;
                    break;
                }
            }
        }

        if (!generatedImageBase64) {
            throw new Error("No image data found in response.");
        }

        return res.status(200).json({
            image: `data:image/png;base64,${generatedImageBase64}`
        });

    } catch (error: any) {
        console.error("API Generation Error:", error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
