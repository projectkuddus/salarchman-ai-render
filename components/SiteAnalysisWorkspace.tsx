import React, { useState, useRef } from 'react';
import { Box, Upload, X, RefreshCw, Sparkles, Download, Maximize, Image as ImageIcon, Map, MapPin, Wind, Volume2, Mountain, Eye, Footprints, Compass } from 'lucide-react';
import { Button } from './Button';
import { generateArchitecturalRender } from '../services/geminiService';
import { ViewType, RenderStyle } from '../types';

interface SiteAnalysisWorkspaceProps {
    template: any;
}

interface SiteData {
    location: string;
    northOrientation: string;
    windDirection: string;
    noiseSources: string;
    topography: string;
    views: string;
    access: string;
}

export const SiteAnalysisWorkspace: React.FC<SiteAnalysisWorkspaceProps> = ({ template }) => {
    const [baseImage, setBaseImage] = useState<string | null>(template.baseImage);
    const [siteData, setSiteData] = useState<SiteData>({
        location: '',
        northOrientation: 'North',
        windDirection: 'SW',
        noiseSources: '',
        topography: '',
        views: '',
        access: ''
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(template.outputImage || null);
    const [error, setError] = useState<string | null>(null);

    const baseInputRef = useRef<HTMLInputElement>(null);

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
            // Detailed prompt from the user's reference image
            const basePrompt = `Create a site analysis diagram from this aerial image in a flat vector graphic style. The view is orientated north-facing (north at the top). Use the visible map labels for context to understand the site and surroundings, but remove all existing labels and icons from the final output. Use a muted, desaturated base map with soft greys for buildings and pale tones for context. Retain landscape features such as trees, grass, parks, and water - render these as simplified vector shapes in soft pastel tones (sage greens for vegetation, pale blues for water). Identify the site marked with a red boundary line (if visible, otherwise infer from context or center) and fill it with a soft pastel red with a bold red outline. Add a transparent gradient halo around the site showing its zone of influence. Add dashed radial lines for key sight lines and view corridors to notable landmarks. Show a single sun path arc across the bottom of the diagram - rising from the east (right side) and setting in the west (left side) with simple yellow sun icons at each end and a curved arrow connecting them. Show primary pedestrian and vehicle access routes with bold black arrows. Include a simple north arrow pointing to the top of the diagram. Add your own clean sans-serif labels with leader lines identifying key features, streets, and landmarks relevant to the site. Keep it clean, diagrammatic, and presentation-ready - no photorealism.`;

            const siteContext = `
            SITE CONTEXT & ENVIRONMENTAL DATA:
            - Location: ${siteData.location}
            - North Orientation: ${siteData.northOrientation}
            - Prevailing Wind: From ${siteData.windDirection}
            - Noise Sources: ${siteData.noiseSources}
            - Topography: ${siteData.topography}
            - Key Views: ${siteData.views}
            - Access & Circulation: ${siteData.access}
            `;

            const fullPrompt = `${basePrompt} \n\n${siteContext}`;

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
            }

            const result = await generateArchitecturalRender(
                baseImage,
                'Diagram', // Style
                'Vector Site Analysis', // Style Instruction
                ViewType.TOPSHOT, // View Type
                fullPrompt, // Additional Prompt
                null, // Site
                null, // Reference
                selectedAspectRatio, // Aspect Ratio
                '1K', // Image Size
                [], // Verbs
                undefined, // Ideation Config
                undefined, // Diagram Type
                'Exterior', // Create Mode
                [], // Atmospheres
                undefined, // Elevation Side
                null, // Material 1
                null // Material 2
            );

            setGeneratedImage(result);
        } catch (err: any) {
            console.error("Analysis failed:", err);
            setError(err.message || "Failed to generate analysis");
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
                        <Map size={12} /> Site Map / Satellite
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
                            <p className="text-sm font-medium text-slate-900">Upload Site Map</p>
                            <p className="text-xs text-slate-400 mt-1">Google Maps Screenshot or Plan</p>
                            <input type="file" ref={baseInputRef} onChange={(e) => handleFileUpload(e, setBaseImage)} className="hidden" />
                        </div>
                    )}
                </div>

                {/* Structured Inputs */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 flex-1 flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <MapPin size={12} /> Project Details
                    </div>

                    {/* Location */}
                    <div>
                        <label className="text-xs font-medium text-slate-700 mb-1 block">Site Location</label>
                        <input
                            type="text"
                            value={siteData.location}
                            onChange={(e) => setSiteData({ ...siteData, location: e.target.value })}
                            placeholder="e.g. Downtown Manchester, UK"
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* North Orientation */}
                        <div>
                            <label className="text-xs font-medium text-slate-700 mb-1 block flex items-center gap-1"><Compass size={10} /> North</label>
                            <select
                                value={siteData.northOrientation}
                                onChange={(e) => setSiteData({ ...siteData, northOrientation: e.target.value })}
                                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                            >
                                {['North', 'NE', 'East', 'SE', 'South', 'SW', 'West', 'NW'].map(dir => (
                                    <option key={dir} value={dir}>{dir}</option>
                                ))}
                            </select>
                        </div>
                        {/* Wind Direction */}
                        <div>
                            <label className="text-xs font-medium text-slate-700 mb-1 block flex items-center gap-1"><Wind size={10} /> Wind From</label>
                            <select
                                value={siteData.windDirection}
                                onChange={(e) => setSiteData({ ...siteData, windDirection: e.target.value })}
                                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                            >
                                {['North', 'NE', 'East', 'SE', 'South', 'SW', 'West', 'NW'].map(dir => (
                                    <option key={dir} value={dir}>{dir}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Noise Sources */}
                    <div>
                        <label className="text-xs font-medium text-slate-700 mb-1 block flex items-center gap-1"><Volume2 size={10} /> Noise Sources</label>
                        <input
                            type="text"
                            value={siteData.noiseSources}
                            onChange={(e) => setSiteData({ ...siteData, noiseSources: e.target.value })}
                            placeholder="e.g. Highway to the North, Train line"
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                    </div>

                    {/* Topography */}
                    <div>
                        <label className="text-xs font-medium text-slate-700 mb-1 block flex items-center gap-1"><Mountain size={10} /> Topography</label>
                        <input
                            type="text"
                            value={siteData.topography}
                            onChange={(e) => setSiteData({ ...siteData, topography: e.target.value })}
                            placeholder="e.g. Flat, Sloping South, Steep"
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                    </div>

                    {/* Key Views */}
                    <div>
                        <label className="text-xs font-medium text-slate-700 mb-1 block flex items-center gap-1"><Eye size={10} /> Key Views</label>
                        <input
                            type="text"
                            value={siteData.views}
                            onChange={(e) => setSiteData({ ...siteData, views: e.target.value })}
                            placeholder="e.g. View to River, Park view"
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                    </div>

                    {/* Access */}
                    <div>
                        <label className="text-xs font-medium text-slate-700 mb-1 block flex items-center gap-1"><Footprints size={10} /> Access & Circulation</label>
                        <input
                            type="text"
                            value={siteData.access}
                            onChange={(e) => setSiteData({ ...siteData, access: e.target.value })}
                            placeholder="e.g. Main entry from High St, Service from rear"
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                    </div>

                    <Button
                        onClick={handleGenerate}
                        disabled={!baseImage || isGenerating}
                        className="w-full bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center gap-2 py-3 rounded-xl shadow-lg shadow-slate-900/10 mt-2"
                    >
                        {isGenerating ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} />}
                        {isGenerating ? 'Analyzing Site...' : 'Generate Analysis'}
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
                                download="site-analysis.png"
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
