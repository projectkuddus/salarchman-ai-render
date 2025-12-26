import React from 'react';

// --- MATERIALS ---

export const ConcreteGraphic = () => (
    <div className="w-full h-full bg-neutral-400 relative overflow-hidden rounded-md border border-neutral-500">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '8px 8px' }}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-black/20"></div>
    </div>
);

export const WhiteCardGraphic = () => (
    <div className="w-full h-full bg-white relative rounded-md border border-neutral-200 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-neutral-100"></div>
    </div>
);

export const BlueFoamGraphic = () => (
    <div className="w-full h-full bg-blue-400 relative rounded-md border border-blue-500">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'4\' height=\'4\' viewBox=\'0 0 4 4\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h4v4H0z\' fill=\'%23fff\' fill-opacity=\'0.4\'/%3E%3C/svg%3E")' }}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
    </div>
);

export const WoodBlockGraphic = () => (
    <div className="w-full h-full bg-amber-200 relative rounded-md border border-amber-300 overflow-hidden">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, #92400e 3px, transparent 4px)' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-amber-100/30 to-amber-900/10"></div>
    </div>
);

export const CardboardGraphic = () => (
    <div className="w-full h-full bg-[#d2b48c] relative rounded-md border border-[#c19a6b] overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #8b4513 3px, transparent 4px)' }}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10"></div>
    </div>
);

export const TranslucentGraphic = () => (
    <div className="w-full h-full bg-white/40 backdrop-blur-sm relative rounded-md border border-white/50 shadow-inner flex items-center justify-center">
        <div className="w-6 h-6 bg-white/30 rounded-full blur-sm"></div>
    </div>
);


// --- FORMS ---

export const OrthogonalGraphic = () => (
    <div className="w-full h-full flex items-center justify-center">
        <div className="grid grid-cols-2 gap-1 w-10 h-10">
            <div className="bg-slate-700 rounded-sm"></div>
            <div className="bg-slate-500 rounded-sm h-6 self-end"></div>
            <div className="bg-slate-400 rounded-sm w-6 justify-self-end"></div>
            <div className="bg-slate-600 rounded-sm"></div>
        </div>
    </div>
);

export const OrganicGraphic = () => (
    <div className="w-full h-full flex items-center justify-center">
        <svg width="40" height="40" viewBox="0 0 40 40" className="text-emerald-600 fill-current opacity-80">
            <path d="M20 5C10 5 5 15 5 20C5 30 15 35 20 35C30 35 35 25 35 20C35 10 25 5 20 5Z" style={{ borderRadius: '50%' }} />
            {/* Simple blob representation */}
            <circle cx="20" cy="20" r="12" />
            <circle cx="26" cy="16" r="8" />
            <circle cx="14" cy="24" r="7" />
        </svg>
    </div>
);

export const CurvilinearGraphic = () => (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
        <div className="w-16 h-16 border-4 border-indigo-500 rounded-full transform scale-x-150 rotate-45"></div>
        <div className="absolute w-16 h-16 border-4 border-indigo-300 rounded-full transform scale-x-150 -rotate-45"></div>
    </div>
);

export const FacetedGraphic = () => (
    <div className="w-full h-full flex items-center justify-center">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-purple-600">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
    </div>
);

export const CrystallineGraphic = () => (
    <div className="w-full h-full flex items-center justify-center">
        <div className="relative w-8 h-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[15px] border-b-sky-500"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[15px] border-t-sky-400"></div>
        </div>
    </div>
);

export const ParametricGraphic = () => (
    <div className="w-full h-full flex items-center justify-center gap-0.5">
        {[1, 2, 3, 4, 3, 2, 1].map((h, i) => (
            <div key={i} className="w-1 bg-rose-500 rounded-full" style={{ height: `${h * 20}%` }}></div>
        ))}
    </div>
);

export const DeconstructivistGraphic = () => (
    <div className="w-full h-full flex items-center justify-center relative">
        <div className="w-6 h-6 bg-orange-500 absolute transform rotate-12 translate-x-1"></div>
        <div className="w-6 h-6 bg-orange-400/80 absolute transform -rotate-12 -translate-x-1"></div>
        <div className="w-8 h-1 bg-orange-600 absolute transform rotate-45"></div>
    </div>
);


// --- SUN & SHADOWS ---

export const MorningGraphic = () => (
    <div className="w-full h-full relative overflow-hidden bg-sky-100 rounded-md">
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-orange-100"></div>
        <div className="absolute bottom-2 left-2 w-6 h-6 bg-orange-400 rounded-full shadow-lg shadow-orange-300"></div>
        <div className="absolute bottom-2 left-10 w-12 h-4 bg-black/10 transform skew-x-12 rounded-full blur-[1px]"></div>
    </div>
);

export const NoonGraphic = () => (
    <div className="w-full h-full relative overflow-hidden bg-sky-200 rounded-md">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-yellow-400 rounded-full shadow-lg shadow-yellow-300"></div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/20 rounded-full blur-[2px]"></div>
    </div>
);

export const SunsetGraphic = () => (
    <div className="w-full h-full relative overflow-hidden bg-indigo-900 rounded-md">
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-purple-800 to-transparent"></div>
        <div className="absolute bottom-2 right-2 w-6 h-6 bg-pink-500 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.8)]"></div>
        <div className="absolute bottom-2 right-10 w-16 h-4 bg-black/30 transform -skew-x-12 rounded-full blur-[1px]"></div>
    </div>
);


// --- OPERATIONS ---

