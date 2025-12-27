
import { ViewType, AspectRatio, ImageSize, RenderStyle, IdeationConfig, DiagramType, CreateMode, Atmosphere, ElevationSide } from '../types';
import { VIEW_PROMPTS, SPATIAL_VERBS, IDEATION_MATERIALS, IDEATION_FORMS, DIAGRAM_PROMPTS, ATMOSPHERE_PROMPTS, INTERIOR_STYLE_PROMPTS } from '../constants';
import { compressImage, padImageToAspectRatio } from '../utils/imageUtils';

export const generateArchitecturalRender = async (
    base64Image: string,
    styleName: string,
    styleInstruction: string,
    viewType: ViewType,
    additionalPrompt: string = "",
    siteBase64Image?: string | null,
    referenceBase64Images: string[] = [], // Changed to array
    aspectRatio: AspectRatio = "1:1",
    imageSize: ImageSize = "1K",
    selectedVerbs: string[] = [],
    ideationConfig?: IdeationConfig,
    diagramType?: DiagramType,
    createMode: CreateMode = 'Exterior',
    atmospheres: Atmosphere[] = [],
    elevationSide?: ElevationSide,
    material1Image?: string | null,
    material2Image?: string | null,
    additionalBaseImages: string[] = [],
    lightDirection?: number
): Promise<string> => {
    try {
        // --- PADDING & COMPRESSION ---
        // Pad image to match target aspect ratio to prevent cropping
        const paddedBase64Image = await padImageToAspectRatio(base64Image, aspectRatio);

        // Compress images to ensure they are within Vercel's payload limits (4.5MB)
        const compressedBase64Image = await compressImage(paddedBase64Image);

        // Compress additional images
        const compressedAdditionalImages = await Promise.all(
            additionalBaseImages.map(img => compressImage(img))
        );

        const compressedSiteImage = siteBase64Image ? await compressImage(siteBase64Image) : null;
        const compressedReferenceImages = await Promise.all(
            referenceBase64Images.map(img => compressImage(img))
        );
        const compressedMaterial1Image = material1Image ? await compressImage(material1Image) : null;
        const compressedMaterial2Image = material2Image ? await compressImage(material2Image) : null;

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
        ${additionalBaseImages.length > 0 ? `ADDITIONAL INPUTS: The next ${additionalBaseImages.length} images are additional views of the Base Geometry.` : ''}
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
        ${additionalBaseImages.length > 0 ? `ADDITIONAL INPUTS: The next ${additionalBaseImages.length} images are additional views of the Base Volume.` : ''}
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
        ${additionalBaseImages.length > 0 ? `2-${1 + additionalBaseImages.length}. Additional views of the Base Space.` : ''}
        ${referenceBase64Images.length > 0 ? `${2 + additionalBaseImages.length}-${2 + additionalBaseImages.length + referenceBase64Images.length - 1}. Style References.` : ''}

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

            if (referenceBase64Images.length > 0) {
                if (styleName === 'Similar to Reference Image') {
                    prompt += `\nREFERENCE IMAGE INSTRUCTION: STRICTLY match the interior style, furniture, lighting, and mood of the Reference Images. The output must look like it belongs to the same project as the references.`;
                } else {
                    prompt += `\nREFERENCE IMAGE INSTRUCTION: Extract the color palette, furniture style, and material choices from the Reference Images and apply them to the Base Space.`;
                }
            }

        } else {
            // --- EXTERIOR RENDER MODE ---
            let viewInstruction = VIEW_PROMPTS[viewType];

            if (viewType === ViewType.ELEVATION && elevationSide) {
                viewInstruction = `CRITICAL: Generate a 2D Orthographic Elevation, strictly from the ${elevationSide} side. Flat projection, NO perspective.`;
            } else if (viewType === ViewType.SIMILAR_TO_REF) {
                viewInstruction = `CRITICAL: Match the exact camera angle, perspective, and composition of the provided Style Reference image.`;
            } else if (viewType === ViewType.SIMILAR_TO_INPUT) {
                viewInstruction = `CRITICAL: Match the exact camera angle, perspective, and composition of the provided Base Geometry (Image #1).`;
            } else if (viewType === ViewType.PLAN) {
                viewInstruction = `CRITICAL: Generate a STRICTLY 2D Floor Plan. Top-down view. Flat projection. NO perspective.`;
            } else if (viewType === ViewType.SECTION) {
                viewInstruction = `CRITICAL: Generate a STRICTLY 2D Section Cut. Vertical cut. Flat projection. NO perspective.`;
            }

            prompt = `
        Act as a world-class architectural visualizer. 
        INPUTS: 1. Base Geometry (Sketch/Model).
        ${additionalBaseImages.length > 0 ? `2-${1 + additionalBaseImages.length}. Additional views of the Base Geometry.` : ''}
        
        CRITICAL GLOBAL INSTRUCTION: 
        1. STRICTLY PRESERVE GEOMETRY: Never change, add, or remove any 'object or shape' from the input image. 
        2. NO HALLUCINATIONS: Do not add any new elements (trees, people, cars, buildings, furniture, landscape features) that are not explicitly present in the input image.
        3. STYLE TRANSFER ONLY: Your ONLY task is to apply the requested material and lighting style to the EXISTING geometry.
        
        IMPORTANT: The input image may have been padded with white bars to fit the output aspect ratio. If you see white bars on the sides or top/bottom:
        1. Keep the central image EXACTLY as is.
        2. FILL the white areas by extending the scene naturally (outpainting). Match the perspective, lighting, and style of the central image.
        3. The final output must be a full, seamless image with NO white bars remaining.
        `;

            let imageIndex = 2 + additionalBaseImages.length;
            let siteImageIndex = -1;
            let refImageStartIndex = -1;
            let mat1ImageIndex = -1;
            let mat2ImageIndex = -1;

            if (siteBase64Image) {
                prompt += `\n      ${imageIndex}. Site Context/Map.`;
                siteImageIndex = imageIndex;
                imageIndex++;
            }

            if (referenceBase64Images.length > 0) {
                prompt += `\n      ${imageIndex}-${imageIndex + referenceBase64Images.length - 1}. Style References.`;
                refImageStartIndex = imageIndex;
                imageIndex += referenceBase64Images.length;
            }

            if (material1Image) {
                prompt += `\n      ${imageIndex}. Material 1 Texture.`;
                mat1ImageIndex = imageIndex;
                imageIndex++;
            }

            if (material2Image) {
                prompt += `\n      ${imageIndex}. Material 2 Texture.`;
                mat2ImageIndex = imageIndex;
                imageIndex++;
            }

            let atmosphereInstruction = "";
            if (atmospheres.length > 0) {
                atmosphereInstruction = `\nATMOSPHERE & MOOD: ${atmospheres.map(a => `${a} (${ATMOSPHERE_PROMPTS[a]})`).join(' + ')}. Combine these atmospheric effects to create the final mood.`;
            }

            prompt += `
        TASK: Generate a ${viewType}.
        Style: ${styleName}. ${styleInstruction}.
        View: ${viewInstruction}.
        ${atmosphereInstruction}
        Context: ${additionalPrompt}.
        ${viewType === ViewType.AXONOMETRIC || viewType === ViewType.ISOMETRIC ? "CRITICAL: The output MUST be an axonometric/isometric view. Do not output a perspective view." : ""}
        ${aspectRatio === 'Similar to Input' ? "ASPECT RATIO: Strictly maintain the aspect ratio of the Input Image." : ""}
        ${aspectRatio === 'Similar to Reference' ? "ASPECT RATIO: Strictly maintain the aspect ratio of the Reference Image." : ""}
        ${lightDirection !== undefined ? `LIGHTING DIRECTION: The light should come from ${lightDirection} degrees (0=North/Front, 90=East/Right, 180=South/Back, 270=West/Left). Ensure shadows fall accordingly.` : ""}
        `;

            if (siteBase64Image) {
                if (styleName === RenderStyle.SATELLITE_DRONE) {
                    prompt += `\nSATELLITE TRANSFORMATION: Convert the flat map (Image #${siteImageIndex}) into a 3D realistic drone shot. Place the architecture (Image #1) into it.`;
                } else {
                    prompt += `\nCONTEXT: Place the architecture (Image #1) seamlessly into the environment of Image #${siteImageIndex}. Match lighting and perspective.`;
                }
            }

            if (referenceBase64Images.length > 0) {
                if (viewType === ViewType.SIMILAR_TO_REF) {
                    prompt += `\nREFERENCE: Use Image #${refImageStartIndex} as the strict reference for CAMERA ANGLE and PERSPECTIVE. Also apply materials and mood from it.`;
                } else if (styleName === RenderStyle.SIMILAR_TO_REF) {
                    prompt += `\nREFERENCE: Use Images #${refImageStartIndex}-${refImageStartIndex + referenceBase64Images.length - 1} as the strict reference for ARCHITECTURAL STYLE, MATERIALS, and MOOD.`;
                } else {
                    prompt += `\nREFERENCE: Apply materials and mood from Images #${refImageStartIndex}-${refImageStartIndex + referenceBase64Images.length - 1}.`;
                }
            }

            if (material1Image) {
                prompt += `\nMATERIAL 1: Apply the texture from Image #${mat1ImageIndex} as the PRIMARY exterior material.`;
            }

            if (material2Image) {
                prompt += `\nMATERIAL 2: Apply the texture from Image #${mat2ImageIndex} as the SECONDARY exterior material.`;
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
                additionalBaseImages: compressedAdditionalImages,
                siteBase64Image: compressedSiteImage,
                referenceBase64Images: compressedReferenceImages, // Send array
                material1Image: compressedMaterial1Image,
                material2Image: compressedMaterial2Image,
                aspectRatio,
                imageSize,
                additionalPrompt: prompt, // Send the FULL constructed prompt as 'additionalPrompt' (API treats it as the main text)
            }),
        });

        if (!response.ok) {
            let errorMessage = `Server error: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorMessage;
            } catch (e) {
                // If response is not JSON (e.g. 413 Payload Too Large HTML), use status text
                console.warn("Failed to parse error response as JSON:", e);
                errorMessage = `Server Error (${response.status}): ${response.statusText}`;
                if (response.status === 413) {
                    errorMessage = "Request too large. Please use smaller images.";
                } else if (response.status === 504) {
                    errorMessage = "Gateway Timeout. The model took too long to respond.";
                }
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data.image;

    } catch (error) {
        console.error("Generation Error:", error);
        throw error;
    }
};
