
import React, { useState } from 'react';
import { Box, Sparkles, ArrowRight, Search, X, Maximize2, Zap, User as UserIcon, Grid, LayoutTemplate, Aperture } from 'lucide-react';
import { Button } from './Button';

interface LandingPageProps {
  onGetStarted: () => void;
}

interface GalleryItem {
  id: number;
  image: string;
  style: string;
  type: string;
  user: string;
  prompt: string;
  aspectRatio: string;
}

// Expanded Mock Data to simulate a busy community feed
const GALLERY_SAMPLES: GalleryItem[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    style: "Photorealistic",
    type: "Exterior",
    user: "studio_arch",
    prompt: "Modern minimalist glass house in a dense forest, rainy atmosphere, 8k resolution, architectural photography",
    aspectRatio: "16:9"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=800&q=80",
    style: "Parametric",
    type: "Interior",
    user: "zaha_fan",
    prompt: "Parametric wooden ceiling interior, fluid organic forms, warm lighting, futuristic library design",
    aspectRatio: "3:4"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    style: "Cyberpunk",
    type: "Concept",
    user: "neo_builder",
    prompt: "Futuristic megastructure in Tokyo, neon lights, night time, rain reflections, cyberpunk aesthetic",
    aspectRatio: "16:9"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800&q=80",
    style: "Watercolor",
    type: "Artistic",
    user: "art_vandelay",
    prompt: "Architectural sketch of a cozy cottage, watercolor style, soft edges, artistic wash",
    aspectRatio: "1:1"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
    style: "Scandinavian",
    type: "Interior",
    user: "nordic_living",
    prompt: "Bright Scandinavian living room, white walls, light oak floor, minimal furniture, natural sunlight",
    aspectRatio: "4:3"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80",
    style: "Aerial",
    type: "Urban",
    user: "city_planner",
    prompt: "Top down aerial view of a sustainable city block, green roofs, pedestrian paths, photorealistic drone shot",
    aspectRatio: "16:9"
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800&q=80",
    style: "Industrial",
    type: "Interior",
    user: "loft_living",
    prompt: "Converted warehouse loft, exposed brick walls, steel beams, large windows, industrial chic decor",
    aspectRatio: "3:4"
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=800&q=80",
    style: "Blueprint",
    type: "Technical",
    user: "tech_draw",
    prompt: "Technical architectural blueprint, white lines on blue paper, construction details, floor plan",
    aspectRatio: "1:1"
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
    style: "Modern",
    type: "Exterior",
    user: "archi_daily",
    prompt: "Concrete brutalist villa, sunset lighting, dramatic shadows, architectural portfolio style",
    aspectRatio: "3:4"
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    style: "Virtual Reality",
    type: "Interior",
    user: "meta_arch",
    prompt: "Apartment interior with virtual reality overlay, purple and blue ambient lighting, futuristic furniture",
    aspectRatio: "16:9"
  },
  {
    id: 11,
    image: "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=800&q=80",
    style: "Concept Sketch",
    type: "Artistic",
    user: "sketch_master",
    prompt: "Loose charcoal sketch of a skyscraper, expressive lines, concept art style",
    aspectRatio: "4:5"
  },
  {
    id: 12,
    image: "https://images.unsplash.com/photo-1558442996-528422f9002a?w=800&q=80",
    style: "Mid-Century",
    type: "Interior",
    user: "retro_vibe",
    prompt: "Mid-century modern kitchen, teal cabinets, terrazzo floor, warm lighting, 1950s aesthetic",
    aspectRatio: "16:9"
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

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
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-md">
                    <Box size={18} strokeWidth={3} />
                </div>
                <span className="text-lg font-medium tracking-tight text-slate-900">sal<span className="font-bold">ARCH</span>man</span>
            </div>
            
            {/* Search Bar */}
            <div className="hidden md:flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-full px-4 py-2 w-96 text-sm text-slate-500 focus-within:border-slate-400 focus-within:text-slate-900 focus-within:bg-white transition-all shadow-inner">
                <Search size={16} />
                <input 
                    type="text" 
                    placeholder="Search renders, styles, or prompts..." 
                    className="bg-transparent border-none outline-none w-full placeholder:text-slate-400"
                />
            </div>

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
      <main className="relative z-10 pt-24 pb-12 px-4 md:px-8 max-w-[1920px] mx-auto">
        
        {/* Header / Intro */}
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold text-blue-600 mb-2 uppercase tracking-wide">
                <Sparkles size={12} className="text-blue-600" /> Community Showcase
            </div>
            <h1 className="text-4xl md:text-6xl font-light tracking-tight text-slate-900 leading-tight max-w-4xl">
                From rough sketch to <span className="font-bold">high quality render.</span>
            </h1>
            <p className="text-slate-500 max-w-xl text-sm md:text-base leading-relaxed">
                Discover what's being created with salARCHman. From conceptual massing to photorealistic interiors.
            </p>
            
            {/* Quick Filters */}
            <div className="flex flex-wrap justify-center gap-2 pt-4">
                {['All', 'Top Day', 'Trending', 'New'].map((filter, i) => (
                    <button 
                        key={filter} 
                        className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all shadow-sm ${i === 0 ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300'}`}
                    >
                        {filter}
                    </button>
                ))}
            </div>
        </div>

        {/* Masonry Grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
            {GALLERY_SAMPLES.map((item) => (
                <div 
                    key={item.id} 
                    onClick={() => setSelectedImage(item)}
                    className="break-inside-avoid relative group cursor-zoom-in rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                    <img 
                        src={item.image} 
                        alt={item.style} 
                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <p className="text-white text-xs font-bold line-clamp-1">{item.prompt}</p>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-[10px] text-slate-800 bg-white/90 px-2 py-0.5 rounded-md backdrop-blur-sm font-medium shadow-sm">
                                    {item.style}
                                </span>
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-200">
                                    <UserIcon size={10} /> {item.user}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Load More Trigger */}
        <div className="flex justify-center py-16">
            <button onClick={onGetStarted} className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm font-medium bg-white px-6 py-3 rounded-full border border-slate-200 shadow-sm hover:shadow-md">
                <span>Sign in to view more</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </div>

      </main>

      {/* Image Details Modal (Lightbox) - Light Mode */}
      {selectedImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={() => setSelectedImage(null)}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-6xl h-full max-h-[90vh] bg-white rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl ring-1 ring-black/5">
                <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white text-slate-900 rounded-full transition-colors backdrop-blur-md shadow-sm"
                >
                    <X size={20} />
                </button>

                {/* Image Side */}
                <div className="flex-1 bg-slate-100 flex items-center justify-center p-4 relative group" style={{
                    backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}>
                    <img 
                        src={selectedImage.image} 
                        alt={selectedImage.prompt} 
                        className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
                    />
                </div>

                {/* Details Side */}
                <div className="w-full md:w-[400px] bg-white border-l border-slate-100 p-8 flex flex-col overflow-y-auto">
                    <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
                        <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            {selectedImage.user[0].toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">{selectedImage.user}</h3>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                <Zap size={10} className="text-yellow-500 fill-yellow-500" /> Pro Architect
                            </p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3 block flex items-center gap-2">
                                <LayoutTemplate size={12} /> Prompt
                            </label>
                            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 font-medium">
                                {selectedImage.prompt}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5 block">Style</label>
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-900 bg-white border border-slate-100 py-1.5 px-3 rounded-lg shadow-sm">
                                    <Aperture size={14} className="text-blue-500" />
                                    {selectedImage.style}
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5 block">Ratio</label>
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-900 bg-white border border-slate-100 py-1.5 px-3 rounded-lg shadow-sm">
                                    <Grid size={14} className="text-slate-500" />
                                    {selectedImage.aspectRatio}
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5 block">Model</label>
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-900 bg-white border border-slate-100 py-1.5 px-3 rounded-lg shadow-sm">
                                    <Zap size={14} className="text-purple-500" />
                                    v2.5 Pro
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5 block">Type</label>
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-900 bg-white border border-slate-100 py-1.5 px-3 rounded-lg shadow-sm">
                                    <LayoutTemplate size={14} className="text-green-500" />
                                    {selectedImage.type}
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 mt-auto">
                            <Button onClick={onGetStarted} className="w-full bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-900/10 py-3">
                                <Sparkles size={16} /> Remix this Style
                            </Button>
                            <p className="text-center text-[10px] text-slate-400 mt-4">
                                Sign up to use this as a reference image
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
