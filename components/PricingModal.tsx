import React from 'react';
import { X, Check, Zap, Building2, Crown } from 'lucide-react';
import { Button } from './Button';
import { UserTier } from '../types';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentTier: UserTier;
    onUpgrade: (tier: UserTier) => void;
}

export function PricingModal({ isOpen, onClose, currentTier, onUpgrade }: PricingModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-5xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Choose Your Plan</h2>
                        <p className="text-zinc-400 mt-1">Unlock professional features and remove watermarks</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Free Tier */}
                    <div className={`relative p-6 rounded-xl border ${currentTier === UserTier.FREE ? 'border-zinc-600 bg-zinc-800/30' : 'border-zinc-800 bg-zinc-900/30'} flex flex-col`}>
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-white">Free</h3>
                            <div className="mt-2 text-3xl font-bold text-white">
                                $0 <span className="text-sm font-normal text-zinc-400">/ month</span>
                            </div>
                            <p className="text-zinc-400 mt-2 text-sm">Perfect for trying out the platform</p>
                        </div>

                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex items-center text-zinc-300 text-sm">
                                <Check className="w-4 h-4 mr-2 text-green-500" />
                                50 Credits / month
                            </li>
                            <li className="flex items-center text-zinc-300 text-sm">
                                <Check className="w-4 h-4 mr-2 text-green-500" />
                                Access to basic styles
                            </li>
                            <li className="flex items-center text-zinc-300 text-sm">
                                <Check className="w-4 h-4 mr-2 text-green-500" />
                                Standard generation speed
                            </li>
                            <li className="flex items-center text-zinc-400 text-sm">
                                <span className="w-4 h-4 mr-2 flex items-center justify-center text-xs border border-zinc-600 rounded-full">i</span>
                                Watermarked images
                            </li>
                        </ul>

                        <Button
                            variant={currentTier === UserTier.FREE ? "secondary" : "outline"}
                            className="w-full"
                            disabled={currentTier === UserTier.FREE}
                        >
                            {currentTier === UserTier.FREE ? 'Current Plan' : 'Downgrade'}
                        </Button>
                    </div>

                    {/* Pro Tier */}
                    <div className={`relative p-6 rounded-xl border ${currentTier === UserTier.PRO ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-zinc-700 bg-zinc-800/50'} flex flex-col transform scale-105 shadow-xl z-10`}>
                        {currentTier !== UserTier.PRO && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                                MOST POPULAR
                            </div>
                        )}
                        <div className="mb-4">
                            <div className="flex items-center gap-2">
                                <Crown className="w-5 h-5 text-yellow-500" />
                                <h3 className="text-xl font-bold text-white">Pro</h3>
                            </div>
                            <div className="mt-2 text-3xl font-bold text-white">
                                $10 <span className="text-sm font-normal text-zinc-400">/ bundle</span>
                            </div>
                            <p className="text-zinc-400 mt-2 text-sm">For professional architects & designers</p>
                        </div>

                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex items-center text-white text-sm">
                                <Check className="w-4 h-4 mr-2 text-yellow-500" />
                                <span className="font-semibold">100 Credits</span> per bundle
                            </li>
                            <li className="flex items-center text-white text-sm">
                                <Check className="w-4 h-4 mr-2 text-yellow-500" />
                                <span className="font-semibold">No Watermarks</span>
                            </li>
                            <li className="flex items-center text-white text-sm">
                                <Check className="w-4 h-4 mr-2 text-yellow-500" />
                                Commercial License
                            </li>
                            <li className="flex items-center text-white text-sm">
                                <Check className="w-4 h-4 mr-2 text-yellow-500" />
                                Priority Generation
                            </li>
                            <li className="flex items-center text-white text-sm">
                                <Check className="w-4 h-4 mr-2 text-yellow-500" />
                                High Resolution Downloads
                            </li>
                        </ul>

                        <Button
                            variant="primary"
                            className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-black border-none"
                            onClick={() => onUpgrade(UserTier.PRO)}
                        >
                            {currentTier === UserTier.PRO ? 'Buy More Credits' : 'Upgrade to Pro'}
                        </Button>
                    </div>

                    {/* Studio Tier */}
                    <div className={`relative p-6 rounded-xl border ${currentTier === UserTier.STUDIO ? 'border-zinc-600 bg-zinc-800/30' : 'border-zinc-800 bg-zinc-900/30'} flex flex-col`}>
                        <div className="mb-4">
                            <div className="flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-blue-400" />
                                <h3 className="text-xl font-bold text-white">Studio</h3>
                            </div>
                            <div className="mt-2 text-3xl font-bold text-white">
                                Custom
                            </div>
                            <p className="text-zinc-400 mt-2 text-sm">For large teams and developers</p>
                        </div>

                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex items-center text-zinc-300 text-sm">
                                <Check className="w-4 h-4 mr-2 text-blue-400" />
                                Unlimited / Custom Credits
                            </li>
                            <li className="flex items-center text-zinc-300 text-sm">
                                <Check className="w-4 h-4 mr-2 text-blue-400" />
                                API Access
                            </li>
                            <li className="flex items-center text-zinc-300 text-sm">
                                <Check className="w-4 h-4 mr-2 text-blue-400" />
                                Dedicated Support
                            </li>
                            <li className="flex items-center text-zinc-300 text-sm">
                                <Check className="w-4 h-4 mr-2 text-blue-400" />
                                Custom Model Fine-tuning
                            </li>
                        </ul>

                        <a
                            href="mailto:renderman.arch@gmail.com?subject=Studio%20Plan%20Inquiry"
                            className="w-full"
                        >
                            <Button
                                variant="outline"
                                className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                            >
                                Contact Sales
                            </Button>
                        </a>
                    </div>

                </div>
            </div>
        </div>
    );
}
