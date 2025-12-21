import React from 'react';

interface StylePreviewProps {
    imageSrc: string;
    styleName: string;
    className?: string;
}

export const getFilterForStyle = (name: string): string => {
    switch (name) {
        // Materials
        case 'Concrete':
            return 'grayscale(100%) contrast(110%) brightness(95%) sepia(5%)';
        case 'White Card':
            return 'grayscale(100%) brightness(115%) contrast(90%)';
        case 'Blue Foam':
            return 'grayscale(100%) sepia(100%) hue-rotate(190deg) saturate(400%) brightness(95%)';
        case 'Wood Block':
            return 'sepia(60%) saturate(140%) hue-rotate(-15deg) contrast(110%) brightness(105%)';
        case 'Cardboard':
            return 'sepia(50%) saturate(120%) hue-rotate(10deg) brightness(95%) contrast(105%)';
        case 'Translucent':
            return 'opacity(60%) blur(1px) brightness(120%) saturate(20%)';

        // Forms (Simulated with simple filters as geometry change isn't possible with CSS)
        case 'Orthogonal':
            return 'contrast(130%) saturate(0%) brightness(105%)'; // Sharp, clean
        case 'Organic':
            return 'blur(0.5px) contrast(100%) saturate(110%) sepia(10%)'; // Soft, natural
        case 'Curvilinear':
            return 'blur(0.3px) contrast(105%) brightness(105%)'; // Smooth
        case 'Faceted':
            return 'contrast(160%) brightness(110%) saturate(0%)'; // Sharp edges
        case 'Crystalline':
            return 'contrast(130%) brightness(120%) saturate(40%) hue-rotate(180deg)'; // Bright, sharp, cool
        case 'Parametric':
            return 'contrast(140%) hue-rotate(45deg) saturate(150%)'; // Complex
        case 'Deconstructivist':
            return 'contrast(150%) saturate(0%) sepia(30%) invert(10%)'; // Stark, inverted

        // Times of Day
        case 'Morning':
            return 'brightness(115%) sepia(15%) hue-rotate(-15deg) saturate(120%)'; // Warm, bright
        case 'Noon':
            return 'brightness(125%) contrast(115%) saturate(100%)'; // Harsh, bright
        case 'Sunset':
            return 'sepia(60%) hue-rotate(-25deg) saturate(180%) contrast(110%) brightness(90%)'; // Orange/Red glow

        // Spatial Verbs - Additive (Green/Growth hint)
        case 'Extrude':
        case 'Branch':
        case 'Merge':
        case 'Nest':
        case 'Inflate':
        case 'Stack':
        case 'Laminate':
        case 'Grade':
        case 'Embed':
            return 'sepia(20%) hue-rotate(80deg) saturate(150%) contrast(110%)';

        // Spatial Verbs - Subtractive (Red/Cut hint)
        case 'Subtract':
        case 'Punch':
        case 'Split':
        case 'Carve':
        case 'Notch':
        case 'Fracture':
        case 'Excavate':
            return 'sepia(30%) hue-rotate(-50deg) saturate(200%) contrast(120%) brightness(95%)';

        // Spatial Verbs - Displacement (Blue/Motion hint)
        case 'Twist':
        case 'Fold':
        case 'Shear':
        case 'Cantilever':
        case 'Lift':
        case 'Terrace':
        case 'Bend':
        case 'Shift':
        case 'Rotate':
        case 'Offset':
        case 'Taper':
        case 'Wrap':
        case 'Weave':
        case 'Hinge':
        case 'Pivot':
        case 'Slide':
        case 'Compress':
        case 'Expand':
        case 'Pleat':
        case 'Seam':
        case 'Stretch':
        case 'React':
            return 'sepia(20%) hue-rotate(180deg) saturate(150%) contrast(110%) blur(0.2px)';

        // Spatial Verbs - Hybrid (Complex/Multi-colored hint)
        case 'Infiltrate':
        case 'Augment':
        case 'Interlock':
            return 'sepia(40%) hue-rotate(220deg) saturate(180%) contrast(130%) brightness(105%)';

        default:
            return '';
    }
};

export const StylePreview: React.FC<StylePreviewProps> = ({ imageSrc, styleName, className = '' }) => {
    const filter = getFilterForStyle(styleName);

    const style: React.CSSProperties = {
        backgroundImage: `url(${imageSrc})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: filter || undefined
    };

    return (
        <div
            className={`w-full h-full absolute inset-0 z-0 opacity-80 ${className}`}
            style={style}
        />
    );
};
