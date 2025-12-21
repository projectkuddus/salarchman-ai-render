import React from 'react';
import { Check } from 'lucide-react';

interface IdeationButtonProps {
    label: string;
    active: boolean;
    onClick: () => void;
    graphic: React.ReactNode;
}

export const IdeationButton: React.FC<IdeationButtonProps> = ({ label, active, onClick, graphic }) => {
    return (
        <button
            onClick={onClick}
            className={`group relative flex flex-col items-center justify-between p-2 rounded-xl border transition-all duration-200 h-24 w-full
        ${active
                    ? 'bg-white border-slate-900 ring-1 ring-slate-900 shadow-md'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
        >
            <div className="w-full flex-1 flex items-center justify-center p-1">
                <div className="w-full h-full rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-105">
                    {graphic}
                </div>
            </div>

            <span className={`text-[10px] font-medium mt-2 transition-colors ${active ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>
                {label}
            </span>

            {active && (
                <div className="absolute top-2 right-2 bg-slate-900 text-white rounded-full p-0.5 shadow-sm z-10">
                    <Check size={10} />
                </div>
            )}
        </button>
    );
};
