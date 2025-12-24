import React, { useState, useRef } from 'react';
import { Video, Box, Upload, X, Sliders, Monitor, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { generateAnimation } from '../services/veoService';
import { UserCredits, User } from '../types';
import { supabase } from '../services/supabaseClient';

interface AnimationViewProps {
    currentUser: User | null;
    credits: UserCredits;
    setCredits: React.Dispatch<React.SetStateAction<UserCredits>>;
    onBack?: () => void; // Optional back button if we want it
}

export function AnimationView({ currentUser, credits, setCredits }: AnimationViewProps) {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [animationPrompt, setAnimationPrompt] = useState('Construction timelapse: From site preparation to final building output.');
    const [animationResolution, setAnimationResolution] = useState<'1080p' | '4K'>('1080p');
    const [isAnimating, setIsAnimating] = useState(false);
    const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
    const [apiKeyError, setApiKeyError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result && typeof event.target.result === 'string') {
                    setUploadedImage(event.target.result);
                    setGeneratedVideo(null); // Clear previous video
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClear = () => {
        setUploadedImage(null);
        setGeneratedVideo(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleGenerateAnimation = async () => {
        if (!uploadedImage) return;

        const cost = animationResolution === '4K' ? 50 : 20;
        if (credits.available < cost) {
            setApiKeyError(`Insufficient credits. You need ${cost} but have ${credits.available}.`);
            return;
        }

        setIsAnimating(true);
        setApiKeyError(null);

        try {
            const videoUrl = await generateAnimation(uploadedImage, {
                duration: 10,
                motionStrength: 5,
                prompt: animationPrompt,
                resolution: animationResolution
            });

            // Deduct credits
            const newAvailable = credits.available - cost;
            const newTotalUsed = credits.totalUsed + cost;
            const newCredits = { available: newAvailable, totalUsed: newTotalUsed };
            setCredits(newCredits);

            // Update Supabase
            if (currentUser) {
                supabase
                    .from('profiles')
                    .update({ credits: newAvailable })
                    .eq('id', currentUser.id)
                    .then(({ error }) => {
                        if (error) console.error('Error updating credits in Supabase:', error);
                    });
            }

            setGeneratedVideo(videoUrl);
        } catch (error: any) {
            console.error("Animation generation failed:", error);
            setApiKeyError(`Animation generation failed: ${error.message || "Unknown error"}`);
        } finally {
            setIsAnimating(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 z-10 sticky top-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white"><Video size={16} /></div>
                    <h1 className="text-lg font-bold text-slate-900">renderman.ai <span className="font-light text-slate-500">/ Animation</span></h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-xs font-medium text-slate-600">{credits.available} Credits</span>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar Controls */}
                <aside className="w-80 border-r border-slate-200 bg-white p-6 overflow-y-auto">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Video size={14} className="text-slate-900" />
                            <h4 className="text-sm font-bold text-slate-900">Construction Timelapse <span className="text-[10px] font-normal text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded-full ml-1">TEST</span></h4>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Generate a construction timelapse from site preparation to final output.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Monitor size={10} /> Resolution</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setAnimationResolution('1080p')}
                                    className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${animationResolution === '1080p' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                                >
                                    1080p (20c)
                                </button>
                                <button
                                    onClick={() => setAnimationResolution('4K')}
                                    className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${animationResolution === '4K' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                                >
                                    4K (50c)
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Workspace */}
                <main className="flex-1 p-6 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:40px_40px] flex flex-col">
                    <div className="flex-1 flex gap-6 min-h-0 mb-6">
                        {/* Left Column (Input) */}
                        <div className="w-1/3 flex flex-col gap-4">
                            <div className="flex-1 bg-white rounded-2xl border border-dashed border-slate-300 relative group min-h-[200px]">
                                <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    <Box size={12} /> Base Image
                                </div>
                                {!uploadedImage ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                                        <Upload size={32} className="mb-3 opacity-50" />
                                        <p className="text-sm font-medium text-slate-900">Upload Image</p>
                                        <p className="text-[10px] opacity-60 mt-1">PNG, JPG (MAX 10MB)</p>
                                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </div>
                                ) : (
                                    <div className="relative w-full h-full rounded-2xl overflow-hidden">
                                        <img src={uploadedImage} alt="Base" className="w-full h-full object-cover" />
                                        <button onClick={handleClear} className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition-colors"><X size={16} /></button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column (Output) */}
                        <div className="w-2/3 bg-white rounded-2xl border border-slate-200 shadow-sm relative flex items-center justify-center overflow-hidden">
                            <div className="absolute top-4 left-4 z-10 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                                Timelapse &bull; {animationResolution}
                            </div>
                            {!generatedVideo ? (
                                <div className="text-center text-slate-300">
                                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Video size={32} className="opacity-50" />
                                    </div>
                                    <p className="text-sm font-medium">Ready to Animate</p>
                                </div>
                            ) : (
                                <div className="relative w-full h-full group">
                                    <video src={generatedVideo} controls className="w-full h-full object-contain bg-slate-50" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-mono text-xs">CR</span>
                            <span className="text-sm font-medium text-slate-900">Est. Cost {animationResolution === '4K' ? 50 : 20} Credits</span>
                        </div>
                        <Button
                            onClick={handleGenerateAnimation}
                            disabled={!uploadedImage || isAnimating}
                            className="px-8 py-3 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-slate-900/20"
                        >
                            {isAnimating ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} />}
                            {isAnimating ? 'Generating Timelapse...' : 'Generate Timelapse'}
                        </Button>
                    </div>
                    {apiKeyError && (
                        <div className="mt-4 bg-red-50 text-red-600 text-xs p-3 rounded-lg text-center">
                            {apiKeyError}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
