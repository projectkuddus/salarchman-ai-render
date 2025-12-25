import React, { useState, useRef, useEffect } from 'react';
import { Sun } from 'lucide-react';
import { LightControl } from './LightControl';

interface LightDirectionToolProps {
    value: number;
    onChange: (value: number) => void;
}

export const LightDirectionTool: React.FC<LightDirectionToolProps> = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close popover when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-8 h-8 rounded-lg border transition-all flex items-center justify-center ${isOpen
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-transparent text-slate-400 border-transparent hover:border-slate-200 hover:bg-slate-50'
                    }`}
                title={`Light Direction: ${value}°`}
            >
                <Sun size={16} className={isOpen ? "text-amber-400" : "text-current"} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <LightControl value={value} onChange={onChange} size={240} />
                </div>
            )}
        </div>
    );
};
