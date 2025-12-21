import React, { useMemo } from 'react';
import { getFilterForStyle } from './StylePreview';

interface LiveIdeationPreviewProps {
    imageSrc: string;
    verbs: string[];
    material: string;
    form: string;
    timeOfDay: string;
}

export const LiveIdeationPreview: React.FC<LiveIdeationPreviewProps> = ({
    imageSrc,
    verbs,
    material,
    form,
    timeOfDay
}) => {
    const { compositeFilter, transformStyle, clipPath } = useMemo(() => {
        const filters: string[] = [];
        let scale = 1;
        let rotate = 0;
        let skewX = 0;
        let skewY = 0;
        let translateX = 0;
        let translateY = 0;
        let clip = 'none';

        // --- 1. Base Style Filters ---
        if (material) {
            const matFilter = getFilterForStyle(material);
            if (matFilter) filters.push(matFilter);
        }
        if (form) {
            const formFilter = getFilterForStyle(form);
            if (formFilter) filters.push(formFilter);
        }
        if (timeOfDay) {
            const timeFilter = getFilterForStyle(timeOfDay);
            if (timeFilter) filters.push(timeFilter);
        }

        // --- 2. Advanced Verb Mapping ---
        verbs.forEach(verb => {
            // Add color hint (subtle)
            const verbColorFilter = getFilterForStyle(verb);
            if (verbColorFilter) filters.push(verbColorFilter);

            switch (verb) {
                // Additive - Growth / Expansion
                case 'Extrude':
                    scale *= 1.05; // Slight vertical growth simulation via scale
                    translateY -= 2;
                    break;
                case 'Inflate':
                case 'Expand':
                    filters.push('url(#dilate)'); // SVG Dilate
                    scale *= 1.02;
                    break;
                case 'Branch':
                case 'Merge':
                    filters.push('url(#displacement)'); // Organic distortion
                    break;
                case 'Stack':
                    translateY -= 5;
                    break;
                case 'Nest':
                case 'Embed':
                    scale *= 0.95; // Shrink slightly to look "inside"
                    break;

                // Subtractive - Reduction / Carving
                case 'Subtract':
                case 'Carve':
                case 'Excavate':
                    filters.push('url(#erode)'); // SVG Erode
                    break;
                case 'Punch':
                    // Simple clip path to simulate a hole (center)
                    // Note: Multiple clips replace each other in CSS, so last one wins.
                    // Complex boolean ops require SVG masks, but this is a simulation.
                    clip = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 40%, 40% 40%, 40% 60%, 60% 60%, 60% 40%, 0% 40%)';
                    break;
                case 'Split':
                    clip = 'polygon(0% 0%, 45% 0%, 45% 100%, 0% 100%, 0% 0%, 55% 0%, 100% 0%, 100% 100%, 55% 100%, 55% 0%)';
                    break;
                case 'Fracture':
                    filters.push('url(#fracture)');
                    break;
                case 'Notch':
                    clip = 'polygon(0% 0%, 100% 0%, 100% 80%, 80% 80%, 80% 100%, 0% 100%)';
                    break;

                // Displacement - Movement / Distortion
                case 'Twist':
                    rotate += 5;
                    filters.push('url(#displacement)');
                    break;
                case 'Shear':
                    skewX += 10;
                    break;
                case 'Bend':
                    filters.push('url(#displacement)');
                    skewY += 5;
                    break;
                case 'Rotate':
                    rotate += 15;
                    break;
                case 'Lift':
                    translateY -= 10;
                    filters.push('drop-shadow(0px 10px 5px rgba(0,0,0,0.3))');
                    break;
                case 'Compress':
                    scale *= 0.9;
                    skewX += 5;
                    break;
                case 'Stretch':
                    scale *= 1.1;
                    skewX -= 5;
                    break;
                case 'Pleat':
                case 'Fold':
                    filters.push('url(#displacement)');
                    break;

                // Hybrid
                case 'Infiltrate':
                    filters.push('url(#noise)');
                    filters.push('sepia(50%)');
                    break;
                case 'React':
                    filters.push('url(#displacement)');
                    scale *= 1.05;
                    break;
            }
        });

        const transform = `scale(${scale}) rotate(${rotate}deg) skew(${skewX}deg, ${skewY}deg) translate(${translateX}px, ${translateY}px)`;

        return {
            compositeFilter: filters.join(' '),
            transformStyle: transform,
            clipPath: clip
        };
    }, [verbs, material, form, timeOfDay]);

    return (
        <div className="relative w-full h-full overflow-hidden bg-slate-900 flex items-center justify-center">
            {/* Base Image Container with Effects */}
            <div
                className="relative w-full h-full transition-all duration-500 ease-in-out"
                style={{
                    transform: transformStyle,
                    clipPath: clipPath !== 'none' ? clipPath : undefined
                }}
            >
                <img
                    src={imageSrc}
                    alt="Live Preview"
                    className="w-full h-full object-contain"
                    style={{ filter: compositeFilter }}
                />
            </div>

            {/* Overlay for "Simulation Mode" indication */}
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-white/10 flex items-center gap-2 z-20">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Live Simulation
            </div>

            {/* Active Effects Indicator */}
            {verbs.length > 0 && (
                <div className="absolute bottom-4 left-4 flex gap-1 flex-wrap max-w-[80%] z-20">
                    {verbs.map(v => (
                        <span key={v} className="bg-black/50 text-white text-[9px] px-2 py-1 rounded backdrop-blur-sm border border-white/5">
                            {v}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};
