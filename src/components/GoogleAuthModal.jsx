import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Shield, Sparkles, ArrowRight, Lock, UserCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../store/AppContext.jsx';
import { updateGrowthState } from '../services/storage.js';

// Official Google G Multi-color SVG
export const GoogleLogoSvg = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export default function GoogleAuthModal({ isOpen, onClose, onSuccess }) {
  const { profile, saveProfile } = useApp();
  const [stage, setStage] = useState('select'); // 'select' | 'authenticating' | 'success'
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [customEmail, setCustomEmail] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  if (!isOpen) return null;

  const mockAccounts = [
    {
      name: profile?.name && profile.name !== 'there' ? profile.name : 'Neha Lende',
      email: 'neha.lende@gmail.com',
      avatar: 'N',
      bgColor: '#111111',
    },
    {
      name: 'Alex Rivera',
      email: 'alex.rivera@gmail.com',
      avatar: 'A',
      bgColor: '#4F46E5',
    },
  ];

  const handleAccountClick = (acc) => {
    setSelectedAccount(acc);
    setStage('authenticating');

    setTimeout(() => {
      // Save profile to context
      const updatedProfile = {
        ...(profile || {}),
        name: acc.name,
        email: acc.email,
        authProvider: 'google',
        currentTraits: profile?.currentTraits || 'Disciplined, Deeply Focused',
        targetTraits: profile?.targetTraits || 'High-performer, Calm under pressure',
        goals: profile?.goals || 'Master deep focus & daily micro-learning habits',
      };
      saveProfile(updatedProfile);
      updateGrowthState({ lastInteraction: Date.now() });

      setStage('success');
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    }, 1200);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail || !customEmail.includes('@')) return;
    const nameFromEmail = customEmail.split('@')[0].replace('.', ' ');
    const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
    handleAccountClick({
      name: formattedName,
      email: customEmail,
      avatar: formattedName[0].toUpperCase(),
      bgColor: '#111111',
    });
  };

  const handleFinish = () => {
    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-[#F9F7F2] rounded-3xl border border-black/15 w-full max-w-md p-7 relative shadow-2xl overflow-hidden text-[#111111]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/5 text-[#111111] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STAGE 1: ACCOUNT SELECTION */}
        {stage === 'select' && (
          <div>
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white border border-black/10 flex items-center justify-center shadow-sm mb-4">
                <GoogleLogoSvg size={24} />
              </div>
              <h2 className="font-editorial text-2xl font-bold text-[#111111] tracking-tight">
                Sign up with Google
              </h2>
              <p className="text-xs text-[#666666] mt-1 max-w-xs">
                Choose an account to continue to <strong className="text-[#111111]">BECOME AI</strong>
              </p>
            </div>

            {/* Account List */}
            {!isCustomMode ? (
              <div className="space-y-3 mb-6">
                {mockAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    onClick={() => handleAccountClick(acc)}
                    className="w-full p-3.5 rounded-2xl bg-white border border-black/10 hover:border-black/30 hover:bg-[#F0EDE6] transition-all flex items-center gap-3.5 text-left group shadow-xs cursor-pointer"
                  >
                    <div
                      className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-xs"
                      style={{ backgroundColor: acc.bgColor }}
                    >
                      {acc.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-[#111111] truncate group-hover:text-black">
                        {acc.name}
                      </div>
                      <div className="text-xs text-[#6E6E6E] truncate">{acc.email}</div>
                    </div>
                    <div className="text-xs font-semibold text-black/40 group-hover:text-black flex items-center gap-1">
                      <span>Connect</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </button>
                ))}

                {/* Use another account button */}
                <button
                  onClick={() => setIsCustomMode(true)}
                  className="w-full p-3.5 rounded-2xl bg-[#EBE7DF]/60 border border-dashed border-black/20 hover:bg-[#EBE7DF] transition-all flex items-center justify-center gap-2 text-xs font-semibold text-[#444444] cursor-pointer"
                >
                  <GoogleLogoSvg size={16} />
                  <span>Use another Google account</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleCustomSubmit} className="mb-6 space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#666666] mb-1.5 font-semibold">
                    Google Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="your.email@gmail.com"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      autoFocus
                      className="w-full p-3.5 rounded-xl bg-white border border-black/20 text-sm text-[#111111] focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsCustomMode(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#666666] hover:text-black"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-pill-primary py-2.5 text-xs font-bold font-mono uppercase flex items-center justify-center gap-2"
                  >
                    <span>Continue with Google</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* Privacy note */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-[#777777] pt-2 border-t border-black/10">
              <Shield className="w-3.5 h-3.5 text-[#111111]" />
              <span>Protected by 256-bit Google OAuth encryption</span>
            </div>
          </div>
        )}

        {/* STAGE 2: AUTHENTICATING SPINNER */}
        {stage === 'authenticating' && (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="relative w-16 h-16 mb-5 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-3 border-black/10 border-t-black animate-spin" />
              <GoogleLogoSvg size={28} />
            </div>
            <h3 className="font-editorial text-xl font-bold text-[#111111] mb-1">
              Authenticating with Google...
            </h3>
            <p className="text-xs text-[#666666]">
              Connecting <strong className="text-[#111111]">{selectedAccount?.email}</strong>
            </p>
          </div>
        )}

        {/* STAGE 3: SUCCESS */}
        {stage === 'success' && (
          <div className="py-4 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center mb-4 shadow-lg">
              <UserCheck className="w-7 h-7 stroke-[2]" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] font-bold mb-2">
              Google Account Verified ✓
            </span>
            <h3 className="font-editorial text-2xl font-bold text-[#111111] mb-1">
              Welcome, {selectedAccount?.name}!
            </h3>
            <p className="text-xs text-[#666666] mb-6 max-w-xs leading-relaxed">
              Your Google identity profile has been synced. Your personal AI Growth Curator is ready.
            </p>

            <button
              onClick={handleFinish}
              className="w-full btn-pill-primary py-3.5 text-xs font-bold font-mono uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>Enter Growth Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
