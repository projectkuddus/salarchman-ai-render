import React, { useState, useRef } from 'react';
import { Box, Upload, X, RefreshCw, Sparkles, Download, Maximize, Layers, Image as ImageIcon, Plus, FileText, ChevronDown } from 'lucide-react';
import { Button } from './Button';
import { generateArchitecturalRender } from '../services/geminiService';
import { ViewType, RenderStyle } from '../types';

interface CadRenderWorkspaceProps {
    template: any;
}

export const CadRenderWorkspace: React.FC<CadRenderWorkspaceProps> = ({ template }) => {
    const [baseImage, setBaseImage] = useState<string | null>(null);
    const [viewType, setViewType] = useState<ViewType>(ViewType.PLAN);
    const [styleImages, setStyleImages] = useState<string[]>([]);
    const [projectDetails, setProjectDetails] = useState<string>("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(template.outputImage || null);
    const [error, setError] = useState<string | null>(null);

    const baseInputRef = useRef<HTMLInputElement>(null);
    const styleInputRef = useRef<HTMLInputElement>(null);

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

    const handleMultiUpload = (e: React.ChangeEvent<HTMLInputElement>, currentList: string[], setFunc: (val: string[]) => void) => {
        const files = e.target.files;
        if (files) {
            const newImages: string[] = [];
            Array.from(files).forEach((file: File) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (event.target?.result && typeof event.target.result === 'string') {
                        newImages.push(event.target.result);
                        if (newImages.length === files.length) {
                            setFunc([...currentList, ...newImages]);
                        }
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index: number, list: string[], setFunc: (val: string[]) => void) => {
        const newList = [...list];
        newList.splice(index, 1);
        setFunc(newList);
    };

    const handleGenerate = async () => {
        if (!baseImage) {
            setError("Please upload a CAD file or line drawing.");
            return;
        }

        setIsGenerating(true);
        setError(null);

        try {
            const fullPrompt = `Render this CAD line drawing into a professional architectural presentation.
            
            VIEW TYPE: ${viewType}
            
            TASK:
            - Convert the 2D line drawing into a fully textured, photorealistic or stylized professional render.
            - Maintain the exact scale and proportions of the drawing.
            - If it's a PLAN: Add realistic flooring materials, furniture shadows, and indication of depth.
            - If it's a SECTION: Show cut walls in heavy poche (black or hatched), and render the interior spaces with depth and lighting.
            - If it's an ELEVATION: Render realistic materials (brick, glass, wood), shadows, and depth.
            
            SPECIFIC DETAILS:
            ${projectDetails}
            
            OUTPUT STYLE:
            Professional Architectural Presentation. Clean, crisp, and high-resolution.`;

            // Calculate aspect ratio
            let selectedAspectRatio: any = '16:9';
            if (baseImage) {
                const img = new Image();
                img.src = baseImage;
                await new Promise((resolve) => { img.onload = resolve; });
                const ratio = img.width / img.height;

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
                baseImage, // Base Image
                'Realistic', // Style
                'Professional Architectural Render', // Style Instruction
                viewType, // View Type
                fullPrompt, // Prompt
                null, // Site Context
                styleImages, // Reference Images (Style)
                selectedAspectRatio,
                '1K',
                [],
                undefined,
                undefined,
                'Interior', // Defaulting to Interior for plans/sections usually works well, or could be dynamic
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

                {/* Base Image Input */}
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 relative group min-h-[200px] flex flex-col overflow-hidden shrink-0">
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-[10px] font-bold text-slate-900 bg-white/90 px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                        <FileText size={12} /> CAD Drawing
                    </div>
                    {baseImage ? (
                        <div className="relative w-full h-full">
                            <img src={baseImage} alt="Base" className="w-full h-full object-contain bg-slate-50" />
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
                            <p className="text-sm font-medium text-slate-900">Upload CAD File</p>
                            <p className="text-xs text-slate-400 mt-1 text-center px-4">Plan, Section, or Elevation (Image format)</p>
                            <input type="file" ref={baseInputRef} onChange={(e) => handleFileUpload(e, setBaseImage)} className="hidden" />
                        </div>
                    )}
                </div>

                {/* View Type Selector */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Layers size={12} /> Drawing Type
                    </h4>
                    <div className="relative">
                        <select
                            value={viewType}
                            onChange={(e) => setViewType(e.target.value as ViewType)}
                            className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-slate-500 focus:border-slate-500 block p-2.5 pr-8"
                        >
                            <option value={ViewType.PLAN}>Floor Plan</option>
                            <option value={ViewType.SECTION}>Section</option>
                            <option value={ViewType.ELEVATION}>Elevation</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* Project Details */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                        Design Details
                    </h4>
                    <textarea
                        value={projectDetails}
                        onChange={(e) => setProjectDetails(e.target.value)}
                        placeholder="Describe materials, lighting, colors, or specific design elements..."
                        className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 min-h-[100px] resize-none"
                    />
                </div>

                {/* Style References */}
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                            <Sparkles size={12} /> Style References (Optional)
                        </h4>
                        <button
                            onClick={() => styleInputRef.current?.click()}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                        >
                            <Plus size={12} /> Add
                        </button>
                        <input type="file" multiple ref={styleInputRef} onChange={(e) => handleMultiUpload(e, styleImages, setStyleImages)} className="hidden" />
                    </div>

                    {styleImages.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                            {styleImages.map((img, idx) => (
                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
                                    <img src={img} alt={`Style ${idx}`} className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => removeImage(idx, styleImages, setStyleImages)}
                                        className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={10} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-slate-400 italic">Upload images of the desired look.</p>
                    )}
                </div>

                {/* Generate Button */}
                <Button
                    onClick={handleGenerate}
                    disabled={!baseImage || isGenerating}
                    className="w-full py-4 text-sm font-bold shadow-lg shadow-blue-500/20"
                >
                    {isGenerating ? (
                        <>
                            <RefreshCw size={18} className="animate-spin mr-2" />
                            Rendering Drawing...
                        </>
                    ) : (
                        <>
                            <Sparkles size={18} className="mr-2" />
                            Generate Render
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
                            alt="Rendered Drawing"
                            className="w-full h-full object-contain"
                        />
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="bg-white text-slate-900 p-2 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
                                <Maximize size={20} />
                            </button>
                            <a
                                href={generatedImage}
                                download="cad-render.png"
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
                        <FileText size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-sm font-medium">Rendered drawing will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
};
