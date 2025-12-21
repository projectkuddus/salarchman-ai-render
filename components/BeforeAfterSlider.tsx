import React, { useState, useRef, useEffect } from 'react';
import { MoveHorizontal } from 'lucide-react';

interface BeforeAfterSliderProps {
    beforeImage: string;
    afterImage: string;
    className?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ beforeImage, afterImage, className = '' }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = (clientX: number) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
            const percentage = (x / rect.width) * 100;
            setSliderPosition(percentage);
        }
    };

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) handleMove(e.clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        handleMove(e.touches[0].clientX);
    };

    useEffect(() => {
        const handleGlobalMouseUp = () => setIsDragging(false);
        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (isDragging) handleMove(e.clientX);
        };

        window.addEventListener('mouseup', handleGlobalMouseUp);
        window.addEventListener('mousemove', handleGlobalMouseMove);

        return () => {
            window.removeEventListener('mouseup', handleGlobalMouseUp);
            window.removeEventListener('mousemove', handleGlobalMouseMove);
        };
    }, [isDragging]);

    return (
        <div
            ref={containerRef}
            className={`relative w-full h-full overflow-hidden cursor-ew-resize select-none group ${className}`}
            onMouseDown={handleMouseDown}
            onTouchMove={handleTouchMove}
        >
            {/* After Image (Background) */}
            <img
                src={afterImage}
                alt="After"
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
            />

            {/* Before Image (Clipped) */}
            <div
                className="absolute inset-0 w-full h-full overflow-hidden"
                style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            >
                <img
                    src={beforeImage}
                    alt="Before"
                    className="absolute inset-0 w-full h-full object-cover"
                    draggable={false}
                    style={{ filter: 'grayscale(100%) contrast(120%) brightness(110%) sepia(20%)' }} // Simulate sketch look
                />

                {/* Label */}
                <div className="absolute top-4 left-4 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-md">
                    SKETCH
                </div>
            </div>

            {/* After Label */}
            <div className="absolute top-4 right-4 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-md">
                RENDER
            </div>

            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg text-slate-900">
                    <MoveHorizontal size={16} />
                </div>
            </div>
        </div>
    );
};
