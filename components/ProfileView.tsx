import React, { useState } from 'react';
import { User, UserCredits, GenerationResult } from '../types';
import { LogOut, CreditCard, Clock, Download, Trash2, Shield, Save, User as UserIcon, Mail, Key, History, Maximize2, X } from 'lucide-react';
import { Button } from './Button';

interface ProfileViewProps {
    user: User;
    credits: UserCredits;
    history: GenerationResult[];
    onUpdateProfile: (name: string, password?: string) => void;
    onPurchase: (amount: number) => void;
    onOpenAdmin: () => void;
    onRestore: (item: GenerationResult) => void;
    onRecoverHistory: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, credits, history, onUpdateProfile, onPurchase, onOpenAdmin, onRestore, onRecoverHistory }) => {
    const [name, setName] = useState(user.name);
    const [password, setPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [selectedImage, setSelectedImage] = useState<GenerationResult | null>(null);

    const handleSave = () => {
        setIsSaving(true);
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
                {['renderman.arch@gmail.com', 'salarchman@gmail.com', 'projectkuddus@gmail.com'].includes(user.email) && (
                    <button
                        onClick={onOpenAdmin}
                        className="ml-auto flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-lg"
                    >
                        <Shield size={16} />
                        <span className="font-medium text-sm">Admin Panel</span>
                    </button>
                )}
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
                                <div className="flex items-center gap-2">
                                    <p className="text-white font-medium">{user.tier}</p>
                                    {user.tier === 'Free' && (
                                        <button
                                            onClick={() => onPurchase(0)} // Trigger pricing modal
                                            className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded font-bold hover:bg-yellow-400 transition-colors"
                                        >
                                            UPGRADE
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="uppercase tracking-wider mb-1">Total Used</p>
                                <p className="text-white font-medium">{credits.totalUsed}</p>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>
                </div>

                {/* Buy Credits Section */}
                <div className="md:col-span-2 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl border border-yellow-500/20 p-8 shadow-sm flex flex-col justify-center items-start space-y-4">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center text-yellow-600">
                        <CreditCard size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-slate-900">Need more credits?</h3>
                        <p className="text-sm text-slate-500 mt-1">
                            Purchase credit bundles to remove watermarks and unlock professional features. Credits never expire!
                        </p>
                    </div>
                    <button
                        onClick={() => onPurchase(0)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black rounded-xl font-bold hover:from-yellow-400 hover:to-orange-400 transition-all shadow-lg shadow-yellow-500/20"
                    >
                        <CreditCard size={18} />
                        <span>Buy Credits</span>
                    </button>
                </div>
            </div>

            {/* Generation History Section - Simple & Clean */}
            <div className="pt-8 border-t border-slate-200">
                <div className="flex items-center gap-2 text-slate-900 font-medium mb-6">
                    <History size={20} /> <span>Generation History</span>
                    <div className="ml-auto flex items-center gap-4">
                        <button
                            onClick={onRecoverHistory}
                            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            <Shield size={12} /> Recover Lost History
                        </button>
                        <span className="text-xs text-slate-400">{history.length} projects</span>
                    </div>
                </div>

                {history.length === 0 ? (
                    <div className="text-center text-slate-400 py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <History size={32} className="mx-auto mb-3 opacity-20" />
                        <p className="text-sm font-medium">No generation history yet</p>
                        <p className="text-xs mt-1 opacity-70">Your generated images will appear here</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {history.map(item => (
                            <div key={item.id} className="group relative bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-slate-400 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1">
                                <div className="aspect-square relative overflow-hidden bg-slate-100">
                                    <img
                                        src={item.generatedImage}
                                        alt={item.style}
                                        onClick={() => setSelectedImage(item)}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 cursor-pointer"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                        <button
                                            onClick={() => onRestore(item)}
                                            className="w-full bg-white text-slate-900 text-xs py-2.5 rounded-lg shadow-lg flex items-center justify-center gap-2 font-medium hover:bg-slate-100 transition-colors"
                                        >
                                            <Maximize2 size={14} /> Restore
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4 border-t border-slate-100">
                                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                                        <span className="uppercase tracking-wider font-medium">{item.viewType}</span>
                                        <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-900 truncate">{item.style}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div
                        className="relative max-w-4xl max-h-[90vh] w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedImage.generatedImage}
                            alt={selectedImage.style}
                            className="w-full h-full object-contain rounded-xl shadow-2xl"
                        />
                        <div className="absolute top-4 right-4 flex gap-2">
                            <a
                                href={selectedImage.generatedImage}
                                download={`${selectedImage.style}-${selectedImage.viewType}.png`}
                                className="p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
                                title="Download"
                            >
                                <Download size={20} className="text-slate-900" />
                            </a>
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
                                title="Close"
                            >
                                <X size={20} className="text-slate-900" />
                            </button>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-lg">
                            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                                <span className="uppercase tracking-wider font-medium">{selectedImage.viewType}</span>
                                <span>{new Date(selectedImage.timestamp).toLocaleDateString()}</span>
                            </div>
                            <p className="text-lg font-medium text-slate-900">{selectedImage.style}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const SettingsIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);
