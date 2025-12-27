import React, { useState, useEffect } from 'react';
import { Layout, Home, Building2, Trees, Sofa, ArrowRight, Star, Copy, Box, Sparkles, Download, RefreshCw, Maximize, X, Upload, ArrowLeft } from 'lucide-react';
import { Button } from './Button';
import { MaterialSwapWorkspace } from './MaterialSwapWorkspace';
import { SiteAnalysisWorkspace } from './SiteAnalysisWorkspace';
import { DesignInsertionWorkspace } from './DesignInsertionWorkspace';

export interface Template {
    id: string;
    title: string;
    description: string;
    category: 'Residential' | 'Commercial' | 'Interior' | 'Landscape' | 'Urban' | 'Exterior';
    baseImage: string;
    outputImage: string;
    prompt: string;
    style: string;
    instructions: string;
    materialImage?: string;
}

export const TEMPLATES: Template[] = [
    {
        id: 'sat-1',
        title: 'Satellite to Drone Shot',
        description: 'Convert flat satellite imagery into realistic 3D drone photography.',
        category: 'Urban',
        baseImage: '/satellite-base.jpg',
        outputImage: '/satellite-output.jpg',
        prompt: 'A masterpiece architectural visualization drone shot, transforming the provided satellite imagery into a hyper-realistic 3D environment. Capture the scene from a high-angle oblique perspective to reveal building heights and terrain topography. Lighting: Golden hour cinematic illumination with long, dramatic shadows casting depth across the landscape. Atmosphere: volumetric haze, warm sunlight, and aerial perspective. Details: 3D volumetric trees, realistic water reflections, textured road surfaces, and detailed roofscapes. Camera: Phase One IQ4 150MP, 80mm lens, f/5.6, sharp focus. Style: Photorealistic, 8k resolution, high dynamic range, no text or labels.',
        style: 'Realistic',
        instructions: 'This template transforms flat satellite imagery into realistic 3D drone photography. It adds depth, lighting, and environmental details to create a cinematic aerial shot.'
    },
    {
        id: 'sketch-1',
        title: 'Image to Professional Model Photography',
        description: 'Turn any image or massing model into high-end architectural model photography.',
        category: 'Commercial',
        baseImage: '/templates/Image to Professional Model Photography_BEFORE.JPG',
        outputImage: '/templates/Image to Professional Model Photography_AFTER.jpg',
        prompt: 'Transform this architectural image/massing into a professional, high-end architectural model photograph. Physical model aesthetic, clean materials, studio lighting, museum quality. Interpret the volumes as a precise physical model made of high-quality materials (wood, acrylic, metal).',
        style: 'Photorealistic',
        instructions: 'Upload a photo of a rough model, a massing screenshot, or a sketch. This template converts it into a polished, professional architectural model photograph.'
    },
    {
        id: 'model-doodle',
        title: 'Model to Architectural Doodle',
        description: 'Convert physical models or 3D views into charming, hand-drawn architectural doodles.',
        category: 'Exterior',
        baseImage: '/templates/Model to Architectural Doodle_BEFORE.jpg',
        outputImage: '/templates/Model to Architectural Doodle_AFTER.jpg',
        prompt: 'An architectural illustration of the image. The scene is presented as an isometric aerial view, looking down onto the entire development to show its massing and context. The image must be rendered in a loose, naive, hand-drawn style using a thin black ink pen on white paper. The linework should be tremulous and jittery, avoiding any straight ruler lines. Incorporate corner overshoots where vertical and horizontal lines meet to emphasize the speed of the sketch. There are no grey washes, shadows, colors, or digital rendering effects; it is purely linework. The drawing must be densely populated with linework for entourage elements, including small scale figures, abundant vegetation on rooftops and ground levels, and street furniture. The vegetation should be depicted as abstract, scalloped cloud-shapes without internal detail. The people should be rendered as tiny, amorphous blobs and gestural outlines, lacking distinct limbs or faces. No hatches or textures. The image must include several text annotations that blend seamlessly with the drawing style. The text should not look like a digital font. It must appear as spontaneous, hurried hand-lettering written with the exact same shakiness and ink flow as the architectural lines. The letters should be slightly irregular, naive all-caps doodles and describe different parts of the design use and elements. The final result should feel like a charming, spontaneous "napkin sketch" or "doodle" that celebrates irregularity and imperfection, strictly in black and white.',
        style: 'Architectural Doodle',
        instructions: 'Upload a photo of your model or a 3D screenshot. This template converts it into a loose, hand-drawn architectural doodle with annotations.'
    },
    {
        id: 'paper-1',
        title: 'Image/Render to Paper Model',
        description: 'Convert any architectural image into a clean white paper model.',
        category: 'Urban',
        baseImage: '/curzon-hall-base.jpg',
        outputImage: '/curzon-hall-paper.jpg',
        prompt: "Architectural white paper model, pure white matte texture, thin paperly, Slightly creased, a bit crumpled, with a papery texture, Mildly crimped and crinkled. Clean precision cuts, layered paper edges, soft ambient occlusion shadows, studio lighting. Minimalist, abstract, high key. No colors, just white paper geometry.",
        style: 'Paper Model',
        instructions: "Upload a photo, render, or sketch. This template converts it into a clean, white architectural paper model style. Perfect for massing studies and conceptual presentations."
    },


    {
        id: 'material-swap',
        title: 'Material Swap',
        description: 'Instantly swap materials on existing surfaces.',
        category: 'Interior',
        baseImage: '/templates/Material Swap_Base.jpg',
        outputImage: '/templates/Material Swap_Output.jpg',
        materialImage: '/templates/Material Swap_Material Reference.jpg',
        prompt: 'Architectural visualization, material study. Change the specific material to [TARGET_MATERIAL]. Maintain lighting and geometry.',
        style: 'Realistic',
        instructions: 'Select a surface and choose a new material to apply. (Coming Soon)'
    },
    {
        id: 'site-analysis',
        title: 'Site Analysis Diagram',
        description: 'Generate international studio-level 3D site analysis with environmental data.',
        category: 'Urban',
        baseImage: '/templates/site-analysis-input-image.jpg',
        outputImage: '/templates/site-analysis-output.png',
        prompt: 'International studio level architectural site analysis diagram. 3D isometric view. Extrude volume massing based on the input plan/satellite image to show building heights. Features: 1) Sun path + shading logic with solar arc. 2) Wind flow + ventilation logic arrows. 3) Views + privacy analysis. 4) Noise map visualization. 5) Slope + drainage indicators. 6) Existing trees preserved vs removed. 7) Access + drop-off + service routes. 8) Location map hierarchy (city -> neighborhood -> plot). 9) Site plan details: edges, access, levels. 10) Sun/shadow diagrams + heat zones. 11) Wind diagram + comfort zones. 12) Surrounding building heights / privacy. 13) Opportunities vs constraints (simple 2-column layout). 14) Key design response rules (e.g., "open to north, block west sun"). Style: Professional, clean, high-end architectural presentation, vector-style overlays on 3D massing, pastel colors, clear legends.',
        style: 'Diagram',
        instructions: 'Upload a site plan or satellite image. In the "Project Details" section, please provide: 1) Site Location & Coordinates, 2) North Orientation, 3) Prevailing Wind Direction, 4) Main Noise Sources, 5) Topography/Slope details, 6) Key Views to preserve/block. This ensures the analysis is 100% accurate to your site.'
    },
    {
        id: 'design-insertion',
        title: 'Design Insertion',
        description: 'Seamlessly insert your 3D model into a site photo.',
        category: 'Exterior',
        baseImage: '/templates/design-insertion-input.jpg',
        outputImage: '/templates/design-insertion-output.jpg',
        prompt: 'Photorealistic architectural montage. Insert modern building design into the provided site context. Match lighting, shadows, and perspective.',
        style: 'Realistic',
        instructions: 'Upload a site photo (with RED OUTLINE for location) and your 3D model view. The AI will merge them seamlessly.'
    },
    {
        id: 'floor-plan-iso',
        title: 'Floor Plan to Isometric',
        description: 'Convert 2D floor plans into 3D isometric renders.',
        category: 'Interior',
        baseImage: 'https://images.unsplash.com/photo-1593604340977-2b6f00c5643b?q=80&w=800&auto=format&fit=crop',
        outputImage: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=800&auto=format&fit=crop',
        prompt: '3D isometric floor plan render, cutaway view. Realistic textures, furniture, and lighting. Clean white background.',
        style: 'Isometric',
        instructions: 'Upload a 2D floor plan to generate a detailed 3D isometric view. (Coming Soon)'
    },
    {
        id: 'restoration',
        title: 'Building Restoration',
        description: 'Visualize restoration of old or damaged buildings.',
        category: 'Exterior',
        baseImage: 'https://images.unsplash.com/photo-1599695665288-6625272c72b8?q=80&w=800&auto=format&fit=crop',
        outputImage: 'https://images.unsplash.com/photo-1599695665288-6625272c72b8?q=80&w=800&auto=format&fit=crop', // Placeholder
        prompt: 'Architectural restoration visualization. Restore the building to its original glory. Clean facade, repaired details, fresh paint. Photorealistic.',
        style: 'Restoration',
        instructions: 'Upload a photo of an old building to see it restored. (Coming Soon)'
    },
    {
        id: 'cad-render',
        title: 'CAD to Plan/Section Render',
        description: 'Turn CAD line drawings into textured renders.',
        category: 'Interior',
        baseImage: 'https://images.unsplash.com/photo-1631557348938-1a52994f7963?q=80&w=800&auto=format&fit=crop',
        outputImage: 'https://images.unsplash.com/photo-1631557348938-1a52994f7963?q=80&w=800&auto=format&fit=crop', // Placeholder
        prompt: 'Architectural plan render, top-down view. Realistic textures, flooring, furniture, and shadows. Professional presentation style.',
        style: 'Plan Render',
        instructions: 'Upload a CAD file or line drawing to generate a textured plan or section render. (Coming Soon)'
    }
];

