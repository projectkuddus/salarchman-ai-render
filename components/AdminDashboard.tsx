import React, { useState, useEffect } from 'react';
import { Search, User as UserIcon, CreditCard, Shield, Save, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { UserTier } from '../types';

interface AdminDashboardProps {
    isOpen: boolean;
    onClose: () => void;
    currentUserEmail: string;
}

interface UserData {
    id: string;
    email: string;
    full_name: string;
    tier: UserTier;
    credits: number;
    created_at: string;
}

// List of authorized admin emails
const ADMIN_EMAILS = [
    'renderman.arch@gmail.com',
    'salarchman@gmail.com',
    'projectkuddus@gmail.com' // Adding likely dev emails, can be edited
];

export function AdminDashboard({ isOpen, onClose, currentUserEmail }: AdminDashboardProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [foundUser, setFoundUser] = useState<UserData | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Edit states
    const [editTier, setEditTier] = useState<UserTier | ''>('');
    const [creditAdjustment, setCreditAdjustment] = useState<string>('');

    // Verify admin access
    if (!isOpen) return null;
    if (!ADMIN_EMAILS.includes(currentUserEmail)) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <div className="bg-white p-8 rounded-2xl max-w-md text-center">
                    <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-black mb-2">Access Denied</h2>
                    <p className="text-slate-600 mb-6">You do not have permission to view this area.</p>
                    <button onClick={onClose} className="px-6 py-2 bg-black text-white rounded-lg">Close</button>
                </div>
            </div>
        );
    }

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!searchTerm.trim()) return;

        setSearching(true);
        setMessage(null);
        setFoundUser(null);

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .ilike('email', searchTerm)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    setMessage({ type: 'error', text: 'User not found.' });
                } else {
                    setMessage({ type: 'error', text: 'Error searching user.' });
                    console.error(error);
                }
            } else {
                setFoundUser(data as UserData);
                setEditTier(data.tier as UserTier);
                setCreditAdjustment('');
            }
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'An unexpected error occurred.' });
        } finally {
            setSearching(false);
        }
    };

    const handleUpdate = async () => {
        if (!foundUser) return;
        setLoading(true);
        setMessage(null);

        try {
            const updates: any = {};
            let creditChange = 0;

            // Update Tier if changed
            if (editTier && editTier !== foundUser.tier) {
                updates.tier = editTier;
            }

            // Update Credits if entered
            if (creditAdjustment) {
                const amount = parseInt(creditAdjustment);
                if (!isNaN(amount)) {
                    creditChange = amount;
                    updates.credits = foundUser.credits + amount;
                }
            }

            if (Object.keys(updates).length === 0) {
                setLoading(false);
                return;
            }

            // 1. Update Profile
            const { error: profileError } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', foundUser.id);

            if (profileError) throw profileError;

            // 2. Update User Credits Table (sync)
            if (updates.credits !== undefined) {
                const { error: creditsError } = await supabase
                    .from('user_credits')
                    .upsert({
                        user_id: foundUser.id,
                        credits_available: updates.credits,
                        credits_used: 0 // We don't track used here strictly, just available
                    });

                if (creditsError) console.error('Error syncing user_credits:', creditsError);
            }

            // 3. Log Admin Action (Optional but good practice)
            // We could insert into 'transactions' or a new 'admin_logs' table
            // For now, we'll just log to console

            // Refresh local state
            setFoundUser(prev => prev ? { ...prev, ...updates } : null);
            setCreditAdjustment('');
            setMessage({ type: 'success', text: 'User updated successfully!' });

        } catch (err: any) {
            console.error(err);
            setMessage({ type: 'error', text: `Update failed: ${err.message}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl my-8 border border-slate-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-black text-white rounded-lg">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-black">Admin Dashboard</h2>
                            <p className="text-slate-500 text-sm">Manage Users & Credits</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-black hover:bg-slate-200 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">

                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex gap-2 mb-8">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="email"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search user by email..."
                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={searching || !searchTerm}
                            className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
                        >
                            {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
                        </button>
                    </form>

                    {/* Messages */}
                    {message && (
                        <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            {message.text}
                        </div>
                    )}

                    {/* User Details & Edit */}
                    {foundUser && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">

                            {/* User Info Card */}
                            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                                    <UserIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-black">{foundUser.full_name || 'No Name'}</h3>
                                    <p className="text-slate-500">{foundUser.email}</p>
                                    <div className="flex gap-2 mt-2">
                                        <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-xs font-medium text-slate-600">
                                            ID: {foundUser.id.slice(0, 8)}...
                                        </span>
                                        <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-xs font-medium text-slate-600">
                                            Joined: {new Date(foundUser.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Tier Management */}
                                <div className="p-5 border border-slate-200 rounded-xl">
                                    <label className="block text-sm font-medium text-slate-700 mb-3">Account Tier</label>
                                    <div className="space-y-3">
                                        <select
                                            value={editTier}
                                            onChange={(e) => setEditTier(e.target.value as UserTier)}
                                            className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                        >
                                            {Object.values(UserTier).map((tier) => (
                                                <option key={tier} value={tier}>{tier}</option>
                                            ))}
                                        </select>
                                        <p className="text-xs text-slate-500">
                                            Current: <span className="font-semibold text-black">{foundUser.tier}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Credit Management */}
                                <div className="p-5 border border-slate-200 rounded-xl">
                                    <label className="block text-sm font-medium text-slate-700 mb-3">Add/Remove Credits</label>
                                    <div className="space-y-3">
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                value={creditAdjustment}
                                                onChange={(e) => setCreditAdjustment(e.target.value)}
                                                placeholder="+/- Amount"
                                                className="flex-1 p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            Current Balance: <span className="font-semibold text-black">{foundUser.credits}</span>
                                        </p>
                                    </div>
                                </div>

                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end pt-4 border-t border-slate-100">
                                <button
                                    onClick={handleUpdate}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-bold hover:bg-slate-800 transition-colors disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    Save Changes
                                </button>
                            </div>

                        </div>
                    )}

                    {!foundUser && !searching && !message && (
                        <div className="text-center py-12 text-slate-400">
                            <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>Search for a user to manage their account</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
