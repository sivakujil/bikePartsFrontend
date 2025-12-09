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
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden font-sans text-zinc-100">
      
      {/* --- Background Effects --- */}
      {/* Yellow Spotlights */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#FFD700]/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#FFD700]/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Grid Texture */}
      <div className="absolute inset-0 opacity-[0.05]" 
           style={{ 
             backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', 
             backgroundSize: '30px 30px' 
           }}>
      </div>

      <div className="relative z-10 w-full max-w-md px-6 py-8">
        
        {/* --- Header Section --- */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-6 relative">
            {/* Hexagon Shape CSS */}
            <div className="w-20 h-20 bg-[#FFD700] flex items-center justify-center transform rotate-45 rounded-xl shadow-[0_0_30px_rgba(255,215,0,0.3)]">
                <Bike className="w-10 h-10 text-black transform -rotate-45" strokeWidth={2.5} />
            </div>
            
            {/* Floating Status Dot */}
            <div className="absolute -bottom-2 -right-2 bg-black border-2 border-zinc-900 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-lg">
                <div className="w-2 h-2 bg-[#FFD700] rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Partner</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase italic">
            Rider<span style={{ color: THEME.yellow }}>.Go</span>
          </h1>
          <p className="text-zinc-500 font-medium">Logistics & Delivery Portal</p>
        </div>

        {/* --- Login Card --- */}
        <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-8 shadow-2xl relative group">
          {/* Top Border Accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-50"></div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Phone Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#FFD700] ml-1">Mobile Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-4 py-4 bg-black border border-zinc-800 rounded-lg text-white placeholder-zinc-700 focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition-all"
                  placeholder="000 000 0000"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#FFD700] ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-11 pr-12 py-4 bg-black border border-zinc-800 rounded-lg text-white placeholder-zinc-700 focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-zinc-500 hover:text-[#FFD700] transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-zinc-500 hover:text-[#FFD700] transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Extras */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 rounded bg-zinc-800 border-zinc-700 text-[#FFD700] focus:ring-[#FFD700] focus:ring-offset-0 cursor-pointer accent-[#FFD700]"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-zinc-400 cursor-pointer hover:text-white transition-colors">
                  Remember device
                </label>
              </div>
              <Link
                to="/rider/forgot-password"
                className="text-sm font-semibold text-zinc-400 hover:text-[#FFD700] transition-colors"
              >
                Recover ID?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative flex items-center justify-center py-4 px-4 bg-[#FFD700] hover:bg-[#E6C200] text-black font-extrabold text-lg uppercase tracking-wide rounded-lg transition-all shadow-[0_5px_20px_rgba(255,215,0,0.2)] hover:shadow-[0_10px_30px_rgba(255,215,0,0.3)] transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-6"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Ignition <Zap className="w-5 h-5 fill-current" />
                </span>
              )}
            </button>
          </form>

          {/* Registration Link */}
          <div className="mt-8 text-center border-t border-zinc-800 pt-6">
            <p className="text-zinc-500 text-sm">
              New to the fleet?{' '}
              <Link to="/rider/register" className="text-white font-bold hover:text-[#FFD700] transition-colors inline-flex items-center gap-1 group">
                Join the Team <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </p>
          </div>
        </div>

        {/* --- Footer Trust Badge --- */}
        <div className="mt-8 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-zinc-600 text-[10px] uppercase tracking-widest border border-zinc-800 px-3 py-1 rounded-full">
                <ShieldCheck className="w-3 h-3 text-[#FFD700]" />
                <span>SSL Encrypted • 24/7 Monitoring</span>
            </div>
            
            <Link to="/" className="text-xs text-zinc-600 hover:text-white transition-colors">
                ← Back to Main Store
            </Link>
        </div>

      </div>
    </div>
  );
};

export default RiderLogin;