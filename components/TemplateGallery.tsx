import React, { useState, useEffect } from 'react';
import { Layout, Home, Building2, Trees, Sofa, ArrowRight, Star, Copy, Box, Sparkles, Download, RefreshCw, Maximize, X, Upload, ArrowLeft } from 'lucide-react';
import { Button } from './Button';

export interface Template {
    id: string;
    title: string;
    description: string;
    category: 'Residential' | 'Commercial' | 'Interior' | 'Landscape' | 'Urban';
    baseImage: string;
    outputImage: string;
    prompt: string;
    style: string;
    instructions: string;
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
        title: 'Sketch to Professional Model Photography',
        description: 'Turn sketches or massing models into high-end architectural model photography.',
        category: 'Commercial',
        baseImage: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?q=80&w=800&auto=format&fit=crop',
        outputImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
        prompt: 'Transform this architectural sketch/massing into a professional, high-end photorealistic rendering. Interpret the lines and volumes as a completed building with realistic materials (glass, concrete, metal). Lighting: Natural daylight with soft shadows. Context: Urban or landscaped setting appropriate to the building. Style: Architectural photography, 8k, highly detailed, sharp focus.',
        style: 'Photorealistic',
        instructions: 'Upload a raw sketch, line drawing, or 3D massing screenshot. This template converts it into a polished, professional architectural photograph. After selecting this template, replace the demo image with your own, then choose any Style from the library and optionally add a Reference Image.'
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
            </div>
        </div>
    );
};
