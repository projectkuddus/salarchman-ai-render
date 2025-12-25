import React, { useState } from 'react';
import { X, Check, Zap, Building2, Crown, Package, Rocket, Code2, Copy, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { UserTier } from '../types';

interface CreditBundle {
    id: string;
    name: string;
    credits: number;
    images: number;
    price: number;
    pricePerImage: string;
    icon: React.ReactNode;
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
        icon: <Zap className="w-5 h-5" />
    },
    {
        id: 'pro',
        name: 'Pro',
        credits: 100,
        images: 20,
        price: 249,
        pricePerImage: '৳12.45',
        icon: <Crown className="w-5 h-5" />,
        popular: true
    },
    {
        id: 'submission',
        name: 'Submission',
        credits: 200,
        images: 40,
        price: 449,
        pricePerImage: '৳11.23',
        icon: <Rocket className="w-5 h-5" />
    },
    {
        id: 'studio',
        name: 'Studio',
        credits: 400,
        images: 80,
        price: 799,
        pricePerImage: '৳9.99',
        icon: <Building2 className="w-5 h-5" />
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        credits: 1000,
        images: 200,
        price: 1799,
        pricePerImage: '৳9.00',
        icon: <Package className="w-5 h-5" />
    },
    {
        id: 'developer',
        name: 'Developer',
        credits: 2000,
        images: 400,
        price: 2999,
        pricePerImage: '৳7.50',
        icon: <Code2 className="w-5 h-5" />
    }
];

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentTier: UserTier;
    onUpgrade: (tier: UserTier, credits?: number) => void;
    userEmail?: string;
}

