import React, { useState } from 'react';
import { User, UserCredits, GenerationResult } from '../types';
import { Button } from './Button';
import { Save, CreditCard, User as UserIcon, Shield, Mail, Key, History, Filter, LayoutGrid, Layers, Calendar, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { HistoryCard } from './HistoryCard';

interface ProfileViewProps {
    user: User;
    credits: UserCredits;
    history: GenerationResult[];
    onUpdateProfile: (name: string, password?: string) => void;
    onPurchase: (amount: number) => void;
    onRestore: (item: GenerationResult) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, credits, history, onUpdateProfile, onPurchase, onRestore }) => {
    const [name, setName] = useState(user.name);
    const [password, setPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Filter States
    const [filterStyle, setFilterStyle] = useState<string>('All Styles');
    const [filterView, setFilterView] = useState<string>('All Views');
    const [showStyleDropdown, setShowStyleDropdown] = useState(false);
    const [showViewDropdown, setShowViewDropdown] = useState(false);

    // Get unique styles and views from history
    const uniqueStyles = ['All Styles', ...Array.from(new Set(history.map(item => item.style)))];
    const uniqueViews = ['All Views', ...Array.from(new Set(history.map(item => item.viewType)))];

    const filteredHistory = history.filter(item => {
        if (filterStyle !== 'All Styles' && item.style !== filterStyle) return false;
        if (filterView !== 'All Views' && item.viewType !== filterView) return false;
        return true;
    });

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

                {/* Contact for Credits */}
                <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm flex flex-col justify-center items-start space-y-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                        <Mail size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-slate-900">Need more credits?</h3>
                        <p className="text-sm text-slate-500 mt-1">
                            We are currently in beta. For credit top-ups and enterprise plans, please contact our sales team directly at <span className="font-medium text-slate-900">salarchman@gmail.com</span>.
                        </p>
                    </div>
                    <a
                        href="mailto:salarchman@gmail.com?subject=Credit Purchase Request"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
                    >
                        <Mail size={18} />
                        <span>Contact Sales</span>
                    </a>
                </div>
            </div>

            {/* Project Gallery Section */}
            <div className="pt-8 border-t border-slate-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-2 text-slate-900 font-medium">
                        <LayoutGrid size={20} /> <span>Project Gallery</span>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                        {/* Style Filter */}
                        <div className="relative">
                            <button
                                onClick={() => { setShowStyleDropdown(!showStyleDropdown); setShowViewDropdown(false); }}
                                className={`flex items-center gap-2 px-3 py-2 bg-white border ${filterStyle !== 'All Styles' ? 'border-slate-900 text-slate-900 bg-slate-50' : 'border-slate-200 text-slate-600'} rounded-lg text-xs font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap`}
                            >
                                <Filter size={14} />
                                <span>{filterStyle}</span>
                                <ChevronDown size={14} className="text-slate-400" />
                            </button>
                            {showStyleDropdown && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setShowStyleDropdown(false)}></div>
                                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-20 max-h-60 overflow-y-auto">
                                        {uniqueStyles.map(style => (
                                            <button
                                                key={style}
                                                onClick={() => { setFilterStyle(style); setShowStyleDropdown(false); }}
                                                className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 ${filterStyle === style ? 'font-bold text-slate-900 bg-slate-50' : 'text-slate-600'}`}
                                            >
                                                {style}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* View Filter */}
                        <div className="relative">
                            <button
                                onClick={() => { setShowViewDropdown(!showViewDropdown); setShowStyleDropdown(false); }}
                                className={`flex items-center gap-2 px-3 py-2 bg-white border ${filterView !== 'All Views' ? 'border-slate-900 text-slate-900 bg-slate-50' : 'border-slate-200 text-slate-600'} rounded-lg text-xs font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap`}
                            >
                                <Layers size={14} />
                                <span>{filterView}</span>
                                <ChevronDown size={14} className="text-slate-400" />
                            </button>
                            {showViewDropdown && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setShowViewDropdown(false)}></div>
                                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-20 max-h-60 overflow-y-auto">
                                        {uniqueViews.map(view => (
                                            <button
                                                key={view}
                                                onClick={() => { setFilterView(view); setShowViewDropdown(false); }}
                                                className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 ${filterView === view ? 'font-bold text-slate-900 bg-slate-50' : 'text-slate-600'}`}
                                            >
                                                {view}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap opacity-50 cursor-not-allowed">
                            <Calendar size={14} />
                            <span>All Time</span>
                            <ChevronDown size={14} className="text-slate-400" />
                        </button>
                        <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                            <SlidersHorizontal size={14} />
                        </button>
                    </div>
                </div>

                {filteredHistory.length === 0 ? (
                    <div className="text-center text-slate-400 py-24 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                            <LayoutGrid size={32} className="opacity-20" />
                        </div>
                        <p className="text-sm font-medium text-slate-500">No projects found matching filters.</p>
                        <button
                            onClick={() => { setFilterStyle('All Styles'); setFilterView('All Views'); }}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-2"
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredHistory.map(item => (
                            <HistoryCard key={item.id} item={item} onRestore={onRestore} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};



const SettingsIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);
