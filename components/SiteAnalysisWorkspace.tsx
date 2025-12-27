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
    projectDetails: string;
    googleMapsLink: string;
}

export const SiteAnalysisWorkspace: React.FC<SiteAnalysisWorkspaceProps> = ({ template }) => {
    const [baseImage, setBaseImage] = useState<string | null>(template.baseImage);
    const [sketchImage, setSketchImage] = useState<string | null>(null);
    const [styleImages, setStyleImages] = useState<string[]>([]);
    const [siteData, setSiteData] = useState<SiteData>({
        location: '',
        northOrientation: 'Top (Up)',
        windDirection: 'SW',
        projectDetails: '',
        googleMapsLink: ''
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(template.outputImage || null);
    const [error, setError] = useState<string | null>(null);

    const baseInputRef = useRef<HTMLInputElement>(null);
    const sketchInputRef = useRef<HTMLInputElement>(null);
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

    const handleStyleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach((file: File) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (event.target?.result && typeof event.target.result === 'string') {
                        setStyleImages(prev => [...prev, event.target.result as string]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleGenerate = async () => {
        if (!baseImage) return;

        setIsGenerating(true);
        setError(null);

        try {
            // Detailed prompt from the user's reference image
            const basePrompt = `Create a highly detailed, professional 3D isometric site analysis diagram from this aerial image.
            
            CRITICAL: The specific site is marked with a RED OUTLINE or RED FILL in the input image. You MUST strictly isolate this area as the project site. Extrude the massing within this red boundary to show the proposed building volume (conceptual massing).

            LOCATION CONTEXT:
            - Use the provided Location and Google Maps Link to determine the correct latitude/longitude.
            - ACCURATE SUN PATH: Generate a 3D sun path arc that is scientifically accurate for this specific location's latitude. Show the sun's position (e.g., Summer Solstice).
            - ACCURATE WIND: Use the prevailing wind direction for this specific geographic region (unless overridden by user input).

            REQUIRED ANALYSIS LAYERS (Must be visualized in 3D):
            1.  **Sun & Shading**:
                -   Draw a clear yellow 3D arc for the sun path.
                -   Cast realistic shadows based on the sun's position to show self-shading and impact on neighbors.
                -   Label "Solar Heat Gain" on exposed facades.
            
            2.  **Wind & Ventilation**:
                -   Draw 3D flow arrows around the building massing.
                -   Blue arrows for cool prevailing winds.
                -   Red arrows for blocked or warm air pockets.
                -   Show how the building form allows for cross-ventilation if applicable.

            3.  **Access & Circulation**:
                -   **Drop-off**: Mark the main vehicle drop-off point with a specific icon/label.
                -   **Service**: Show a separate service route/entry with a dashed line.
                -   **Pedestrian**: Bold arrows showing main entry approach.

            4.  **Noise & Privacy**:
                -   **Noise**: Visualize noise sources (e.g., from main roads) using jagged/zigzag lines or sound wave icons hitting the facade.
                -   **Privacy**: Use gradient planes or icons to indicate private zones vs public active frontages.

            5.  **Vegetation & Topography**:
                -   **Existing Trees**: Identify existing trees on the site (from the image). Mark them as "Preserved" with green canopies.
                -   **Slope**: If the site is sloping (check user input), show drainage arrows pointing downslope.

            STYLE:
            -   High-end architectural diagram.
            -   Clean white/clay model base for the city context.
            -   Pastel colors for analysis overlays (Yellow=Sun, Blue=Wind, Red=Site/Noise, Green=Nature).
            -   Floating 3D text labels with leader lines for all key elements.
            -   Remove all original map labels/pins.`;

            const siteContext = `
            SITE CONTEXT & ENVIRONMENTAL DATA:
            - Location: ${siteData.location}
            - Google Maps Link: ${siteData.googleMapsLink}
            - North Orientation (in input image): ${siteData.northOrientation}
            - Prevailing Wind: From ${siteData.windDirection}
            - Project Details & Constraints: ${siteData.projectDetails}
            `;

            let fullPrompt = `${basePrompt} \n\n${siteContext}`;

            if (sketchImage) {
                fullPrompt += `\n\nREFERENCE SKETCH: A hand-drawn sketch is provided (Image #2). Use the diagrams and notes in this sketch as a PRIMARY source of truth for wind direction, sun path, and key site features.`;
            }

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
                'Diagram',
                '3D Isometric Site Analysis',
                ViewType.AXONOMETRIC,
                fullPrompt,
                sketchImage, // siteBase64Image (Context)
                styleImages, // referenceBase64Images (Style)
                selectedAspectRatio,
                '1K',
                [],
                undefined,
                undefined,
                'Exterior',
                [],
                undefined,
                null,
                null
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
                            <p className="text-xs text-slate-400 mt-1 text-center px-4">Google Maps Screenshot<br /><span className="text-red-500 font-medium">Mark site with RED outline</span></p>
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

                    {/* Google Maps Link */}
                    <div>
                        <label className="text-xs font-medium text-slate-700 mb-1 block flex items-center gap-1"><MapPin size={10} /> Google Maps Link (Optional)</label>
                        <input
                            type="text"
                            value={siteData.googleMapsLink}
                            onChange={(e) => setSiteData({ ...siteData, googleMapsLink: e.target.value })}
                            placeholder="Paste Google Maps URL here..."
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* North Orientation */}
                        <div>
                            <label className="text-xs font-medium text-slate-700 mb-1 block flex items-center gap-1"><Compass size={10} /> Where is North in this image?</label>
                            <select
                                value={siteData.northOrientation}
                                onChange={(e) => setSiteData({ ...siteData, northOrientation: e.target.value })}
                                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                            >
                                {['Top (Up)', 'Top-Right', 'Right', 'Bottom-Right', 'Bottom (Down)', 'Bottom-Left', 'Left', 'Top-Left'].map(dir => (
                                    <option key={dir} value={dir}>{dir}</option>
                                ))}
                            </select>
                        </div>
                        {/* Wind Direction */}
                        <div>
                            <label className="text-xs font-medium text-slate-700 mb-1 block flex items-center gap-1"><Wind size={10} /> Prevailing Wind (Cardinal)</label>
                            <select
                                value={siteData.windDirection}
                                onChange={(e) => setSiteData({ ...siteData, windDirection: e.target.value })}
                                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                            >
                                {['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'].map(dir => (
                                    <option key={dir} value={dir}>{dir}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Project Details */}
                    <div>
                        <label className="text-xs font-medium text-slate-700 mb-1 block flex items-center gap-1"><MapPin size={10} /> Project Details</label>
                        <textarea
                            value={siteData.projectDetails}
                            onChange={(e) => setSiteData({ ...siteData, projectDetails: e.target.value })}
                            placeholder="Describe site conditions, constraints, design goals, noise sources, topography, views, access..."
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 min-h-[100px]"
                        />
                    </div>

                    {/* Style Reference Images */}
                    <div className="pt-2 border-t border-slate-100">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <Sparkles size={10} /> Style References (Optional)
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {styleImages.map((img, idx) => (
                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
                                    <img src={img} alt={`Style ${idx}`} className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => setStyleImages(prev => prev.filter((_, i) => i !== idx))}
                                        className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={10} />
                                    </button>
                                </div>
                            ))}
                            <div
                                className="aspect-square border border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
                                onClick={() => styleInputRef.current?.click()}
                            >
                                <Upload size={16} className="text-slate-400 mb-1" />
                                <span className="text-[10px] text-slate-500">Add</span>
                                <input type="file" ref={styleInputRef} onChange={handleStyleImagesUpload} multiple className="hidden" />
                            </div>
                        </div>
                    </div>

                    {/* Bonus Sketch Upload */}
                    <div className="pt-2 border-t border-slate-100">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <Sparkles size={10} /> Bonus: Hand Drawn Sketch
                        </label>
                        <div
                            className="border border-dashed border-slate-300 rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors relative"
                            onClick={() => !sketchImage && sketchInputRef.current?.click()}
                        >
                            {sketchImage ? (
                                <div className="relative w-full h-24">
                                    <img src={sketchImage} alt="Sketch" className="w-full h-full object-contain" />
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setSketchImage(null); }}
                                        className="absolute top-0 right-0 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Upload size={16} className="text-slate-400 mb-1" />
                                    <p className="text-xs text-slate-500 text-center">Upload sketch with diagrams</p>
                                    <input type="file" ref={sketchInputRef} onChange={(e) => handleFileUpload(e, setSketchImage)} className="hidden" />
                                </>
                            )}
                        </div>
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
