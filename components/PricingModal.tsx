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
        color: 'blue',
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
        color: 'violet'
    },
    {
        id: 'studio',
        name: 'Studio',
        credits: 400,
        images: 80,
        price: 799,
        pricePerImage: '৳9.99',
        icon: <Building2 className="w-5 h-5" />,
        color: 'slate'
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        credits: 1000,
        images: 200,
        price: 1799,
        pricePerImage: '৳9.00',
        icon: <Package className="w-5 h-5" />,
        color: 'slate'
    },
    {
        id: 'developer',
        name: 'Developer',
        credits: 2000,
        images: 400,
        price: 2999,
        pricePerImage: '৳7.50',
        icon: <Code2 className="w-5 h-5" />,
        color: 'slate'
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl my-8 border border-slate-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Buy Credit Bundles</h2>
                        <p className="text-slate-500 mt-1 text-sm">Credits never expire • No watermarks • Commercial license</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Free Tier Notice */}
                {currentTier === UserTier.FREE && (
                    <div className="mx-6 mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <Zap className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-slate-900 font-medium">You're on the Free Plan</p>
                                <p className="text-slate-500 text-sm">50 credits/month with watermarked images. Purchase any bundle to remove watermarks!</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content - Grid of Bundles */}
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {CREDIT_BUNDLES.map((bundle) => (
                        <div
                            key={bundle.id}
                            className={`relative p-5 rounded-xl border transition-all cursor-pointer hover:shadow-lg hover:-translate-y-0.5 ${bundle.popular
                                    ? 'border-blue-500 bg-blue-50/50 shadow-md'
                                    : 'border-slate-200 bg-white hover:border-slate-300'
                                }`}
                            onClick={() => handlePurchase(bundle)}
                        >
                            {bundle.popular && (
                                <div className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-0.5 rounded-full">
                                    MOST POPULAR
                                </div>
                            )}

                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className={bundle.popular ? 'text-blue-600' : 'text-slate-600'}>{bundle.icon}</span>
                                    <h3 className="text-lg font-bold text-slate-900">{bundle.name}</h3>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="text-3xl font-bold text-slate-900">
                                    ৳{bundle.price.toLocaleString()}
                                </div>
                                <p className="text-slate-400 text-sm">{bundle.pricePerImage}/image</p>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-slate-600 text-sm">
                                    <Check className={`w-4 h-4 mr-2 ${bundle.popular ? 'text-blue-600' : 'text-emerald-500'}`} />
                                    <span className="font-semibold">{bundle.credits} Credits</span>
                                </div>
                                <div className="flex items-center text-slate-600 text-sm">
                                    <Check className={`w-4 h-4 mr-2 ${bundle.popular ? 'text-blue-600' : 'text-emerald-500'}`} />
                                    {bundle.images} Image Generations
                                </div>
                                <div className="flex items-center text-slate-600 text-sm">
                                    <Check className={`w-4 h-4 mr-2 ${bundle.popular ? 'text-blue-600' : 'text-emerald-500'}`} />
                                    Never Expires
                                </div>
                                <div className="flex items-center text-slate-600 text-sm">
                                    <Check className={`w-4 h-4 mr-2 ${bundle.popular ? 'text-blue-600' : 'text-emerald-500'}`} />
                                    No Watermark
                                </div>
                            </div>

                            <button
                                className={`w-full py-2.5 rounded-xl font-medium transition-all ${bundle.popular
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}
                            >
                                Buy Now
                            </button>
                        </div>
                    ))}
                </div>

                {/* Footer - Contact for Custom */}
                <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-center sm:text-left">
                            <p className="text-slate-900 font-medium">Need a custom plan or API access?</p>
                            <p className="text-slate-500 text-sm">Contact us for enterprise solutions and bulk discounts</p>
                        </div>
                        <a
                            href="mailto:renderman.arch@gmail.com?subject=Custom%20Plan%20Inquiry"
                            className="shrink-0"
                        >
                            <button className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-100 transition-colors">
                                Contact Sales
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
