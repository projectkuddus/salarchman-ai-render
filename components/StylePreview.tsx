import React from 'react';

interface StylePreviewProps {
    imageSrc: string;
    styleName: string;
    className?: string;
}

export const StylePreview: React.FC<StylePreviewProps> = ({ imageSrc, styleName, className = '' }) => {
    // Define CSS filters for each style simulation
    const getStyleFilter = (name: string): React.CSSProperties => {
        const baseStyle: React.CSSProperties = {
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        };

        switch (name) {
            // Materials
            case 'Concrete':
                return { ...baseStyle, filter: 'grayscale(100%) contrast(120%) brightness(90%) sepia(10%)' };
            case 'White Card':
                return { ...baseStyle, filter: 'grayscale(100%) brightness(110%) contrast(90%)' };
            case 'Blue Foam':
                return { ...baseStyle, filter: 'grayscale(100%) sepia(100%) hue-rotate(180deg) saturate(300%) brightness(90%)' };
            case 'Wood Block':
                return { ...baseStyle, filter: 'sepia(80%) saturate(150%) hue-rotate(-10deg) contrast(110%)' };
            case 'Cardboard':
                return { ...baseStyle, filter: 'sepia(60%) saturate(120%) hue-rotate(10deg) brightness(95%)' };
            case 'Translucent':
                return { ...baseStyle, filter: 'opacity(70%) blur(0.5px) brightness(110%) saturate(50%)' };

            // Forms (Simulated with simple filters as geometry change isn't possible with CSS)
            case 'Orthogonal':
                return { ...baseStyle, filter: 'contrast(130%) saturate(0%)' }; // Sharp, clean
            case 'Organic':
                return { ...baseStyle, filter: 'blur(1px) contrast(110%) saturate(120%)' }; // Soft, natural
            case 'Curvilinear':
                return { ...baseStyle, filter: 'blur(0.5px) contrast(100%)' }; // Smooth
            case 'Faceted':
                return { ...baseStyle, filter: 'contrast(150%) brightness(110%)' }; // Sharp edges
            case 'Crystalline':
                return { ...baseStyle, filter: 'contrast(120%) brightness(120%) saturate(50%)' }; // Bright, sharp
            case 'Parametric':
                return { ...baseStyle, filter: 'contrast(140%) hue-rotate(10deg)' }; // Complex
            case 'Deconstructivist':
                return { ...baseStyle, filter: 'contrast(150%) saturate(0%) sepia(20%)' }; // Stark

            // Times of Day
            case 'Morning':
                return { ...baseStyle, filter: 'brightness(110%) sepia(20%) hue-rotate(-10deg) saturate(110%)' }; // Warm, bright
            case 'Noon':
                return { ...baseStyle, filter: 'brightness(120%) contrast(110%) saturate(100%)' }; // Harsh, bright
            case 'Sunset':
                return { ...baseStyle, filter: 'sepia(50%) hue-rotate(-20deg) saturate(150%) contrast(110%)' }; // Orange/Red glow

            default:
                return baseStyle;
        }
    };

    return (
        <div
            className={`w-full h-full absolute inset-0 z-0 opacity-80 ${className}`}
            style={getStyleFilter(styleName)}
        />
    );
};
