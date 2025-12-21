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
    const { transformStyle, clipPath, ghostStyle, isSubtractive, isAdditive, isDisplacement } = useMemo(() => {
        let scale = 1;
        let rotate = 0;
        let skewX = 0;
        let skewY = 0;
        let translateX = 0;
        let translateY = 0;
        let clip = 'none';

        let hasSubtractive = false;
        let hasAdditive = false;
        let hasDisplacement = false;

        // Analyze Verbs to determine transformation
        verbs.forEach(verb => {
            switch (verb) {
                // Additive - Growth / Expansion
                case 'Extrude':
                case 'Inflate':
                case 'Expand':
                case 'Stack':
                case 'Augment':
                case 'Stretch':
                    scale *= 1.1;
                    hasAdditive = true;
                    break;
                case 'Branch':
                case 'Merge':
                case 'Nest':
                case 'Embed':
                case 'Infiltrate':
                    hasAdditive = true;
                    break;

                // Subtractive - Reduction / Carving
                case 'Subtract':
                case 'Carve':
                case 'Excavate':
                case 'Erode':
                    scale *= 0.9; // Slight shrink to imply loss
                    hasSubtractive = true;
                    break;
                case 'Punch':
                case 'Notch':
                    // Center hole punch simulation
                    clip = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 40%, 40% 40%, 40% 60%, 60% 60%, 60% 40%, 0% 40%)';
                    hasSubtractive = true;
                    break;
                case 'Split':
                case 'Fracture':
                    clip = 'polygon(0% 0%, 45% 0%, 45% 100%, 0% 100%, 0% 0%, 55% 0%, 100% 0%, 100% 100%, 55% 100%, 55% 0%)';
                    hasSubtractive = true;
                    break;

                // Displacement - Movement / Distortion
                case 'Twist':
                case 'Rotate':
                    rotate += 15;
                    hasDisplacement = true;
                    break;
                case 'Shear':
                    skewX += 15;
                    hasDisplacement = true;
                    break;
                case 'Bend':
                case 'Fold':
                case 'Pleat':
                    skewY += 10;
                    hasDisplacement = true;
                    break;
                case 'Lift':
                    translateY -= 20;
                    scale *= 0.95; // Perspective shift
                    hasDisplacement = true;
                    break;
                case 'Shift':
                case 'Slide':
                case 'Offset':
                    translateX += 20;
                    hasDisplacement = true;
                    break;
                case 'Compress':
                    // Note: scaleY is not a direct CSS transform property like scale.
                    // It should be part of the scale() function, e.g., scale(1, 0.8)
                    // For simplicity, we'll just adjust overall scale here or use skewY for compression effect.
                    // For now, let's just mark it as displacement.
                    // scaleY: 0.8; // This line is problematic in JS object.
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
            clipPath: clip,
            ghostStyle: ghost,
            isSubtractive: hasSubtractive,
            isAdditive: hasAdditive,
            isDisplacement: hasDisplacement
        };
    }, [verbs]);

    // Calculate a single clean filter for the active image
    const activeFilter = useMemo(() => {
        // Start with a clean base
        let filter = 'contrast(105%) brightness(105%)'; // Slight pop

        // Apply Material/Form/Time filters ONLY if they exist (and just one of each)
        if (material) filter += ` ${getFilterForStyle(material)}`;
        // We skip form/time/verb color filters to avoid "deep frying" the image
        // The diagrammatic transformation is the main feedback now.

        return filter;
    }, [material]);

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
                style={{
                    transform: transformStyle,
                    clipPath: clipPath !== 'none' ? clipPath : undefined
                }}
            >
                <img
                    src={imageSrc}
                    alt="Live Preview"
                    className="w-full h-full object-contain drop-shadow-2xl"
                    style={{ filter: activeFilter }}
                />

                {/* Subtractive Inner Shadow/Void Hint */}
                {isSubtractive && (
                    <div className="absolute inset-0 bg-slate-900/20 pointer-events-none mix-blend-multiply" />
                )}
            </div>

            {/* Overlay for "Simulation Mode" indication */}
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-white/10 flex items-center gap-2 z-20">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Diagrammatic Preview
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