interface TemplateGalleryProps {
    selectedTemplateId: string;
    onUseTemplate: (template: Template, modifiedPrompt: string) => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({ selectedTemplateId, onUseTemplate }) => {
    const [currentPrompt, setCurrentPrompt] = useState<string>('');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);

    // Load template data when selection changes
    useEffect(() => {
        const template = TEMPLATES.find(t => t.id === selectedTemplateId);
        if (template) {
            setCurrentPrompt(template.prompt);
            setGeneratedImage(template.outputImage);
        }
    }, [selectedTemplateId]);

    const selectedTemplate = TEMPLATES.find(t => t.id === selectedTemplateId);

    const handleUseTemplate = () => {
        if (selectedTemplate) {
            onUseTemplate(selectedTemplate, currentPrompt);
        }
    };

    return (
        <div className="w-full max-w-7xl h-[85vh] bg-white rounded-2xl border border-slate-200 shadow-xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
                <div>
                    <h1 className="text-lg font-bold text-slate-900">{selectedTemplate?.title}</h1>
                    <p className="text-xs text-slate-500">Interactive Template Workspace</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium border border-green-100">
                        Ready to Use
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 flex gap-6 overflow-y-auto bg-slate-50/50">
                {selectedTemplateId === 'material-swap' ? (
                    <MaterialSwapWorkspace template={selectedTemplate} />
                ) : selectedTemplateId === 'site-analysis' ? (
                    <SiteAnalysisWorkspace template={selectedTemplate} />
                ) : selectedTemplateId === 'design-insertion' ? (
                    <DesignInsertionWorkspace template={selectedTemplate} />
                ) : (
                    <>
                        {/* Left Column of Workspace: Inputs */}
                        <div className="w-1/3 flex flex-col gap-4">
                            {/* Base Geometry Card */}
                            <div className="flex-1 bg-white rounded-2xl border border-dashed border-slate-300 relative group min-h-[200px] flex flex-col overflow-hidden">
                                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-[10px] font-bold text-slate-900 bg-white/90 px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                                    <Box size={12} /> Base Geometry
                                </div>
                                <div className="flex-1 relative">
                                    <img
                                        src={selectedTemplate?.baseImage}
                                        alt="Base"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 hover:opacity-100 cursor-not-allowed">
                                        <span className="bg-black/70 text-white text-xs px-3 py-1 rounded-full">Preset (Locked)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Controls Card */}
                            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">
                                    <RefreshCw size={12} /> Instructions
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            {selectedTemplate?.instructions}
                                        </p>
                                    </div>
                                    <Button
                                        onClick={handleUseTemplate}
                                        className="w-full bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center gap-2"
                                    >
                                        <Sparkles size={16} />
                                        Use This Template
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Right Column of Workspace: Output */}
                        <div className="w-2/3 bg-white rounded-2xl border border-slate-200 shadow-sm relative flex items-center justify-center overflow-hidden">
                            <div className="absolute top-4 left-4 z-10 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                                Final Output
                            </div>

                            <div className="relative w-full h-full group">
                                <img
                                    src={generatedImage || ''}
                                    alt="Output"
                                    className="w-full h-full object-contain bg-slate-50"
                                />

                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => window.open(generatedImage || '', '_blank')}
                                        className="p-2 bg-white/90 backdrop-blur rounded-lg hover:bg-white text-slate-700 shadow-sm"
                                        title="Open full size"
                                    >
                                        <Maximize size={20} />
                                    </button>
                                    <button
                                        className="p-2 bg-white/90 backdrop-blur rounded-lg hover:bg-white text-slate-700 shadow-sm"
                                        title="Download"
                                    >
                                        <Download size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
