import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Scissors, Layers, Maximize, Minimize, RefreshCw, Zap } from 'lucide-react';

interface VerbOverlaysProps {
    verbs: string[];
}

export const VerbOverlays: React.FC<VerbOverlaysProps> = ({ verbs }) => {
    return (
        <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center overflow-hidden">
            {verbs.map(verb => {
                switch (verb) {
                    // --- ADDITIVE (Growth/Arrows) ---
                    case 'Extrude':
                    case 'Lift':
                    case 'Stack':
                        return (
                            <div key={verb} className="absolute inset-0 flex items-center justify-center animate-pulse">
                                <div className="flex flex-col items-center gap-2 -mt-20">
                                    <ArrowUp size={48} className="text-green-500 drop-shadow-lg" strokeWidth={3} />
                                    <div className="border-2 border-green-500 border-dashed w-32 h-32 rounded-lg opacity-50" />
                                </div>
                            </div>
                        );
                    case 'Inflate':
                    case 'Expand':
                    case 'Augment':
                        return (
                            <div key={verb} className="absolute inset-0 flex items-center justify-center">
                                <Maximize size={64} className="text-green-500 opacity-80 animate-ping" />
                                <div className="absolute border-2 border-green-500 rounded-full w-48 h-48 opacity-30 animate-pulse" />
                            </div>
                        );
                    case 'Branch':
                    case 'Merge':
                    case 'Nest':
                        return (
                            <div key={verb} className="absolute inset-0 flex items-center justify-center">
                                <Layers size={48} className="text-green-500 drop-shadow-lg" />
                                <ArrowRight size={24} className="text-green-500 absolute right-1/3" />
                                <ArrowLeft size={24} className="text-green-500 absolute left-1/3" />
                            </div>
                        );

                    // --- SUBTRACTIVE (Cuts/Red) ---
                    case 'Subtract':
                    case 'Carve':
                    case 'Excavate':
                    case 'Erode':
                        return (
                            <div key={verb} className="absolute inset-0 flex items-center justify-center">
                                <div className="w-32 h-32 border-2 border-red-500 border-dashed bg-red-500/10 rounded-lg flex items-center justify-center">
                                    <Minimize size={32} className="text-red-500" />
                                </div>
                            </div>
                        );
                    case 'Punch':
                    case 'Notch':
                        return (
                            <div key={verb} className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 border-4 border-red-500 bg-black/20 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                                </div>
                            </div>
                        );
                    case 'Split':
                    case 'Fracture':
                        return (
                            <div key={verb} className="absolute inset-0 flex items-center justify-center">
                                <div className="h-full w-1 bg-red-500/50 border-r-2 border-dashed border-red-500 rotate-12" />
                                <Scissors size={32} className="text-red-500 absolute top-1/3" />
                            </div>
                        );

                    // --- DISPLACEMENT (Blue/Motion) ---
                    case 'Twist':
                    case 'Rotate':
                        return (
                            <div key={verb} className="absolute inset-0 flex items-center justify-center">
                                <RefreshCw size={64} className="text-blue-500 opacity-80 animate-spin-slow" />
                            </div>
                        );
                    case 'Shear':
                    case 'Bend':
                    case 'Fold':
                        return (
                            <div key={verb} className="absolute inset-0 flex items-center justify-center">
                                <div className="w-48 h-48 border-2 border-blue-500 skew-x-12 opacity-50 rounded-lg" />
                                <ArrowRight size={32} className="text-blue-500 absolute top-1/3 right-1/3" />
                            </div>
                        );
                    case 'Shift':
                    case 'Slide':
                    case 'Offset':
                        return (
                            <div key={verb} className="absolute inset-0 flex items-center justify-center">
                                <ArrowRight size={48} className="text-blue-500 animate-bounce-horizontal" />
                            </div>
                        );

                    // --- HYBRID ---
                    case 'Infiltrate':
                    case 'React':
                        return (
                            <div key={verb} className="absolute inset-0 flex items-center justify-center">
                                <Zap size={48} className="text-yellow-500 animate-pulse" />
                            </div>
                        );

                    default:
                        return null;
                }
            })}
        </div>
    );
};