export function PricingModal({ isOpen, onClose, currentTier, onUpgrade, userEmail }: PricingModalProps) {
    const [selectedBundle, setSelectedBundle] = useState<CreditBundle | null>(null);
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const BKASH_NUMBER = '01409989900';
    const SUPPORT_EMAIL = 'renderman.arch@gmail.com';

    const handleSelectBundle = (bundle: CreditBundle) => {
        setSelectedBundle(bundle);
    };

    const handleCopyNumber = () => {
        navigator.clipboard.writeText(BKASH_NUMBER);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleBack = () => {
        setSelectedBundle(null);
    };

    const generateEmailBody = () => {
        if (!selectedBundle) return '';
        return encodeURIComponent(
            `Hi Renderman Team,\n\nI have purchased the ${selectedBundle.name} bundle (${selectedBundle.credits} credits) for ৳${selectedBundle.price}.\n\nTransaction Details:\n- bKash Transaction ID: [PASTE YOUR TRANSACTION ID HERE]\n- My Account Email: ${userEmail || '[YOUR EMAIL]'}\n- Bundle: ${selectedBundle.name} (${selectedBundle.credits} credits)\n- Amount Paid: ৳${selectedBundle.price}\n\nPlease add the credits to my account.\n\nThank you!`
        );
    };

    // Payment Instructions View
    if (selectedBundle) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
                <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl my-8 border border-slate-200">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleBack}
                                className="p-2 text-slate-400 hover:text-black hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h2 className="text-xl font-bold text-black">Complete Payment</h2>
                                <p className="text-slate-500 text-sm">{selectedBundle.name} • {selectedBundle.credits} Credits</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-black hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Amount */}
                        <div className="text-center py-4 bg-slate-50 rounded-xl border border-slate-200">
                            <p className="text-slate-500 text-sm mb-1">Amount to Pay</p>
                            <p className="text-4xl font-bold text-black">৳{selectedBundle.price.toLocaleString()}</p>
                        </div>

                        {/* Step 1: Send Payment */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">1</div>
                                <h3 className="font-semibold text-black">Send Payment via bKash</h3>
                            </div>
                            <div className="ml-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <p className="text-slate-600 text-sm mb-3">Send <strong>৳{selectedBundle.price}</strong> to this bKash Merchant number:</p>
                                <div className="flex items-center justify-between bg-white rounded-lg border border-slate-200 p-3">
                                    <span className="text-lg font-mono font-bold text-black">{BKASH_NUMBER}</span>
                                    <button
                                        onClick={handleCopyNumber}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                                <p className="text-xs text-slate-400 mt-2">Use bKash "Send Money" or "Payment" option</p>
                            </div>
                        </div>

                        {/* Step 2: Email Transaction */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">2</div>
                                <h3 className="font-semibold text-black">Email Your Transaction ID</h3>
                            </div>
                            <div className="ml-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <p className="text-slate-600 text-sm mb-3">After payment, email us your <strong>bKash Transaction ID</strong> and account email.</p>
                                <a
                                    href={`mailto:${SUPPORT_EMAIL}?subject=Credit Purchase - ${selectedBundle.name} Bundle&body=${generateEmailBody()}`}
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-black text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
                                >
                                    <Mail className="w-5 h-5" />
                                    Send Email with Transaction ID
                                </a>
                            </div>
                        </div>

                        {/* Step 3: Get Credits */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">3</div>
                                <h3 className="font-semibold text-black">Receive Your Credits</h3>
                            </div>
                            <div className="ml-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                <p className="text-slate-600 text-sm">We'll verify your payment and add <strong>{selectedBundle.credits} credits</strong> to your account within 1-2 hours (usually much faster!).</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
                        <p className="text-xs text-slate-500 text-center">
                            Questions? Email us at <a href={`mailto:${SUPPORT_EMAIL}`} className="text-black font-medium hover:underline">{SUPPORT_EMAIL}</a>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Bundle Selection View
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl my-8 border border-slate-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div>
                        <h2 className="text-2xl font-bold text-black">Buy Credit Bundles</h2>
                        <p className="text-slate-500 mt-1 text-sm">Credits never expire • No watermarks • Commercial license</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-black hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Free Tier Notice */}
                {currentTier === UserTier.FREE && (
                    <div className="mx-6 mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                <Zap className="w-5 h-5 text-black" />
                            </div>
                            <div>
                                <p className="text-black font-medium">You're on the Free Plan</p>
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
                                    ? 'border-black bg-slate-50 shadow-md'
                                    : 'border-slate-200 bg-white hover:border-slate-300'
                                }`}
                            onClick={() => handleSelectBundle(bundle)}
                        >
                            {bundle.popular && (
                                <div className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs font-bold px-3 py-0.5 rounded-full">
                                    MOST POPULAR
                                </div>
                            )}

                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-black">{bundle.icon}</span>
                                    <h3 className="text-lg font-bold text-black">{bundle.name}</h3>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="text-3xl font-bold text-black">
                                    ৳{bundle.price.toLocaleString()}
                                </div>
                                <p className="text-slate-400 text-sm">{bundle.pricePerImage}/image</p>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-slate-600 text-sm">
                                    <Check className="w-4 h-4 mr-2 text-black" />
                                    <span className="font-semibold">{bundle.credits} Credits</span>
                                </div>
                                <div className="flex items-center text-slate-600 text-sm">
                                    <Check className="w-4 h-4 mr-2 text-black" />
                                    {bundle.images} Image Generations
                                </div>
                                <div className="flex items-center text-slate-600 text-sm">
                                    <Check className="w-4 h-4 mr-2 text-black" />
                                    Never Expires
                                </div>
                                <div className="flex items-center text-slate-600 text-sm">
                                    <Check className="w-4 h-4 mr-2 text-black" />
                                    No Watermark
                                </div>
                            </div>

                            <button
                                className={`w-full py-2.5 rounded-xl font-medium transition-all ${bundle.popular
                                        ? 'bg-black text-white hover:bg-slate-800'
                                        : 'bg-slate-100 text-black hover:bg-slate-200'
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
                            <p className="text-black font-medium">Need a custom plan or API access?</p>
                            <p className="text-slate-500 text-sm">Contact us for enterprise solutions and bulk discounts</p>
                        </div>
                        <a
                            href={`mailto:${SUPPORT_EMAIL}?subject=Custom%20Plan%20Inquiry`}
                            className="shrink-0"
                        >
                            <button className="px-5 py-2.5 border border-slate-300 text-black rounded-xl font-medium hover:bg-white transition-colors">
                                Contact Sales
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
