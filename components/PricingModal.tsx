import React, { useState } from 'react';
import { X, Check, Zap, Building2, Crown, Package, Rocket, Code2 } from 'lucide-react';
import { Button } from './Button';
import { UserTier } from '../types';

interface CreditBundle {
    id: string;
    name: string;
    credits: number;
    images: number;
    price: number;
    pricePerImage: string;
    icon: React.ReactNode;
    color: string;
    popular?: boolean;
}

const CREDIT_BUNDLES: CreditBundle[] = [
    {
        id: 'starter',
        name: 'Starter',
        credits: 50,
        images: 10,
        price: 149,
        pricePerImage: '৳14.90',
        icon: <Zap className="w-5 h-5" />,
        color: 'emerald'
    },
    {
        id: 'pro',
        name: 'Pro',
        credits: 100,
        images: 20,
        price: 249,
        pricePerImage: '৳12.45',
        icon: <Crown className="w-5 h-5" />,
        color: 'yellow',
        popular: true
    },
    {
        id: 'submission',
        name: 'Submission',
        credits: 200,
        images: 40,
        price: 449,
        pricePerImage: '৳11.23',
        icon: <Rocket className="w-5 h-5" />,
        color: 'orange'
    },
    {
        id: 'studio',
        name: 'Studio',
        credits: 400,
        images: 80,
        price: 799,
        pricePerImage: '৳9.99',
        icon: <Building2 className="w-5 h-5" />,
        color: 'purple'
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        credits: 1000,
        images: 200,
        price: 1799,
        pricePerImage: '৳9.00',
        icon: <Package className="w-5 h-5" />,
        color: 'blue'
    },
    {
        id: 'developer',
        name: 'Developer',
        credits: 2000,
        images: 400,
        price: 2999,
        pricePerImage: '৳7.50',
        icon: <Code2 className="w-5 h-5" />,
        color: 'cyan'
    }
];

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentTier: UserTier;
    onUpgrade: (tier: UserTier, credits?: number) => void;
}

export function PricingModal({ isOpen, onClose, currentTier, onUpgrade }: PricingModalProps) {
    const [selectedBundle, setSelectedBundle] = useState<string | null>(null);

    if (!isOpen) return null;

    const handlePurchase = (bundle: CreditBundle) => {
        setSelectedBundle(bundle.id);
        onUpgrade(UserTier.PRO, bundle.credits);
    };

    const getColorClasses = (color: string, isSelected: boolean) => {
        const colors: Record<string, { border: string; bg: string; text: string; icon: string }> = {
            emerald: { border: 'border-emerald-500/50', bg: 'bg-emerald-500/10', text: 'text-emerald-400', icon: 'text-emerald-500' },
            yellow: { border: 'border-yellow-500/50', bg: 'bg-yellow-500/10', text: 'text-yellow-400', icon: 'text-yellow-500' },
            orange: { border: 'border-orange-500/50', bg: 'bg-orange-500/10', text: 'text-orange-400', icon: 'text-orange-500' },
            purple: { border: 'border-purple-500/50', bg: 'bg-purple-500/10', text: 'text-purple-400', icon: 'text-purple-500' },
            blue: { border: 'border-blue-500/50', bg: 'bg-blue-500/10', text: 'text-blue-400', icon: 'text-blue-500' },
            cyan: { border: 'border-cyan-500/50', bg: 'bg-cyan-500/10', text: 'text-cyan-400', icon: 'text-cyan-500' }
        };
        return colors[color] || colors.emerald;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-6xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl my-8">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-zinc-900/50">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Buy Credit Bundles</h2>
                        <p className="text-zinc-400 mt-1">Credits never expire • No watermarks • Commercial license</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Free Tier Notice */}
                {currentTier === UserTier.FREE && (
                    <div className="mx-6 mt-6 p-4 bg-zinc-800/50 border border-zinc-700 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                                <Zap className="w-5 h-5 text-zinc-400" />
                            </div>
                            <div>
                                <p className="text-white font-medium">You're on the Free Plan</p>
                                <p className="text-zinc-400 text-sm">50 credits/month with watermarked images. Purchase any bundle to remove watermarks!</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content - Grid of Bundles */}
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {CREDIT_BUNDLES.map((bundle) => {
                        const colors = getColorClasses(bundle.color, selectedBundle === bundle.id);
                        return (
                            <div
                                key={bundle.id}
                                className={`relative p-5 rounded-xl border transition-all cursor-pointer hover:scale-[1.02] ${bundle.popular
                                        ? `${colors.border} ${colors.bg} shadow-lg`
                                        : 'border-zinc-800 bg-zinc-800/30 hover:border-zinc-700'
                                    }`}
                                onClick={() => handlePurchase(bundle)}
                            >
                                {bundle.popular && (
                                    <div className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold px-3 py-0.5 rounded-full">
                                        MOST POPULAR
                                    </div>
                                )}

                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className={colors.icon}>{bundle.icon}</span>
                                        <h3 className="text-lg font-bold text-white">{bundle.name}</h3>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="text-3xl font-bold text-white">
                                        ৳{bundle.price.toLocaleString()}
                                    </div>
                                    <p className="text-zinc-500 text-sm">{bundle.pricePerImage}/image</p>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-zinc-300 text-sm">
                                        <Check className={`w-4 h-4 mr-2 ${colors.icon}`} />
                                        <span className="font-semibold">{bundle.credits} Credits</span>
                                    </div>
                                    <div className="flex items-center text-zinc-300 text-sm">
                                        <Check className={`w-4 h-4 mr-2 ${colors.icon}`} />
                                        {bundle.images} Image Generations
                                    </div>
                                    <div className="flex items-center text-zinc-300 text-sm">
                                        <Check className={`w-4 h-4 mr-2 ${colors.icon}`} />
                                        Never Expires
                                    </div>
                                    <div className="flex items-center text-zinc-300 text-sm">
                                        <Check className={`w-4 h-4 mr-2 ${colors.icon}`} />
                                        No Watermark
                                    </div>
                                </div>

                                <Button
                                    variant={bundle.popular ? "primary" : "outline"}
                                    className={`w-full ${bundle.popular ? 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-black border-none' : ''}`}
                                >
                                    Buy Now
                                </Button>
                            </div>
                        );
                    })}
                </div>

                {/* Footer - Contact for Custom */}
                <div className="p-6 border-t border-zinc-800 bg-zinc-900/30">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-center sm:text-left">
                            <p className="text-white font-medium">Need a custom plan or API access?</p>
                            <p className="text-zinc-400 text-sm">Contact us for enterprise solutions and bulk discounts</p>
                        </div>
                        <a
                            href="mailto:renderman.arch@gmail.com?subject=Custom%20Plan%20Inquiry"
                            className="shrink-0"
                        >
                            <Button variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                                Contact Sales
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
