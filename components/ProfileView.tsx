import React, { useState } from 'react';
import { User, UserCredits } from '../types';
import { Button } from './Button';
import { Save, CreditCard, User as UserIcon, Shield, Mail, Key } from 'lucide-react';

interface ProfileViewProps {
    user: User;
    credits: UserCredits;
    onUpdateProfile: (name: string, password?: string) => void;
    onPurchase: (amount: number) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, credits, onUpdateProfile, onPurchase }) => {
    const [name, setName] = useState(user.name);
    const [password, setPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            onUpdateProfile(name, password);
            setIsSaving(false);
            setPassword('');
        }, 800);
    };

    return (
        <div className="max-w-4xl mx-auto p-8 space-y-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-900">
                    <UserIcon size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-light text-slate-900">User Profile</h2>
                    <p className="text-sm text-slate-500">Manage your account settings and credits</p>
                </div>
            </div>

            {/* Account Details */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-6 text-slate-900 font-medium">
                    <SettingsIcon /> <span>Account Details</span>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-shrink-0 flex flex-col items-center gap-3">
                        <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-2xl object-cover border-4 border-slate-50 shadow-inner" />
                        <button className="text-xs text-slate-500 hover:text-slate-900 font-medium">Tap to change</button>
                    </div>

                    <div className="flex-1 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                                />
                                <UserIcon size={16} className="absolute right-4 top-3.5 text-slate-400" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 cursor-not-allowed"
                                />
                                <Mail size={16} className="absolute right-4 top-3.5 text-slate-400" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Change Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter new password to change"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
                                />
                                <Key size={16} className="absolute right-4 top-3.5 text-slate-400" />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button onClick={handleSave} disabled={isSaving} className="bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 flex items-center gap-2">
                                {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                                <span>Save Changes</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Wallet & Credits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Current Balance */}
                <div className="md:col-span-1 bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/10">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-slate-400 mb-6">
                            <CreditCard size={18} /> <span className="font-medium">Wallet & Credits</span>
                        </div>
                        <div className="mb-8">
                            <p className="text-sm text-slate-400 mb-1">Current Balance</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-bold tracking-tight">{credits.available}</span>
                                <span className="text-xl font-medium text-slate-500">CR</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-end text-xs text-slate-500 border-t border-white/10 pt-4">
                            <div>
                                <p className="uppercase tracking-wider mb-1">Plan</p>
                                <p className="text-white font-medium">Free Tier</p>
                            </div>
                            <div className="text-right">
                                <p className="uppercase tracking-wider mb-1">Total Used</p>
                                <p className="text-white font-medium">{credits.totalUsed}</p>
                            </div>
                        </div>
                    </div>
                    {/* Decorative background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>
                </div>

                {/* Purchase Options */}
                <div className="md:col-span-2 space-y-4">
                    <CreditPack amount={100} price={9.99} onPurchase={() => onPurchase(100)} />
                    <CreditPack amount={500} price={39.99} onPurchase={() => onPurchase(500)} popular />
                    <CreditPack amount={1200} price={89.99} onPurchase={() => onPurchase(1200)} />
                </div>
            </div>
        </div>
    );
};

const CreditPack = ({ amount, price, onPurchase, popular }: { amount: number, price: number, onPurchase: () => void, popular?: boolean }) => (
    <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${popular ? 'bg-white border-blue-200 shadow-md shadow-blue-900/5 ring-1 ring-blue-100' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg ${popular ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-700'}`}>
                {amount}
            </div>
            <div>
                <h4 className="font-medium text-slate-900">Credit Pack</h4>
                <p className="text-xs text-slate-500">One-time purchase</p>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <span className="font-medium text-slate-900">${price}</span>
            <button onClick={onPurchase} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${popular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                Buy
            </button>
        </div>
    </div>
);

const SettingsIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);
