import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './services/supabaseClient';
import { User } from './types';
import { Shield, Loader2, Lock } from 'lucide-react';
import { AdminDashboard } from './components/AdminDashboard';
import MainApp from './MainApp'; // We'll move the current App content here

// Admin Login Page Component
function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Check if already logged in
        supabase.auth.getUser().then(({ data }) => {
            if (data.user) {
                // Verify admin status
                const email = data.user.email;
                if (['renderman.arch@gmail.com', 'salarchman@gmail.com', 'projectkuddus@gmail.com'].includes(email || '')) {
                    // Redirect or show dashboard handled by parent
                }
            }
        });
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            if (data.user) {
                if (!['renderman.arch@gmail.com', 'salarchman@gmail.com', 'projectkuddus@gmail.com'].includes(data.user.email || '')) {
                    await supabase.auth.signOut();
                    setError('Access Denied: Not an admin account');
                } else {
                    window.location.reload(); // Reload to trigger auth state update in parent
                }
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-slate-900 p-8 text-center">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
                    <p className="text-slate-400 text-sm mt-1">renderman.ai Internal System</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Admin Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
                                placeholder="admin@renderman.ai"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                                <Lock size={14} /> {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Access Dashboard'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Protected Admin Route Wrapper
function AdminRoute() {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [currentUserEmail, setCurrentUserEmail] = useState('');

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user && ['renderman.arch@gmail.com', 'salarchman@gmail.com', 'projectkuddus@gmail.com'].includes(user.email || '')) {
                setIsAdmin(true);
                setCurrentUserEmail(user.email || '');
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="text-white animate-spin" /></div>;

    return isAdmin ? (
        <div className="min-h-screen bg-slate-50">
            <AdminDashboard isOpen={true} onClose={() => { }} currentUserEmail={currentUserEmail} />
        </div>
    ) : (
        <AdminLogin />
    );
}

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/admin" element={<AdminRoute />} />
                <Route path="/adminpanel" element={<Navigate to="/admin" replace />} />
                <Route path="/*" element={<MainApp />} />
            </Routes>
        </Router>
    );
}
