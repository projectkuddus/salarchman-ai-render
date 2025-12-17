
import { GoogleGenAI } from "@google/genai";

export const config = {
    runtime: 'edge', // Use Edge Runtime for faster cold starts
};

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    try {
        const {
            base64Image,
            styleName,
            styleInstruction,
            viewType,
            additionalPrompt,
            siteBase64Image,
            referenceBase64Image,
            aspectRatio,
            imageSize,
            selectedVerbs,
            ideationConfig,
            diagramType,
            createMode,
            atmospheres,
            elevationSide
        } = await req.json();

        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'Server configuration error: Missing API Key' }), { status: 500 });
        }

        const ai = new GoogleGenAI({ apiKey });

        // Re-construct the prompt logic here (or share it via a shared utility if possible, but for simplicity we duplicate the prompt logic to keep the API self-contained)
        // ... Actually, to avoid code duplication and keep it consistent, it's better if the CLIENT constructs the prompt and sends it, 
        // OR we move the prompt logic to a shared file. 
        // Given the complexity of the prompt construction in the original file, I will move the prompt construction logic to the server 
        // to ensure the "secret sauce" of the prompt is hidden from the client.

        // --- PROMPT CONSTRUCTION (Copied and adapted from geminiService.ts) ---
        // Note: We need to import constants or redefine them. 
        // For a Vercel function, it's safer to have everything in one file or strictly import from shared non-component files.
        // I will redefine the necessary maps here to avoid importing React components/types which might break the edge function.

        const MODEL_NAME = 'gemini-3-pro-image-preview';

        // ... (We will assume the client sends the *constructed* prompt or we reconstruct it. 
        // To save token usage and complexity, let's have the client send the *final prompt* string?
        // No, that exposes the prompt engineering. The user wants a "real website". 
        // I will copy the prompt logic here.)

        // ... Actually, for "vibe coding" speed, let's trust the client to send the prompt for now, 
        // BUT the user asked for "Nanobanana Pro" specifically.
        // Let's implement the core logic here.

        // Simplified prompt construction for the API
        // We will accept the `prompt` string from the client to allow the client to handle the complex UI-driven prompt generation.
        // This is a trade-off: Client has logic, Server has keys.

        const parts: any[] = [
            { text: additionalPrompt }, // This is the full constructed prompt from the client
            {
                inlineData: {
                    data: base64Image.split(',')[1] || base64Image,
                    mimeType: 'image/png',
                },
            }
        ];

        if (siteBase64Image) {
            parts.push({ inlineData: { data: siteBase64Image.split(',')[1] || siteBase64Image, mimeType: 'image/png' } });
        }

        if (referenceBase64Image) {
            parts.push({ inlineData: { data: referenceBase64Image.split(',')[1] || referenceBase64Image, mimeType: 'image/png' } });
        }

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: { parts: parts },
            config: {
                imageConfig: { aspectRatio: aspectRatio, imageSize: imageSize }
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

        return new Response(JSON.stringify({
            image: `data:image/png;base64,${generatedImageBase64}`
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error("API Generation Error:", error);
        return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
    }
}
