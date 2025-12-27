import React, { useState, useRef } from 'react';
import { Box, Upload, X, RefreshCw, Sparkles, Download, Maximize, Image as ImageIcon, Map, MapPin, Layers, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { generateArchitecturalRender } from '../services/geminiService';
import { ViewType, RenderStyle } from '../types';

interface DesignInsertionWorkspaceProps {
    template: any;
}

export const DesignInsertionWorkspace: React.FC<DesignInsertionWorkspaceProps> = ({ template }) => {
    const [siteImage, setSiteImage] = useState<string | null>(null);
    const [modelImage, setModelImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(template.outputImage || null);
    const [error, setError] = useState<string | null>(null);

    const siteInputRef = useRef<HTMLInputElement>(null);
    const modelInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setFunc: (val: string | null) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result && typeof event.target.result === 'string') {
                    setFunc(event.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async () => {
        if (!siteImage || !modelImage) {
            setError("Please upload both the Site Photo and the 3D Model View.");
            return;
        }

        setIsGenerating(true);
        setError(null);

        try {
            // Construct a specific prompt for insertion
            const fullPrompt = `Photorealistic Architectural Photomontage / Design Insertion.
            
            TASK:
            Seamlessly insert the provided 3D Building Model (Image #1) into the provided Site Photograph (Image #2).
            
            INPUTS:
            1. 3D Model View: The architectural design to be inserted.
            2. Site Context: A drone shot or street view. The specific location for the building is marked with a RED OUTLINE/FILL.
            
            INSTRUCTIONS:
            - GEOMETRY: Place the 3D model EXACTLY into the red-outlined area on the site photo. Match the perspective, scale, and angle of the site photo perfectly.
            - LIGHTING: Analyze the lighting in the Site Photo (sun direction, shadows, color temperature, time of day) and apply the EXACT same lighting to the 3D Model. The model must cast realistic shadows onto the ground/surrounding context.
            - BLENDING: The insertion must be seamless. Match the white balance, grain, and contrast of the site photo.
            - FOREGROUND/BACKGROUND: If there are elements in the site photo (trees, poles, wires) that should be in front of the building, mask them correctly (or regenerate them) so the building sits *behind* foreground objects.
            - REFLECTIONS: If the building has glass, it must reflect the surrounding environment (sky, neighboring buildings) visible in the site photo.
            
            OUTPUT:
            A single, high-resolution, photorealistic image that looks like a real photograph of the completed building on the site. No text, no diagrams, just the final photo.`;

            // Calculate aspect ratio from site image (base)
            let selectedAspectRatio: any = '16:9';
            if (siteImage) {
                const img = new Image();
                img.src = siteImage;
                await new Promise((resolve) => { img.onload = resolve; });
                const ratio = img.width / img.height;

                // Snap to closest supported ratio
                const ratios = [
                    { id: '1:1', value: 1 },
                    { id: '16:9', value: 16 / 9 },
                    { id: '9:16', value: 9 / 16 },
                    { id: '4:3', value: 4 / 3 },
                    { id: '3:4', value: 3 / 4 },
                ];

                const closest = ratios.reduce((prev, curr) => {
                    return (Math.abs(curr.value - ratio) < Math.abs(prev.value - ratio) ? curr : prev);
                });
                selectedAspectRatio = closest.id;
            }

            // Call API
            // We pass:
            // base64Image -> modelImage (The subject)
            // siteBase64Image -> siteImage (The context)
            const result = await generateArchitecturalRender(
                modelImage, // Base (Subject)
                'Realistic', // Style
                'Photorealistic montage', // Style Instruction
                ViewType.PERSPECTIVE, // View Type
                fullPrompt, // Prompt
                siteImage, // Site Context
                [], // Reference Images
                selectedAspectRatio,
                '1K',
                [],
                undefined,
                undefined,
                'Exterior', // Create Mode
                [],
                undefined,
                null,
                null
            );

            setGeneratedImage(result);
        } catch (err: any) {
            console.error("Generation failed:", err);
            setError(err.message || "Failed to generate image");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="w-full h-full flex gap-6">
            {/* Left Column: Inputs */}
            <div className="w-1/3 flex flex-col gap-4 overflow-y-auto pr-2">

                {/* Site Context Input */}
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 relative group min-h-[200px] flex flex-col overflow-hidden shrink-0">
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-[10px] font-bold text-slate-900 bg-white/90 px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                        <MapPin size={12} /> Site Context (Base)
                    </div>
                    {siteImage ? (
                        <div className="relative w-full h-full">
                            <img src={siteImage} alt="Site" className="w-full h-full object-cover" />
                            <button
                                onClick={() => setSiteImage(null)}
                                className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <div
                            className="flex-1 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-50 transition-colors"
                            onClick={() => siteInputRef.current?.click()}
                        >
                            <Upload size={32} className="mb-3 opacity-50" />
                            <p className="text-sm font-medium text-slate-900">Upload Site Photo</p>
                            <p className="text-xs text-slate-400 mt-1 text-center px-4">Drone shot or Street view<br /><span className="text-red-500 font-medium">Mark site with RED outline</span></p>
                            <input type="file" ref={siteInputRef} onChange={(e) => handleFileUpload(e, setSiteImage)} className="hidden" />
                        </div>
                    )}
                </div>

                {/* 3D Model Input */}
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 relative group min-h-[200px] flex flex-col overflow-hidden shrink-0">
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-[10px] font-bold text-slate-900 bg-white/90 px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                        <Box size={12} /> 3D Model View
                    </div>
                    {modelImage ? (
                        <div className="relative w-full h-full">
                            <img src={modelImage} alt="Model" className="w-full h-full object-cover" />
                            <button
                                onClick={() => setModelImage(null)}
                                className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <div
                            className="flex-1 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-50 transition-colors"
                            onClick={() => modelInputRef.current?.click()}
                        >
                            <Upload size={32} className="mb-3 opacity-50" />
                            <p className="text-sm font-medium text-slate-900">Upload 3D Model</p>
                            <p className="text-xs text-slate-400 mt-1 text-center px-4">Screenshot of your design<br />Match the angle of the site photo</p>
                            <input type="file" ref={modelInputRef} onChange={(e) => handleFileUpload(e, setModelImage)} className="hidden" />
                        </div>
                    )}
                </div>

                {/* Instructions */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Layers size={12} /> How it works
                    </h4>
                    <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside">
                        <li>Upload a <strong>Site Photo</strong> (Drone or Eye-level).</li>
                        <li>Mark the exact location of your building with a <strong>RED OUTLINE</strong> on the site photo.</li>
                        <li>Upload a <strong>3D Model View</strong> of your design. Try to match the camera angle of the site photo.</li>
                        <li>Click Generate to merge them seamlessly.</li>
                    </ol>
                </div>

                {/* Generate Button */}
                <Button
                    onClick={handleGenerate}
                    disabled={!siteImage || !modelImage || isGenerating}
                    className="w-full py-4 text-sm font-bold shadow-lg shadow-blue-500/20"
                >
                    {isGenerating ? (
                        <>
                            <RefreshCw size={18} className="animate-spin mr-2" />
                            Merging & Rendering...
                        </>
                    ) : (
                        <>
                            <Sparkles size={18} className="mr-2" />
                            Generate Insertion
                        </>
                    )}
                </Button>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">
                        {error}
                    </div>
                )}
            </div>

            {/* Right Column: Output */}
            <div className="flex-1 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden relative flex items-center justify-center group">
                {generatedImage ? (
                    <>
                        <img
                            src={generatedImage}
                            alt="Generated Insertion"
                            className="w-full h-full object-contain"
                        />
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="bg-white text-slate-900 p-2 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
                                <Maximize size={20} />
                            </button>
                            <a
                                href={generatedImage}
                                download="design-insertion.png"
                                className="bg-slate-900 text-white p-2 rounded-lg shadow-sm hover:bg-black transition-colors"
                            >
                                <Download size={20} />
                            </a>
                        </div>
                        <div className="absolute top-4 left-4">
                            <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                                Final Output
                            </span>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-slate-400">
                        <Layers size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-sm font-medium">Generated render will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
};