const IconWrapper = ({ src, alt }: { src: string, alt: string }) => (
    <div className="w-full h-full flex items-center justify-center p-1">
        <img src={src} alt={alt} className="w-full h-full object-contain drop-shadow-sm" />
    </div>
);

export const ExtrudeGraphic = () => <IconWrapper src="/icons/ideation/extrude.png" alt="Extrude" />;
export const BranchGraphic = () => <IconWrapper src="/icons/ideation/branch.png" alt="Branch" />;
export const MergeGraphic = () => <IconWrapper src="/icons/ideation/merge.png" alt="Merge" />;
export const NestGraphic = () => <IconWrapper src="/icons/ideation/nest.png" alt="Nest" />;
export const InflateGraphic = () => <IconWrapper src="/icons/ideation/inflate.png" alt="Inflate" />;
export const StackGraphic = () => <IconWrapper src="/icons/ideation/stack.png" alt="Stack" />;
export const LaminateGraphic = () => <IconWrapper src="/icons/ideation/laminate.png" alt="Laminate" />;
export const GradeGraphic = () => <IconWrapper src="/icons/ideation/grade.png" alt="Grade" />;
export const EmbedGraphic = () => <IconWrapper src="/icons/ideation/embed.png" alt="Embed" />;

// Subtractive (Placeholders for now, using existing SVGs or simple shapes if not generated)
export const SubtractGraphic = () => <IconWrapper src="/icons/ideation/subtract.png" alt="Subtract" />;
export const PunchGraphic = () => <IconWrapper src="/icons/ideation/punch.png" alt="Punch" />;
export const SplitGraphic = () => <IconWrapper src="/icons/ideation/split.png" alt="Split" />;
export const CarveGraphic = () => <IconWrapper src="/icons/ideation/carve.png" alt="Carve" />;

export const NotchGraphic = () => (
    <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 bg-slate-600 relative">
            <div className="absolute top-1/2 right-0 w-2 h-2 bg-white transform -translate-y-1/2"></div>
        </div>
    </div>
);

export const FractureGraphic = () => (
    <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 bg-slate-600 relative overflow-hidden">
            <div className="absolute inset-0 border-r-2 border-white transform rotate-12 translate-x-1"></div>
        </div>
    </div>
);

export const ExcavateGraphic = () => (
    <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 bg-slate-600 border-4 border-slate-600 flex items-center justify-center">
            <div className="w-6 h-6 bg-white/90 rounded-sm"></div>
        </div>
    </div>
);

export const TwistGraphic = () => (
    <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="w-6 h-2 bg-slate-400 transform rotate-12"></div>
        <div className="w-6 h-2 bg-slate-500 transform rotate-6"></div>
        <div className="w-6 h-2 bg-slate-600"></div>
    </div>
);

export const FoldGraphic = () => (
    <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-4 border-b-2 border-r-2 border-slate-600 transform -skew-x-12"></div>
    </div>
);

export const ShearGraphic = () => (
    <div className="w-full h-full flex flex-col items-center justify-center gap-0.5">
        <div className="w-6 h-2 bg-slate-400 transform translate-x-2"></div>
        <div className="w-6 h-2 bg-slate-500 transform translate-x-1"></div>
        <div className="w-6 h-2 bg-slate-600"></div>
    </div>
);

export const CantileverGraphic = () => (
    <div className="w-full h-full flex items-end justify-center pb-2">
        <div className="w-4 h-6 bg-slate-600"></div>
        <div className="w-6 h-3 bg-slate-500 mb-3"></div>
    </div>
);

export const LiftGraphic = () => (
    <div className="w-full h-full flex flex-col items-center justify-center gap-1">
        <div className="w-8 h-4 bg-slate-600"></div>
        <div className="flex gap-4 w-6 justify-between">
            <div className="w-0.5 h-3 bg-slate-400"></div>
            <div className="w-0.5 h-3 bg-slate-400"></div>
        </div>
    </div>
);

export const TerraceGraphic = () => (
    <div className="w-full h-full flex items-end justify-center pb-2">
        <div className="w-2 h-2 bg-slate-400"></div>
        <div className="w-2 h-4 bg-slate-500"></div>
        <div className="w-2 h-6 bg-slate-600"></div>
    </div>
);

export const BendGraphic = () => (
    <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-4 border-t-4 border-slate-600 rounded-t-full"></div>
    </div>
);

export const ShiftGraphic = () => (
    <div className="w-full h-full flex flex-col items-center justify-center gap-0.5">
        <div className="w-6 h-3 bg-slate-400 transform -translate-x-1"></div>
        <div className="w-6 h-3 bg-slate-600 transform translate-x-1"></div>
    </div>
);

export const RotateGraphic = () => (
    <div className="w-full h-full flex items-center justify-center relative">
        <div className="w-6 h-6 border-2 border-slate-400 rounded-full border-t-transparent animate-spin-slow"></div>
        <div className="absolute w-3 h-3 bg-slate-600"></div>
    </div>
);

export const OffsetGraphic = () => (
    <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-600 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-slate-400"></div>
        </div>
    </div>
);

export const TaperGraphic = () => (
    <div className="w-full h-full flex items-center justify-center">
        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[16px] border-b-slate-600"></div>
    </div>
);

export const InterlockGraphic = () => (
    <div className="w-full h-full flex items-center justify-center relative">
        <div className="w-5 h-5 border-2 border-slate-600 absolute top-2 left-2 bg-white z-10"></div>
        <div className="w-5 h-5 bg-slate-400 absolute bottom-2 right-2"></div>
    </div>
);

export const DefaultGraphic = () => (
    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
        <div className="w-4 h-4 bg-slate-300 rounded-full"></div>
    </div>
);
