import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRiderAuth } from '../context/RiderAuthContext';
import { 
  Bike, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

const RiderLogin = () => {
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const { login } = useRiderAuth();
  const navigate = useNavigate();

  // Theme Constants
  const THEME = {
    yellow: '#FFD700', // Gold/Yellow
    black: '#000000',
    darkGrey: '#121212',
    lightGrey: '#27272a',
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.phone || !formData.password) {
      toast.error('Credentials required');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(formData.phone, formData.password);
      if (result.success) {
        toast.success('Engine Started. Welcome back!', {
            icon: '🏍️',
            style: {
                background: '#333',
                color: '#FFD700',
            }
        });
        navigate('/rider/dashboard');
      } else {
        toast.error(result.message || 'Login failed');
      }
    } catch (error) {
      toast.error('Connection error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden font-sans text-zinc-100 py-12">

      {/* Subtle background accents */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)', backgroundSize: '36px 36px' }} />

      <div className="relative z-10 w-full max-w-5xl mx-4 bg-zinc-900/70 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl grid md:grid-cols-2">

        {/* Left hero panel (visible on md+) */}
        <div className="hidden md:flex flex-col justify-center items-start p-12 bg-gradient-to-br from-zinc-900 via-black to-[#0b0b0b]">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-[#FFD700] rounded-lg flex items-center justify-center shadow-lg">
              <Bike className="w-8 h-8 text-black" strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white">Rider.Go</h2>
              <p className="text-sm text-zinc-400 mt-1">Fleet Dashboard & Delivery Tools</p>
            </div>
          </div>

          <h3 className="text-3xl font-black text-white leading-tight mb-4">Get back on the road faster</h3>
          <p className="text-zinc-400 mb-6">Quick access to orders, navigation, and earnings — optimized for riders.</p>

          <div className="flex flex-col gap-3 w-full max-w-xs">
            <div className="flex items-center gap-3 bg-zinc-800/60 rounded-lg p-3">
              <ShieldCheck className="w-5 h-5 text-[#FFD700]" />
              <div className="text-sm text-zinc-300">Secure sign-in & verified payouts</div>
            </div>
            <div className="flex items-center gap-3 bg-zinc-800/40 rounded-lg p-3">
              <Zap className="w-5 h-5 text-[#FFD700]" />
              <div className="text-sm text-zinc-300">Fast dispatch & live updates</div>
            </div>
          </div>
        </div>

        {/* Right: login form panel */}
        <div className="px-8 py-10 md:py-12 md:px-10">
          <div className="text-center md:text-left mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="w-14 h-14 bg-[#FFD700] flex items-center justify-center transform rotate-12 rounded-lg shadow-[0_6px_30px_rgba(255,215,0,0.12)]">
                <Bike className="w-8 h-8 text-black -rotate-12" strokeWidth={2.3} />
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-1">Rider Sign In</h1>
            <p className="text-zinc-400">Enter your mobile number and password to continue</p>
          </div>

          <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Mobile number</label>
                <div className="relative mt-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-zinc-500" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-4 py-3 bg-black border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
                    placeholder="000 000 0000"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Password</label>
                <div className="relative mt-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-zinc-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-11 pr-12 py-3 bg-black border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-zinc-500 hover:text-[#FFD700] transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-zinc-500 hover:text-[#FFD700] transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-zinc-400">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="h-4 w-4 rounded bg-zinc-800 border-zinc-700 text-[#FFD700] focus:ring-[#FFD700] accent-[#FFD700]"
                  />
                  Keep me signed in
                </label>
                <Link to="/rider/forgot-password" className="text-sm text-zinc-400 hover:text-[#FFD700]">Forgot?</Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 bg-[#FFD700] text-black font-bold rounded-lg hover:bg-[#E6C200] transition-all disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
              </button>
            </form>

            <div className="mt-5 text-center border-t border-zinc-800 pt-4">
              <p className="text-sm text-zinc-400">New to the fleet? <Link to="/rider/register" className="text-white font-semibold hover:text-[#FFD700]">Join now</Link></p>
            </div>
          </div>

          <div className="mt-6 text-center md:text-left text-sm text-zinc-500">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-800/40 rounded-full">
              <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
              <span>Secure • 24/7 monitoring</span>
            </div>
            <div className="mt-3">
              <Link to="/" className="text-xs text-zinc-500 hover:text-white">← Back to Main Store</Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RiderLogin;