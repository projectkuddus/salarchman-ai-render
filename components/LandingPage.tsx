import React from 'react';
import { Box, Sparkles, Search, X } from 'lucide-react';

interface LandingPageProps {
    onGetStarted: () => void;
}

const DEVELOPER_GALLERY = [
    "/gallery/animan-sketch-to-render.jpg?v=1",
    "/gallery/renderman-ai-1766242446688.jpg?v=1",
    "/gallery/archivision-1765932433653.jpg?v=1",
    "/gallery/renderman-ai-1766253232402.jpg?v=1",
    "/gallery/salARCHman-1765976559982.jpg?v=1",
    "/gallery/archivision-1765932651101.jpg?v=1",
    "/gallery/archivision-1765933707253.jpg?v=1",
    "/gallery/salARCHman-1765956698737.jpg?v=1",
    "/gallery/salARCHman-1765987075282.jpg?v=1",
    "/gallery/salARCHman-1765985641048.jpg?v=1",
    "/gallery/renderman-ai-1766242067169.jpg?v=1",
    "/gallery/salARCHman-1765944744165.jpg?v=1",
    "/gallery/salARCHman-1765987283493.jpg?v=1",
    "/gallery/renderman-ai-1766242074715.jpg?v=1",
    "/gallery/renderman-ai-1766253727085.jpg?v=1"
];

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-500/20 relative">

            {/* Technical Grid Background */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-60" style={{
                backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }}></div>

            {/* Navbar - Clean White */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
                <div className="max-w-[1920px] mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex-shrink-0 flex items-center justify-center text-white shadow-md">
                            <Box size={18} strokeWidth={3} />
                        </div>
                        <div className="flex flex-col items-start leading-none">
                            <span className="text-lg font-medium tracking-tight text-slate-900">renderman.ai</span>
                            <span className="text-[10px] font-normal text-slate-500 mt-0.5">by salARCHman studio</span>
                        </div>
                    </div>

                    {/* Search Bar */}


                    <div className="flex items-center gap-4">
                        <button onClick={onGetStarted} className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                            Sign In
                        </button>
                        <button
                            onClick={onGetStarted}
                            className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-black transition-colors shadow-lg shadow-slate-900/20"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="relative z-10 pt-32 pb-12 px-4 md:px-8 max-w-7xl mx-auto">

                {/* Header / Intro */}
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-6 mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold text-blue-600 mb-2 uppercase tracking-wide">
                        <Sparkles size={12} className="text-blue-600" /> AI Powered Rendering
                    </div>
                    <h1 className="text-4xl md:text-6xl font-light tracking-tight text-slate-900 leading-tight max-w-4xl">
                        Transform your sketches into <span className="font-bold">photorealistic renders.</span>
                    </h1>
                    <p className="text-slate-500 max-w-xl text-sm md:text-base leading-relaxed mx-auto">
                        Upload your architectural sketches and let our AI generate stunning visualizations in seconds.
                    </p>
                </div>


                {/* Developer Gallery Section */}
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-center">
                        <h2 className="text-2xl font-light text-slate-900 flex items-center gap-2">
                            <Box size={20} /> Showcase Gallery
                        </h2>
                    </div>

                    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                        {DEVELOPER_GALLERY.map((img, index) => (
                            <div
                                key={index}
                                className="break-inside-avoid group relative rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer"
                                onClick={() => setSelectedImage(img)}
                            >
                                <img
                                    src={img}
                                    alt={`Showcase ${index + 1}`}
                                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>

            </main>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X size={32} />
                    </button>
                    <img
                        src={selectedImage}
                        alt="Full size showcase"
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </div>
    );
};
