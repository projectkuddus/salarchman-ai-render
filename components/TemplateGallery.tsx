import React, { useState, useEffect } from 'react';
import { Layout, Home, Building2, Trees, Sofa, ArrowRight, Star, Copy, Box, Sparkles, Download, RefreshCw, Maximize, X, Upload, ArrowLeft } from 'lucide-react';
import { Button } from './Button';

interface Template {
    id: string;
    title: string;
    description: string;
    category: 'Residential' | 'Commercial' | 'Interior' | 'Landscape' | 'Urban';
    baseImage: string;
    outputImage: string;
    prompt: string;
    style: string;
}

const TEMPLATES: Template[] = [
    {
        id: 'res-1',
        title: 'Modern Minimalist Villa',
        description: 'Clean geometric lines with large glass facades.',
        category: 'Residential',
        baseImage: 'https://images.unsplash.com/photo-1600596542815-2495db969cf7?q=80&w=800&auto=format&fit=crop',
        outputImage: 'https://images.unsplash.com/photo-1600596542815-2495db969cf7?q=80&w=800&auto=format&fit=crop',
        prompt: 'Modern minimalist villa, concrete and glass, sunset',
        style: 'Photorealistic'
    },
    {
        id: 'res-2',
        title: 'Sustainable Eco-Cabin',
        description: 'Wooden cabin integrated with nature.',
        category: 'Residential',
        baseImage: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=800&auto=format&fit=crop',
        outputImage: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=800&auto=format&fit=crop',
        prompt: 'Eco-friendly wooden cabin, forest setting, morning light',
        style: 'Realistic'
    },
    {
        id: 'com-1',
        title: 'Tech Office HQ',
        description: 'Glass and steel office complex.',
        category: 'Commercial',
        baseImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
        outputImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
        prompt: 'High-tech office building, glass facade, urban context',
        style: 'Futuristic'
    },
    {
        id: 'mat-1',
        title: 'Material & Finish Swap',
        description: 'Test different materials on an existing render in seconds.',
        category: 'Commercial',
        baseImage: '/templates/material-swap-example.png',
        outputImage: '/templates/material-swap-example.png',
        prompt: 'Change the timber cladding to reflective zinc panels. Keep everything else exactly the same.',
        style: 'Realistic'
    }
];

export const TemplateGallery: React.FC = () => {
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
    const [currentPrompt, setCurrentPrompt] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);

    // Load template data when selection changes
    useEffect(() => {
        if (selectedTemplateId) {
            const template = TEMPLATES.find(t => t.id === selectedTemplateId);
            if (template) {
                setCurrentPrompt(template.prompt);
                setGeneratedImage(template.outputImage);
            }
        } else {
            // Reset when going back to gallery
            setCurrentPrompt('');
            setGeneratedImage(null);
        }
    }, [selectedTemplateId]);

    const selectedTemplate = TEMPLATES.find(t => t.id === selectedTemplateId);

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            alert("This is a template demo. In the full version, this would generate a new image based on your modified prompt!");
        }, 1500);
    };

    if (!selectedTemplateId) {
        // GALLERY VIEW
        return (
            <div className="w-full max-w-7xl h-[85vh] bg-white rounded-2xl border border-slate-200 shadow-xl flex flex-col overflow-hidden">
                <div className="p-8 border-b border-slate-100 bg-white">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Design Templates</h1>
                    <p className="text-slate-500">Select a starting point for your project.</p>
                </div>

                <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {TEMPLATES.map(template => (
                            <button
                                key={template.id}
                                onClick={() => setSelectedTemplateId(template.id)}
                                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left flex flex-col h-full"
                            >
                                <div className="relative h-64 overflow-hidden w-full">
                                    <img
                                        src={template.outputImage}
                                        alt={template.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-slate-700 shadow-sm">
                                        {template.category}
                                    </div>
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <span className="bg-white text-slate-900 px-4 py-2 rounded-full font-medium shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                            Use Template
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{template.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed">{template.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // WORKSPACE VIEW
    return (
        <div className="w-full max-w-7xl h-[85vh] bg-white rounded-2xl border border-slate-200 shadow-xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSelectedTemplateId(null)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors"
                        title="Back to Templates"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="h-6 w-px bg-slate-200"></div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">{selectedTemplate?.title}</h1>
                        <p className="text-xs text-slate-500">Interactive Template Workspace</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
                        Read-Only Mode (Demo)
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 flex gap-6 overflow-y-auto bg-slate-50">
                {/* Left Column: Inputs */}
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
                            <RefreshCw size={12} /> Template Settings
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">Prompt</label>
                                <textarea
                                    value={currentPrompt}
                                    onChange={(e) => setCurrentPrompt(e.target.value)}
                                    className="w-full h-32 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none"
                                />
                            </div>
                            <Button
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="w-full bg-slate-900 text-white hover:bg-slate-800"
                            >
                                {isGenerating ? 'Updating...' : 'Update Generation'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Output */}
                <div className="w-2/3 bg-white rounded-2xl border border-slate-200 shadow-sm relative flex items-center justify-center overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                        Final Output
                    </div>

                    <div className="relative w-full h-full group">
                        <img
                            src={generatedImage || ''}
                            alt="Output"
                            className={`w-full h-full object-contain bg-slate-50 transition-opacity duration-500 ${isGenerating ? 'opacity-50 blur-sm' : 'opacity-100'}`}
                        />

                        {!isGenerating && (
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
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
