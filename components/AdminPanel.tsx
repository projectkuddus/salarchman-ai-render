import React, { useState, useEffect } from 'react';
import { Search, Shield, Save, X, CheckCircle, AlertCircle, Loader2, Users, CreditCard, Crown, Edit2, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { UserTier } from '../types';

interface AdminPanelProps {
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
    'projectkuddus@gmail.com'
];

export function AdminPanel({ isOpen, onClose, currentUserEmail }: AdminPanelProps) {
    // ============================================================================
    // 1. HOOKS (MUST BE AT THE TOP - NO EARLY RETURNS BEFORE THIS)
    // ============================================================================

    // View State
    const [view, setView] = useState<'list' | 'edit'>('list');
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<UserData[]>([]);
    const [stats, setStats] = useState({ total: 0, pro: 0, studio: 0, credits: 0 });

    // Search & Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTier, setFilterTier] = useState<string>('all');

    // Edit State
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [editTier, setEditTier] = useState<UserTier | ''>('');
    const [creditAdjustment, setCreditAdjustment] = useState<string>('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Data Fetching Effect
    useEffect(() => {
        // Only fetch if open and authorized, but the hook itself must always run
        if (isOpen && ADMIN_EMAILS.includes(currentUserEmail)) {
            fetchUsers();
        }
    }, [isOpen, currentUserEmail]);

    // ============================================================================
    // 2. HELPER FUNCTIONS
    // ============================================================================

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(100); // Fetch last 100 users for now

            if (error) throw error;

            const userList = data as UserData[];
            setUsers(userList);

            // Calculate Stats
            const newStats = {
                total: userList.length,
                pro: userList.filter(u => u.tier === UserTier.PRO).length,
                studio: userList.filter(u => u.tier === UserTier.STUDIO).length,
                credits: userList.reduce((acc, curr) => acc + (curr.credits || 0), 0)
            };
            setStats(newStats);

        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditUser = (user: UserData) => {
        setSelectedUser(user);
        setEditTier(user.tier);
        setCreditAdjustment('');
        setMessage(null);
        setView('edit');
    };

    const handleUpdate = async () => {
        if (!selectedUser) return;
        setLoading(true);
        setMessage(null);

        try {
            const updates: any = {};

            if (editTier && editTier !== selectedUser.tier) {
                updates.tier = editTier;
            }

            if (creditAdjustment) {
                const amount = parseInt(creditAdjustment);
                if (!isNaN(amount)) {
                    updates.credits = (selectedUser.credits || 0) + amount;
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
                .eq('id', selectedUser.id);

            if (profileError) throw profileError;

            // 2. Sync User Credits
            if (updates.credits !== undefined) {
                await supabase.from('user_credits').upsert({
                    user_id: selectedUser.id,
                    credits_available: updates.credits,
                    credits_used: 0
                });
            }

            // Update Local State
            const updatedUser = { ...selectedUser, ...updates };
            setUsers(users.map(u => u.id === selectedUser.id ? updatedUser : u));
            setSelectedUser(updatedUser);
            setMessage({ type: 'success', text: 'User updated successfully!' });

            // Refresh stats
            fetchUsers();

        } catch (err: any) {
            console.error(err);
            setMessage({ type: 'error', text: `Update failed: ${err.message}` });
        } finally {
            setLoading(false);
        }
    };

    // ============================================================================
    // 3. RENDER LOGIC & EARLY RETURNS
    // ============================================================================

    // Filtered Users Logic
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesFilter = filterTier === 'all' || user.tier === filterTier;
        return matchesSearch && matchesFilter;
    });

    // NOW it is safe to return null if not open
    if (!isOpen) return null;

    // Security check
    if (!ADMIN_EMAILS.includes(currentUserEmail)) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-hidden">
            <div className="relative w-full max-w-6xl h-[90vh] bg-slate-50 rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-6 bg-white border-b border-slate-200">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-900/20">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Admin Command Center <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-2">v3.0 Stable</span></h2>
                            <p className="text-slate-500 text-sm font-medium">Platform Management System</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-slate-400 hover:text-slate-900" />
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-hidden flex">

                    {/* Sidebar / Stats (Desktop) */}
                    <div className="w-64 bg-white border-r border-slate-200 p-6 hidden md:flex flex-col gap-6">
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overview</h3>

                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-3 mb-2 text-slate-500">
                                    <Users size={16} /> <span className="text-xs font-medium">Total Users</span>
                                </div>
                                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                            </div>

                            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                <div className="flex items-center gap-3 mb-2 text-blue-600">
                                    <Crown size={16} /> <span className="text-xs font-medium">Pro / Studio</span>
                                </div>
                                <p className="text-2xl font-bold text-blue-900">{stats.pro + stats.studio}</p>
                            </div>

                            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                                <div className="flex items-center gap-3 mb-2 text-amber-600">
                                    <CreditCard size={16} /> <span className="text-xs font-medium">Total Credits</span>
                                </div>
                                <p className="text-2xl font-bold text-amber-900">{stats.credits.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">

                        {view === 'list' ? (
                            <>
                                {/* Toolbar */}
                                <div className="p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                                    <div className="relative w-full md:w-96">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Search users..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 w-full md:w-auto">
                                        <Filter size={16} className="text-slate-400" />
                                        <select
                                            value={filterTier}
                                            onChange={(e) => setFilterTier(e.target.value)}
                                            className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                                        >
                                            <option value="all">All Tiers</option>
                                            <option value="Free">Free</option>
                                            <option value="Pro">Pro</option>
                                            <option value="Studio">Studio</option>
                                        </select>
                                        <button onClick={fetchUsers} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">
                                            <Loader2 size={16} className={`text-slate-600 ${loading ? 'animate-spin' : ''}`} />
                                        </button>
                                    </div>
                                </div>

                                {/* Table */}
                                <div className="flex-1 overflow-y-auto px-6 pb-6">
                                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                    <th className="p-4">User</th>
                                                    <th className="p-4">Tier</th>
                                                    <th className="p-4">Credits</th>
                                                    <th className="p-4">Joined</th>
                                                    <th className="p-4 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {filteredUsers.map(user => (
                                                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                                                        <td className="p-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                                                                    {user.full_name?.[0] || user.email[0].toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-slate-900 text-sm">{user.full_name || 'No Name'}</p>
                                                                    <p className="text-xs text-slate-500">{user.email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${user.tier === 'Studio' ? 'bg-purple-100 text-purple-700' :
                                                                    user.tier === 'Pro' ? 'bg-blue-100 text-blue-700' :
                                                                        'bg-slate-100 text-slate-600'
                                                                }`}>
                                                                {user.tier}
                                                            </span>
                                                        </td>
                                                        <td className="p-4">
                                                            <span className="font-mono text-sm font-medium text-slate-700">{user.credits}</span>
                                                        </td>
                                                        <td className="p-4">
                                                            <span className="text-xs text-slate-500">{new Date(user.created_at).toLocaleDateString()}</span>
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <button
                                                                onClick={() => handleEditUser(user)}
                                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            >
                                                                <Edit2 size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {filteredUsers.length === 0 && (
                                            <div className="p-12 text-center text-slate-400">
                                                <p>No users found matching your criteria.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* Edit View */
                            <div className="flex-1 p-8 flex flex-col items-center justify-center bg-slate-50">
                                <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                                    <button
                                        onClick={() => setView('list')}
                                        className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                                    >
                                        <ChevronLeft size={16} /> Back to List
                                    </button>

                                    <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
                                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xl font-bold">
                                            {selectedUser?.full_name?.[0] || selectedUser?.email[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900">{selectedUser?.full_name || 'No Name'}</h2>
                                            <p className="text-slate-500">{selectedUser?.email}</p>
                                            <p className="text-xs text-slate-400 mt-1">ID: {selectedUser?.id}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Account Tier</label>
                                            <select
                                                value={editTier}
                                                onChange={(e) => setEditTier(e.target.value as UserTier)}
                                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                                            >
                                                {Object.values(UserTier).map((tier) => (
                                                    <option key={tier} value={tier}>{tier}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Adjust Credits</label>
                                            <div className="flex gap-4">
                                                <div className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                                                    <span className="text-sm text-slate-500">Current Balance</span>
                                                    <span className="font-bold text-slate-900">{selectedUser?.credits}</span>
                                                </div>
                                                <input
                                                    type="number"
                                                    value={creditAdjustment}
                                                    onChange={(e) => setCreditAdjustment(e.target.value)}
                                                    placeholder="+/-"
                                                    className="w-32 p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                                                />
                                            </div>
                                        </div>

                                        {message && (
                                            <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                                }`}>
                                                {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                                {message.text}
                                            </div>
                                        )}

                                        <button
                                            onClick={handleUpdate}
                                            disabled={loading}
                                            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
