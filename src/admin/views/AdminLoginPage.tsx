import React, { useState } from 'react';
import { Logo } from '../../components/common/Logo';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff, UserCheck } from 'lucide-react';
import { StoreService } from '../../services/store';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onNavigateHome,
}) => {
  const [email, setEmail] = useState('veloradevelopers.inquiry@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide both email address and password.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const res = StoreService.loginAdmin(email, password);
      setLoading(false);
      if (res.success) {
        onLoginSuccess();
      } else {
        setError(res.message || 'Access denied. Only registered employees or the owner can assess the admin panel.');
      }
    }, 250);
  };

  const handleFillAccount = (accEmail: string, accPass: string) => {
    setEmail(accEmail);
    setPassword(accPass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#00291E] flex flex-col justify-between p-4 sm:p-8 text-white relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A24A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#003D2B]/40 rounded-full blur-3xl pointer-events-none" />

      {/* Top bar */}
      <div className="max-w-[1280px] mx-auto w-full flex items-center justify-between z-10">
        <button onClick={onNavigateHome} className="hover:opacity-90 transition-opacity">
          <Logo variant="light" size="sm" showTagline={true} />
        </button>

        <button
          onClick={onNavigateHome}
          className="text-xs font-semibold text-white/70 hover:text-[#C9A24A] transition-colors"
        >
          ← Return to Public Website
        </button>
      </div>

      {/* Center login card */}
      <div className="my-auto max-w-md w-full mx-auto z-10 py-10">
        <div className="bg-[#001D15] rounded-2xl border border-[#C9A24A]/40 p-8 sm:p-10 shadow-2xl relative">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-[#C9A24A]/20 text-[#C9A24A] flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#F8F0D8] font-normal">
              Admin CMS Portal
            </h1>
            <p className="text-xs text-white/60 mt-1 font-light">
              Velora Developers Management Console
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-white/80 font-medium mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#C9A24A] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@veloradevelopers.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#00291E] border border-white/20 focus:border-[#C9A24A] rounded-lg text-white placeholder-white/40 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/80 font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#C9A24A] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your login password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-[#00291E] border border-white/20 focus:border-[#C9A24A] rounded-lg text-white placeholder-white/40 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-[#C9A24A] via-[#DDB75C] to-[#C9A24A] hover:brightness-105 active:scale-[0.99] text-[#00291E] font-bold text-xs tracking-wider uppercase py-3.5 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Verifying Credentials...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Authorized Accounts Selector */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center space-y-2">
            <span className="text-[10px] text-white/60 block uppercase tracking-wider font-semibold">
              Authorized Login Credentials (Preset Defaults):
            </span>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button
                type="button"
                onClick={() => handleFillAccount('veloradevelopers.inquiry@gmail.com', 'velora2026')}
                className="text-[11px] bg-white/5 hover:bg-white/10 border border-[#C9A24A]/30 text-[#C9A24A] px-3 py-1.5 rounded transition-colors text-left flex items-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Owner (velora2026)</span>
              </button>
              <button
                type="button"
                onClick={() => handleFillAccount('employee@veloradevelopers.com', 'employee2026')}
                className="text-[11px] bg-white/5 hover:bg-white/10 border border-white/20 text-white/80 px-3 py-1.5 rounded transition-colors text-left flex items-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Employee (employee2026)</span>
              </button>
            </div>
            <p className="text-[10px] text-white/40 pt-1">
              Passwords can be changed anytime in <strong className="text-white/60">Admin Users & Security</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-[1280px] mx-auto w-full text-center text-[11px] text-white/40 z-10">
        © 2026 Velora Developers. Turning Land Into Landmarks.
      </div>
    </div>
  );
};
