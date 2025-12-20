
import { ViewType, AspectRatio, ImageSize, RenderStyle, IdeationConfig, DiagramType, CreateMode, Atmosphere, ElevationSide } from '../types';
import { VIEW_PROMPTS, SPATIAL_VERBS, IDEATION_MATERIALS, IDEATION_FORMS, DIAGRAM_PROMPTS, ATMOSPHERE_PROMPTS, INTERIOR_STYLE_PROMPTS } from '../constants';
import { compressImage } from '../utils/imageUtils';

export const generateArchitecturalRender = async (
    base64Image: string,
    styleName: string,
    styleInstruction: string,
    viewType: ViewType,
    additionalPrompt: string = "",
    siteBase64Image?: string | null,
    referenceBase64Image?: string | null,
    aspectRatio: AspectRatio = "1:1",
    imageSize: ImageSize = "1K",
    selectedVerbs: string[] = [],
    ideationConfig?: IdeationConfig,
    diagramType?: DiagramType,
    createMode: CreateMode = 'Exterior',
    atmospheres: Atmosphere[] = [],
    elevationSide?: ElevationSide,
    material1?: string,
    material2?: string
): Promise<string> => {
    try {
        // --- COMPRESSION ---
        // Compress images to ensure they are within Vercel's payload limits (4.5MB)
        const compressedBase64Image = await compressImage(base64Image);
        const compressedSiteImage = siteBase64Image ? await compressImage(siteBase64Image) : null;
        const compressedReferenceImage = referenceBase64Image ? await compressImage(referenceBase64Image) : null;

        // --- PROMPT CONSTRUCTION ---
        // (Logic moved from direct API call to here to prepare payload)

        // Clean inputs (API expects full base64 or data URI, we'll send data URI to be safe or handle it on server)
        // The API code I wrote expects split base64, but let's send the full string and let the API handle splitting if needed, 
        // OR just send what we have. The API code I wrote: base64Image.split(',')[1] || base64Image
        // So sending the full data URI is fine.

        let prompt = "";

        // Determine Mode
        const isMassingStudy = selectedVerbs.length > 0 || (ideationConfig !== undefined);
        const isDiagramMode = diagramType !== undefined;
        const isInterior = createMode === 'Interior';

        if (isDiagramMode && diagramType) {
            // --- DIAGRAM MODE ---
            const diagramInstruction = DIAGRAM_PROMPTS[diagramType];
            prompt = `
        Act as a professional architectural illustrator.
        INPUT: First image is the base geometry.
        TASK: Create a "${diagramType}" diagram.
        SPECIFICS: ${diagramInstruction}
        STYLE: High contrast, vector-like quality, clean lines, architectural portfolio style.
        CONTEXT: ${additionalPrompt}
        `;

        } else if (isMassingStudy && ideationConfig) {
            // --- IDEATION MODE ---
            const { innovationLevel, material, formLanguage, elevationSide: ideationElevationSide, timeOfDay } = ideationConfig;
            const materialPrompt = IDEATION_MATERIALS[material] || IDEATION_MATERIALS['Concrete'];
            const formPrompt = IDEATION_FORMS[formLanguage] || IDEATION_FORMS['Orthogonal'];

            let viewInstruction = VIEW_PROMPTS[viewType];
            if (viewType === ViewType.ELEVATION && ideationElevationSide) {
                viewInstruction = `2D Orthographic Elevation, from the ${ideationElevationSide} side.`;
            }

            prompt = `
        Act as a lead design architect performing a conceptual massing study.
        INPUT: Base Volume/Sketch.
        PARAMETERS: Innovation: ${innovationLevel}/100. Form: ${formPrompt}. View: ${viewInstruction}.
        OPERATIONS: ${selectedVerbs.map(verb => `- ${SPATIAL_VERBS[verb]?.prompt || verb}`).join('\n')}
        AESTHETIC: ${materialPrompt}, ${timeOfDay || 'Neutral'} lighting.
        CONTEXT: ${additionalPrompt}
        `;

        } else if (isInterior) {
            // --- INTERIOR DESIGN MODE ---
            prompt = `
        Act as a world-class Interior Designer and Visualization Expert.

        INPUTS:
        1. First Image: The **Base Room/Space** (Sketch or Photo).
        ${referenceBase64Image ? '2. Second Image: **Style Reference**.' : ''}

        TASK:
        Transform the Base Space into a high-end interior design render.
        
        DESIGN STYLE: ${styleName}.
        STYLE DEFINITION: ${styleInstruction}.
        
        INSTRUCTIONS:
        - Analyze the perspective of the input image and maintain it perfectly.
        - Replace the materials, furniture, lighting, and decor to match the requested "${styleName}" style.
        - Lighting: Photorealistic, cinematic interior lighting.
        - Textures: High-fidelity fabrics, wood grains, reflections.
        - If the input is a sketch, hallucinate realistic details (flooring, ceiling, windows) fitting the perspective.
        - If the input is an empty room photo, furnish it fully according to the style.
        
        USER NOTES: ${additionalPrompt}
        `;

            if (referenceBase64Image) {
                prompt += `\nREFERENCE IMAGE INSTRUCTION: Extract the color palette, furniture style, and material choices from the Reference Image and apply them to the Base Space.`;
            }

        } else {
            // --- EXTERIOR RENDER MODE ---
            let viewInstruction = VIEW_PROMPTS[viewType];

            if (viewType === ViewType.ELEVATION && elevationSide) {
                viewInstruction = `2D Orthographic Elevation, strictly from the ${elevationSide} side. Flat projection, no perspective.`;
            } else if (viewType === ViewType.SIMILAR_TO_REF) {
                viewInstruction = `Match the exact camera angle, perspective, and composition of the provided Style Reference image.`;
            }

            prompt = `
        Act as a world-class architectural visualizer. 
        INPUTS: 1. Base Geometry (Sketch/Model).
        `;

            let imageIndex = 2;
            let siteImageIndex = -1;
            let refImageIndex = -1;

            if (siteBase64Image) {
                prompt += `\n      ${imageIndex}. Site Context/Map.`;
                siteImageIndex = imageIndex;
                imageIndex++;
            }

            if (referenceBase64Image) {
                prompt += `\n      ${imageIndex}. Style Reference.`;
                refImageIndex = imageIndex;
                imageIndex++;
            }

            let atmosphereInstruction = "";
            if (atmospheres.length > 0) {
                atmosphereInstruction = `\nATMOSPHERE & MOOD: ${atmospheres.map(a => `${a} (${ATMOSPHERE_PROMPTS[a]})`).join(' + ')}. Combine these atmospheric effects to create the final mood.`;
            }

            let materialInstruction = "";
            if (material1) materialInstruction += `\nPRIMARY MATERIAL: ${material1}.`;
            if (material2) materialInstruction += `\nSECONDARY MATERIAL: ${material2}.`;

            prompt += `
        TASK: Generate a ${viewType}.
        Style: ${styleName}. ${styleInstruction}.
        View: ${viewInstruction}.
        ${atmosphereInstruction}
        ${materialInstruction}
        Context: ${additionalPrompt}.
        `;

            if (siteBase64Image) {
                if (styleName === RenderStyle.SATELLITE_DRONE) {
                    prompt += `\nSATELLITE TRANSFORMATION: Convert the flat map (Image #${siteImageIndex}) into a 3D realistic drone shot. Place the architecture (Image #1) into it.`;
                } else {
                    prompt += `\nCONTEXT: Place the architecture (Image #1) seamlessly into the environment of Image #${siteImageIndex}. Match lighting and perspective.`;
                }
            }

            if (referenceBase64Image) {
                if (viewType === ViewType.SIMILAR_TO_REF) {
                    prompt += `\nREFERENCE: Use Image #${refImageIndex} as the strict reference for CAMERA ANGLE and PERSPECTIVE. Also apply materials and mood from it.`;
                } else if (styleName === RenderStyle.SIMILAR_TO_REF) {
                    prompt += `\nREFERENCE: Use Image #${refImageIndex} as the strict reference for ARCHITECTURAL STYLE, MATERIALS, and MOOD.`;
                } else {
                    prompt += `\nREFERENCE: Apply materials and mood from Image #${refImageIndex}.`;
                }
            }
        }

        // --- CALL API ---
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                base64Image: compressedBase64Image,
                siteBase64Image: compressedSiteImage,
                referenceBase64Image: compressedReferenceImage,
                aspectRatio,
                imageSize,
                additionalPrompt: prompt, // Send the FULL constructed prompt as 'additionalPrompt' (API treats it as the main text)
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Server error: ${response.status}`);
        }

        const data = await response.json();
        return data.image;

    } catch (error) {
        console.error("Generation Error:", error);
        throw error;
    }
};
