import React, { useState, useRef } from 'react';
import { Box, Upload, X, RefreshCw, Sparkles, Download, Maximize, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { generateArchitecturalRender } from '../services/geminiService';
import { ViewType, RenderStyle } from '../types';

interface MaterialSwapWorkspaceProps {
    template: any;
    onBack?: () => void;
}

export const MaterialSwapWorkspace: React.FC<MaterialSwapWorkspaceProps> = ({ template }) => {
    const [baseImage, setBaseImage] = useState<string | null>(template.baseImage);
    const [materialImage, setMaterialImage] = useState<string | null>(template.materialImage || null);
    const [prompt, setPrompt] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(template.outputImage || null);
    const [error, setError] = useState<string | null>(null);

    const baseInputRef = useRef<HTMLInputElement>(null);
    const materialInputRef = useRef<HTMLInputElement>(null);

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
        if (!baseImage) return;

        setIsGenerating(true);
        setError(null);

        try {
            // Construct a specific prompt for material swapping with emphasis on scale
            const fullPrompt = `Material Swap Task. ${prompt}. 
            CRITICAL INSTRUCTION: INTELLIGENTLY SCALE THE TEXTURE. 
            - Analyze the scale of the building/surface in the Base Image.
            - Apply the new material with correct architectural proportions and UV mapping.
            - Do NOT stretch the texture. Tile it seamlessly if necessary to match the real-world scale of the building elements.
            - Ensure the grain/pattern size is realistic for the distance of the camera.
            - Maintain the exact geometry and lighting of the base image.`;

            // Calculate aspect ratio
            let selectedAspectRatio: any = '1:1';
            if (baseImage) {
                const img = new Image();
                img.src = baseImage;
                await new Promise((resolve) => { img.onload = resolve; });
                const ratio = img.width / img.height;

                // Snap to closest supported ratio
                const ratios = [
                    { id: '1:1', value: 1 },
                    { id: '16:9', value: 16 / 9 },
                    { id: '9:16', value: 9 / 16 },
                    { id: '4:3', value: 4 / 3 },
                    { id: '3:4', value: 3 / 4 },
                    { id: '3:2', value: 3 / 2 },
                    { id: '2:3', value: 2 / 3 },
                    { id: '5:4', value: 5 / 4 },
                    { id: '4:5', value: 4 / 5 },
                    { id: '21:9', value: 21 / 9 },
                ];

                const closest = ratios.reduce((prev, curr) => {
                    return (Math.abs(curr.value - ratio) < Math.abs(prev.value - ratio) ? curr : prev);
                });
                selectedAspectRatio = closest.id;
                console.log(`Calculated aspect ratio: ${ratio}, snapped to: ${selectedAspectRatio}`);
            }

            const result = await generateArchitecturalRender(
                baseImage,
                'Realistic', // Style
                'Photorealistic material swap', // Style Instruction
                ViewType.SIMILAR_TO_INPUT, // View Type - strictly match input
                fullPrompt, // Additional Prompt
                null, // Site
                null, // Reference (could use material image here if we wanted, but passing it as material1Image is better)
                selectedAspectRatio, // Aspect Ratio
                '1K', // Image Size
                [], // Verbs
                undefined, // Ideation Config
                undefined, // Diagram Type
                'Exterior', // Create Mode (defaulting to exterior, but works for interior too usually)
                [], // Atmospheres
                undefined, // Elevation Side
                materialImage, // Material 1
                null // Material 2
            );

            setGeneratedImage(result);
        } catch (err: any) {
            console.error("Swap failed:", err);
            setError(err.message || "Failed to swap material");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="w-full h-full flex gap-6">
            {/* Left Column: Inputs */}
            <div className="w-1/3 flex flex-col gap-4 overflow-y-auto pr-2">

                {/* Base Geometry */}
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 relative group min-h-[200px] flex flex-col overflow-hidden shrink-0">
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-[10px] font-bold text-slate-900 bg-white/90 px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                        <Box size={12} /> Base Geometry
                    </div>
                    {baseImage ? (
                        <div className="relative w-full h-full">
                            <img src={baseImage} alt="Base" className="w-full h-full object-cover" />
                            <button
                                onClick={() => setBaseImage(null)}
                                className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <div
                            className="flex-1 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-50 transition-colors"
                            onClick={() => baseInputRef.current?.click()}
                        >
                            <Upload size={32} className="mb-3 opacity-50" />
                            <p className="text-sm font-medium text-slate-900">Upload Base Image</p>
                            <input type="file" ref={baseInputRef} onChange={(e) => handleFileUpload(e, setBaseImage)} className="hidden" />
                        </div>
                    )}
                </div>

                {/* Material Input (Optional) */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shrink-0">
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <ImageIcon size={10} /> Material Reference (Optional)
                        </label>
                        {materialImage && (
                            <button onClick={() => setMaterialImage(null)} className="text-slate-400 hover:text-red-500">
                                <X size={12} />
                            </button>
                        )}
                    </div>

                    {materialImage ? (
                        <div className="h-24 w-full rounded-lg overflow-hidden relative border border-slate-200">
                            <img src={materialImage} alt="Material" className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div
                            className="h-24 w-full rounded-lg border border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
                            onClick={() => materialInputRef.current?.click()}
                        >
                            <div className="text-center">
                                <Upload size={16} className="mx-auto text-slate-400 mb-1" />
                                <span className="text-xs text-slate-500">Upload Texture</span>
                            </div>
                            <input type="file" ref={materialInputRef} onChange={(e) => handleFileUpload(e, setMaterialImage)} className="hidden" />
                        </div>
                    )}
                </div>

                {/* Prompt Input */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 flex-1 flex flex-col">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <RefreshCw size={10} /> Instructions
                    </label>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="E.g. Change the timber cladding to reflective zinc panels. Keep everything else exactly the same."
                        className="w-full flex-1 min-h-[100px] p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none mb-4"
                    />

                    <Button
                        onClick={handleGenerate}
                        disabled={!baseImage || (!prompt && !materialImage) || isGenerating}
                        className="w-full bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center gap-2 py-3 rounded-xl shadow-lg shadow-slate-900/10"
                    >
                        {isGenerating ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} />}
                        {isGenerating ? 'Swapping Material...' : 'Swap Material'}
                    </Button>

                    {error && (
                        <div className="mt-3 text-xs text-red-500 bg-red-50 p-2 rounded border border-red-100">
                            {error}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: Output */}
            <div className="w-2/3 bg-white rounded-2xl border border-slate-200 shadow-sm relative flex items-center justify-center overflow-hidden">
                <div className="absolute top-4 left-4 z-10 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                    Final Output
                </div>

                {!generatedImage ? (
                    <div className="text-center text-slate-300">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ImageIcon size={32} className="opacity-50" />
                        </div>
                        <p className="text-sm font-medium">Ready to Generate</p>
                    </div>
                ) : (
                    <div className="relative w-full h-full group">
                        <img
                            src={generatedImage}
                            alt="Output"
                            className="w-full h-full object-contain bg-slate-50"
                        />
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => window.open(generatedImage, '_blank')}
                                className="p-2 bg-white/90 backdrop-blur rounded-lg hover:bg-white text-slate-700 shadow-sm"
                                title="Open full size"
                            >
                                <Maximize size={20} />
                            </button>
                            <a
                                href={generatedImage}
                                download="material-swap.png"
                                className="p-2 bg-white/90 backdrop-blur rounded-lg hover:bg-white text-slate-700 shadow-sm"
                                title="Download"
                            >
                                <Download size={20} />
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
