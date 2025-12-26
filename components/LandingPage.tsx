import React from 'react';
import { Box, Sparkles, Search, X, ArrowRight } from 'lucide-react';

interface LandingPageProps {
    onGetStarted: () => void;
}

import { TriviaStrip } from './TriviaStrip';

interface GalleryItem {
    id: number;
    image: string;
    style: string;
    type: string;
    category: string;
    user: string;
    prompt: string;
    aspectRatio: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
    const [galleryImages, setGalleryImages] = React.useState<GalleryItem[]>([]);
    const [visibleCount, setVisibleCount] = React.useState(12);
    const [isLoading, setIsLoading] = React.useState(true);
    const [roleIndex, setRoleIndex] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setRoleIndex((prev) => (prev + 1) % 3);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    React.useEffect(() => {
        setIsLoading(true);
        fetch('/gallery/gallery-data.json')
            .then(res => res.json())
            .then((data: GalleryItem[]) => {
                // Shuffle array to show random mix or just reverse to show newest first
                setGalleryImages(data.reverse());
            })
            .catch(err => console.error("Failed to load gallery", err))
            .finally(() => setIsLoading(false));
    }, []);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 12);
    };

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
            <main className="relative z-10 pt-24 pb-12 px-0 max-w-full">

                {/* Trivia Strip - Top of Page */}
                <div className="w-full border-b border-slate-100 bg-white/50 backdrop-blur-sm mb-12">
                    <div className="max-w-7xl mx-auto">
                        <TriviaStrip />
                    </div>
                </div>

                {/* Header / Intro */}
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-8 mb-16 px-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                        <Sparkles size={10} className="text-slate-400" /> AI Powered Rendering
                    </div>
                    <h1 className="text-5xl md:text-7xl font-thin tracking-tighter text-slate-900 leading-tight max-w-5xl">
                        Transform your sketches into <span className="font-normal">photographic renders.</span>
                    </h1>
                    <p className="text-slate-400 max-w-lg text-base md:text-lg font-light leading-relaxed mx-auto">
                        your complete international project submission engine from ideation to final board.
                    </p>
                </div>

                {/* The Renderman Manifesto */}
                <div className="max-w-3xl mx-auto px-6 mb-32">
                    <div className="text-center mb-16">
                        <h3 className="text-3xl md:text-5xl font-thin leading-tight text-slate-900 tracking-tight">
                            We believe
                            <div className="inline-grid h-[1.1em] overflow-hidden mx-3 align-bottom">
                                <div className="transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]" style={{ transform: `translateY(-${roleIndex * 100}%)` }}>
                                    <div className="h-[1.1em] font-normal text-slate-900">Creatives</div>
                                    <div className="h-[1.1em] font-normal text-slate-900">Architects</div>
                                    <div className="h-[1.1em] font-normal text-slate-900">Designers</div>
                                </div>
                            </div>
                            <span className="block md:inline mt-2 md:mt-0 text-slate-500">
                                shouldn’t spend their best years learning tools instead of learning how to think.
                            </span>
                        </h3>
                    </div>

                    <div className="space-y-8 text-lg md:text-xl text-slate-600 font-light leading-relaxed max-w-2xl mx-auto text-center md:text-justify md:text-center-last">
                        <p>
                            The real work is seeing clearly, understanding the problem, and shaping an idea with depth.
                            But most of the time gets burned fighting software just to finish and submit.
                        </p>
                        <p>
                            <span className="font-medium text-slate-900">renderman.ai</span> exists to remove that friction—so the path from idea to execution feels smooth.
                            So you spend more time thinking, and less time suffering to get work done.
                        </p>
                        <div className="pt-8 flex justify-center">
                            <p className="text-xl md:text-2xl font-normal text-slate-900 tracking-tight">
                                Less struggle. More clarity. Great work.
                            </p>
                        </div>
                    </div>
                </div>



                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    {/* Developer Gallery Section */}
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-center">
                            <h2 className="text-2xl font-light text-slate-900 flex items-center gap-2">
                                <Box size={20} /> Renderman Gallery
                            </h2>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {galleryImages.slice(0, visibleCount).map((item, index) => {
                                        // Helper to get thumbnail path
                                        const getThumbnailPath = (path: string) => {
                                            const parts = path.split('.');
                                            const ext = parts.pop();
                                            const base = parts.join('.');
                                            return `${base}_thumb.${ext}`;
                                        };

                                        return (
                                            <div
                                                key={index}
                                                className="group relative rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer aspect-[4/3]"
                                                onClick={() => setSelectedImage(item.image)}
                                            >
                                                <img
                                                    src={getThumbnailPath(item.image)}
                                                    alt={item.prompt || `Architectural render ${index + 1}`}
                                                    title={item.prompt}
                                                    loading={index < 4 ? "eager" : "lazy"}
                                                    decoding="async"
                                                    width="400"
                                                    height="300"
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 bg-slate-100"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        // If thumbnail fails, try original. If original fails, fallback.
                                                        if (target.src.includes('_thumb')) {
                                                            target.src = item.image;
                                                        } else {
                                                            target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                                                        }
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                            </div>
                                        );
                                    })}
                                </div>

                                {visibleCount < galleryImages.length && (
                                    <div className="flex justify-center pt-4">
                                        <button
                                            onClick={handleLoadMore}
                                            className="group flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm hover:shadow"
                                        >
                                            Load More <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
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
