import React, { useState, useRef } from 'react';
import { Box, Upload, X, RefreshCw, Sparkles, Download, Maximize, Layers, ArrowRight, LayoutTemplate } from 'lucide-react';
import { Button } from './Button';
import { generateArchitecturalRender } from '../services/geminiService';
import { ViewType, RenderStyle } from '../types';

interface FloorPlanWorkspaceProps {
    template: any;
}

export const FloorPlanWorkspace: React.FC<FloorPlanWorkspaceProps> = ({ template }) => {
    const [planImage, setPlanImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(template.outputImage || null);
    const [error, setError] = useState<string | null>(null);

    const planInputRef = useRef<HTMLInputElement>(null);

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
        if (!planImage) {
            setError("Please upload a floor plan.");
            return;
        }

        setIsGenerating(true);
        setError(null);

        try {
            // Specific prompt for Floor Plan to Isometric
            const fullPrompt = `Create a 45-degree isometric 3D cutaway model of this floor plan in a Blender-style diorama aesthetic. 
            
            STRICT CONSTRAINTS:
            - Model ONLY what is visible in the plan - do not extend, add, or imagine any spaces beyond the edges of the image.
            - Do not add any furniture or elements that are not shown on the plan.
            - Retain all the exact details shown including walls, doors, windows, furniture, and room layouts.
            
            VISUAL STYLE:
            - Render the room as a cutaway sitting within a solid block with thick walls and floor visible in section.
            - Walls must be crisp white.
            - Interior flooring must be warm oak wood.
            - Warm atmospheric lighting with soft shadows.
            - Place the diorama on a white glossy reflective surface that catches soft reflections of the model.
            - Light background.
            - Photorealistic materials.`;

            // Calculate aspect ratio
            let selectedAspectRatio: any = '1:1';
            if (planImage) {
                const img = new Image();
                img.src = planImage;
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

            const result = await generateArchitecturalRender(
                planImage, // Base Image
                'Realistic', // Style
                'Blender-style isometric diorama', // Style Instruction
                ViewType.AXONOMETRIC, // View Type
                fullPrompt, // Prompt
                null, // Site Context
                [], // Reference Images
                selectedAspectRatio,
                '1K',
                [],
                undefined,
                undefined,
                'Interior', // Create Mode - usually better for floor plans to focus on interior details
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

                {/* Plan Input */}
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 relative group min-h-[300px] flex flex-col overflow-hidden shrink-0">
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-[10px] font-bold text-slate-900 bg-white/90 px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                        <LayoutTemplate size={12} /> 2D Floor Plan
                    </div>
                    {planImage ? (
                        <div className="relative w-full h-full">
                            <img src={planImage} alt="Plan" className="w-full h-full object-contain bg-slate-50" />
                            <button
                                onClick={() => setPlanImage(null)}
                                className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <div
                            className="flex-1 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-50 transition-colors"
                            onClick={() => planInputRef.current?.click()}
                        >
                            <Upload size={32} className="mb-3 opacity-50" />
                            <p className="text-sm font-medium text-slate-900">Upload Floor Plan</p>
                            <p className="text-xs text-slate-400 mt-1 text-center px-4">CAD drawing or clean sketch</p>
                            <input type="file" ref={planInputRef} onChange={(e) => handleFileUpload(e, setPlanImage)} className="hidden" />
                        </div>
                    )}
                </div>

                {/* Instructions */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Layers size={12} /> How it works
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                        Upload a 2D floor plan. The AI will extrude it into a stunning <strong>45-degree isometric 3D cutaway</strong>.
                        <br /><br />
                        It creates a "Blender-style" diorama with thick white walls, warm oak flooring, and realistic lighting.
                    </p>
                </div>

                {/* Generate Button */}
                <Button
                    onClick={handleGenerate}
                    disabled={!planImage || isGenerating}
                    className="w-full py-4 text-sm font-bold shadow-lg shadow-blue-500/20"
                >
                    {isGenerating ? (
                        <>
                            <RefreshCw size={18} className="animate-spin mr-2" />
                            Building 3D Model...
                        </>
                    ) : (
                        <>
                            <Sparkles size={18} className="mr-2" />
                            Generate 3D Isometric
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
                            alt="Generated Isometric"
                            className="w-full h-full object-contain"
                        />
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="bg-white text-slate-900 p-2 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
                                <Maximize size={20} />
                            </button>
                            <a
                                href={generatedImage}
                                download="floor-plan-isometric.png"
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
                        <Box size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-sm font-medium">Generated 3D model will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
};
