import React, { useState, useRef, useEffect } from 'react';
import { Sun } from 'lucide-react';
import { LightControl } from './LightControl';

interface LightDirectionToolProps {
    value: number;
    onChange: (value: number) => void;
    enabled: boolean;
    onToggle: () => void;
}

export const LightDirectionTool: React.FC<LightDirectionToolProps> = ({ value, onChange, enabled, onToggle }) => {
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

    // Close popover if disabled
    useEffect(() => {
        if (!enabled) {
            setIsOpen(false);
        }
    }, [enabled]);

    return (
        <div className="relative" ref={containerRef}>
            <div
                className={`flex items-center gap-3 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${enabled ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-50 border-transparent'
                    }`}
                onClick={(e) => {
                    // Allow clicking the container to toggle, unless clicking the sun button
                    if (!(e.target as HTMLElement).closest('button[title^="Light Direction"]')) {
                        onToggle();
                    }
                }}
            >
                {/* Toggle Switch */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggle();
                    }}
                    className={`w-8 h-4 rounded-full relative transition-colors ${enabled ? 'bg-slate-900' : 'bg-slate-300'}`}
                >
                    <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform shadow-sm ${enabled ? 'translate-x-4 left-0.5' : 'left-0.5'}`} />
                </button>

                <span className={`text-xs font-medium transition-colors select-none ${enabled ? 'text-slate-700' : 'text-slate-400'}`}>
                    Change Light Direction
                </span>

                <div className="h-4 w-px bg-slate-200 mx-1" />

                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (enabled) setIsOpen(!isOpen);
                    }}
                    disabled={!enabled}
                    className={`w-6 h-6 rounded flex items-center justify-center transition-all ${enabled
                        ? (isOpen ? 'bg-slate-100 text-amber-500' : 'text-amber-500 hover:bg-slate-50')
                        : 'text-slate-300 cursor-not-allowed'
                        }`}
                    title={enabled ? `Light Direction: ${value}°` : 'Enable to change direction'}
                >
                    <Sun size={14} className={enabled ? "text-amber-500" : "text-current"} />
                </button>
            </div>

            {isOpen && enabled && (
                <div className="absolute top-full right-0 mt-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <LightControl value={value} onChange={onChange} size={240} />
                </div>
            )}
        </div>
    );
};
