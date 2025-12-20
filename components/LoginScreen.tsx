
import React, { useState } from 'react';
import { Box, CheckCircle2, ArrowLeft } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { User } from '../types';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  onBack: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onBack }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
      // Redirect happens automatically
    } catch (error) {
      console.error("Login failed", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>

      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-slate-100/80 rounded-full blur-3xl"></div>

      <button
        onClick={onBack}
        className="absolute top-8 left-8 z-20 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors bg-white/50 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-200/50"
      >
        <ArrowLeft size={16} /> <span className="text-sm font-medium">Back to Home</span>
      </button>

      <div className="z-10 w-full max-w-md p-8 relative">
        <div className="text-center mb-12">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-xl shadow-slate-200 mb-4">
              <Box size={24} className="text-white" />
            </div>
            <div className="flex flex-col items-center leading-tight">
              <h1 className="text-4xl font-light tracking-tight text-slate-900">renderman.ai</h1>
              <span className="text-lg font-normal text-slate-500 mt-1">by salARCHman studio</span>
            </div>
          </div>
          <p className="text-slate-500 font-mono text-xs uppercase tracking-widest text-center">Professional Rendering Engine</p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h2 className="text-lg font-medium mb-6 text-center">Architect Workspace Access</h2>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 transition-all mb-8 shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <div className="space-y-4 pt-2 border-t border-slate-100">
            <FeatureItem text="Unlimited Project History" />
            <FeatureItem text="Custom Render Styles" />
            <FeatureItem text="4K Export Quality" />
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-400 mt-8">
          &copy; {new Date().getFullYear()} renderman.ai (by salARCHman studio). All rights reserved.
        </p>
      </div>
    </div>
  );
};

const FeatureItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-3 text-sm text-slate-600">
    <CheckCircle2 size={16} className="text-slate-900" />
    <span>{text}</span>
  </div>
);
