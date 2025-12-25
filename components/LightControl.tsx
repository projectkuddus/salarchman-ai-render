import React, { useState, useRef, useEffect } from 'react';
import { Sun } from 'lucide-react';

interface LightControlProps {
    value: number;
    onChange: (value: number) => void;
    size?: number;
}

export const LightControl: React.FC<LightControlProps> = ({ value, onChange, size = 200 }) => {
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
    const radius = size / 2 - 24; // Padding
    const angleRad = (value - 90) * (Math.PI / 180);
    const sunX = Math.cos(angleRad) * radius + size / 2;
    const sunY = Math.sin(angleRad) * radius + size / 2;

    return (
        <div className="flex flex-col items-center gap-3 bg-slate-950 p-4 rounded-2xl shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between w-full px-2 mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sun Path</span>
                <span className="text-xs font-mono font-bold text-amber-400">{value}°</span>
            </div>

            <div
                ref={containerRef}
                className="relative rounded-full bg-slate-900 border border-slate-800 shadow-inner cursor-pointer select-none group"
                style={{ width: size, height: size }}
                onMouseDown={handleMouseDown}
            >
                {/* Grid Lines / Compass Rose */}
                <div className="absolute inset-0 rounded-full border border-slate-800/50" />
                <div className="absolute inset-4 rounded-full border border-slate-800/50" />
                <div className="absolute inset-8 rounded-full border border-slate-800/50" />

                {/* Crosshairs */}
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-slate-800" />
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-slate-800" />

                {/* Cardinal Labels */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500">N</div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-500">S</div>
                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500">W</div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500">E</div>

                {/* Sun Path Arc (Decorative - showing the path) */}
                <svg className="absolute inset-0 pointer-events-none" width={size} height={size}>
                    <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
                </svg>

                {/* Center Object */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-slate-800 rounded-full border border-slate-600 z-10" />

                {/* Ray Line */}
                <svg className="absolute inset-0 pointer-events-none" width={size} height={size}>
                    <line
                        x1={size / 2}
                        y1={size / 2}
                        x2={sunX}
                        y2={sunY}
                        stroke="#fbbf24"
                        strokeWidth="2"
                    />
                </svg>

                {/* Sun Icon */}
                <div
                    className="absolute w-8 h-8 bg-amber-400 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.5)] flex items-center justify-center text-amber-900 transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 active:scale-95 z-20 border-2 border-white"
                    style={{ left: sunX, top: sunY }}
                >
                    <Sun size={16} fill="currentColor" strokeWidth={2.5} />
                </div>
            </div>

            <div className="text-[10px] text-slate-500 text-center max-w-[180px]">
                Drag the sun to adjust lighting direction
            </div>
        </div>
    );
};
