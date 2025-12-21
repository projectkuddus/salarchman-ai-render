import React, { useMemo } from 'react';
import { getFilterForStyle } from './StylePreview';
import { VerbOverlays } from './VerbOverlays';

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
    const { transformStyle, ghostStyle } = useMemo(() => {
        let scale = 1;
        let rotate = 0;
        let skewX = 0;
        let skewY = 0;
        let translateX = 0;
        let translateY = 0;

        let hasDisplacement = false;
        let hasAdditive = false;

        // Analyze Verbs to determine transformation (Subtle only)
        verbs.forEach(verb => {
            switch (verb) {
                // Additive - Growth / Expansion
                case 'Extrude':
                case 'Inflate':
                case 'Expand':
                case 'Stack':
                case 'Augment':
                case 'Stretch':
                    scale *= 1.05;
                    hasAdditive = true;
                    break;

                // Subtractive - Reduction / Carving
                case 'Subtract':
                case 'Carve':
                case 'Excavate':
                case 'Erode':
                    scale *= 0.95;
                    break;

                // Displacement - Movement / Distortion
                case 'Twist':
                case 'Rotate':
                    rotate += 5;
                    hasDisplacement = true;
                    break;
                case 'Shear':
                    skewX += 5;
                    hasDisplacement = true;
                    break;
                case 'Bend':
                case 'Fold':
                case 'Pleat':
                    skewY += 5;
                    hasDisplacement = true;
                    break;
                case 'Lift':
                    translateY -= 10;
                    hasDisplacement = true;
                    break;
                case 'Shift':
                case 'Slide':
                case 'Offset':
                    translateX += 10;
                    hasDisplacement = true;
                    break;
            }
        });

        const transform = `scale(${scale}) rotate(${rotate}deg) skew(${skewX}deg, ${skewY}deg) translate(${translateX}px, ${translateY}px)`;

        // Ghost style is the "original" state, visible if there is displacement or growth
        const showGhost = hasDisplacement || hasAdditive;
        const ghost = showGhost ? { opacity: 0.3, filter: 'grayscale(100%) blur(1px)' } : { display: 'none' };

        return {
            transformStyle: transform,
            ghostStyle: ghost
        };
    }, [verbs]);

    // Calculate a single clean filter for the active image
    const activeFilter = useMemo(() => {
        // Start with a clean base - NO aggressive contrast/saturation
        let filter = '';

        // Apply Material/Form/Time filters ONLY if they exist
        if (material) filter += ` ${getFilterForStyle(material)}`;
        if (form) filter += ` ${getFilterForStyle(form)}`;
        if (timeOfDay) filter += ` ${getFilterForStyle(timeOfDay)}`;

        return filter.trim();
    }, [material, form, timeOfDay]);

    return (
        <div className="relative w-full h-full overflow-hidden bg-slate-900 flex items-center justify-center">

            {/* 1. Ghost Image (Original State) - Shows "Before" */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={ghostStyle}>
                <img
                    src={imageSrc}
                    alt="Ghost"
                    className="w-full h-full object-contain"
                />
            </div>

            {/* 2. Active Image (Transformed State) - Shows "After" */}
            <div
                className="relative w-full h-full transition-all duration-500 ease-in-out z-10"
                style={{ transform: transformStyle }}
            >
                <img
                    src={imageSrc}
                    alt="Live Preview"
                    className="w-full h-full object-contain drop-shadow-2xl"
                    style={{ filter: activeFilter }}
                />
            </div>

            {/* 3. Schematic Overlays (Arrows, Cuts, etc.) */}
            <VerbOverlays verbs={verbs} />

            {/* Overlay for "Simulation Mode" indication */}
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-white/10 flex items-center gap-2 z-30">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Schematic Preview
            </div>

            {/* Active Effects Indicator */}
            {verbs.length > 0 && (
                <div className="absolute bottom-4 left-4 flex gap-1 flex-wrap max-w-[80%] z-30">
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
