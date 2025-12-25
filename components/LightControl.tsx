import React, { useState, useRef, useEffect } from 'react';
import { Sun } from 'lucide-react';

interface LightControlProps {
    value: number;
    onChange: (value: number) => void;
    size?: number;
}

export const LightControl: React.FC<LightControlProps> = ({ value, onChange, size = 120 }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleInteraction = (clientX: number, clientY: number) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = clientX - centerX;
        const deltaY = clientY - centerY;

        // Calculate angle in radians
        let angleRad = Math.atan2(deltaY, deltaX);

        // Convert to degrees
        let angleDeg = angleRad * (180 / Math.PI);

        // Adjust so 0 is North (Top)
        let adjustedAngle = angleDeg + 90;
        if (adjustedAngle < 0) adjustedAngle += 360;

        onChange(Math.round(adjustedAngle));
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        handleInteraction(e.clientX, e.clientY);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
            handleInteraction(e.clientX, e.clientY);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    // Calculate Sun Position for rendering
    // 0 = North (Top)
    const radius = size / 2 - 16; // Padding for sun icon
    const angleRad = (value - 90) * (Math.PI / 180);
    const sunX = Math.cos(angleRad) * radius + size / 2;
    const sunY = Math.sin(angleRad) * radius + size / 2;

    return (
        <div className="flex flex-col items-center gap-2">
            <div
                ref={containerRef}
                className="relative rounded-full bg-slate-50 border border-slate-200 shadow-inner cursor-pointer select-none group"
                style={{ width: size, height: size }}
                onMouseDown={handleMouseDown}
            >
                {/* Cardinal Markers */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-slate-300" /> {/* N */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-slate-300" /> {/* S */}
                <div className="absolute left-1 top-1/2 -translate-y-1/2 w-2 h-0.5 bg-slate-300" /> {/* W */}
                <div className="absolute right-1 top-1/2 -translate-y-1/2 w-2 h-0.5 bg-slate-300" /> {/* E */}

                {/* Center Object (Square as per sketch) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-2 border-slate-300 rounded-sm flex items-center justify-center bg-white">
                    <div className="w-1 h-1 bg-slate-400 rounded-full" />
                </div>

                {/* Ray Line */}
                <svg className="absolute inset-0 pointer-events-none" width={size} height={size}>
                    <line
                        x1={size / 2}
                        y1={size / 2}
                        x2={sunX}
                        y2={sunY}
                        stroke="currentColor"
                        className="text-slate-300"
                        strokeWidth="1.5"
                        strokeDasharray="4 2"
                    />
                </svg>

                {/* Sun Icon */}
                <div
                    className="absolute w-6 h-6 bg-amber-400 rounded-full shadow-md flex items-center justify-center text-amber-900 transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 active:scale-95 z-10"
                    style={{ left: sunX, top: sunY }}
                >
                    <Sun size={14} fill="currentColor" />
                </div>
            </div>
            <div className="text-[10px] font-mono text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                {value}°
            </div>
        </div>
    );
};
