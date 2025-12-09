import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Shield,
  Star,
  DollarSign,
  Package,
  Users,
  TrendingUp,
  Edit2,
  Loader2,
  LogOut,
  Crown,
  Zap,
  ChevronRight,
  FileText,
  Settings,
  BarChart3,
  Lock,
  Activity
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AdminProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock Stats for UI visualization - in real app, fetch from API
  const stats = {
    level: "Super Admin",
    xp: 95, // percentage
    productsManaged: 1247,
    ordersProcessed: 5689,
    activeUsers: 3421,
    revenueGenerated: 1250000,
    efficiency: "98.5%"
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate API call
      // const response = await api.put('/auth/profile', formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsEditing(false);
      toast.success('Admin Profile Updated', {
        icon: '🛡️',
        style: { background: '#333', color: '#FFD700' }
      });
      
    } catch (error) {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-[#FFD700] animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans pb-6 selection:bg-[#FFD700] selection:text-black">

      {/* --- Top Navigation --- */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-zinc-900 px-4 py-4">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <button onClick={() => navigate('/admin/dashboard')} className="p-2 -ml-2 rounded-full hover:bg-zinc-900 transition-colors group">
            <ArrowLeft className="w-6 h-6 text-zinc-400 group-hover:text-[#FFD700]" />
          </button>
          <span className="font-bold text-lg tracking-wide uppercase flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#FFD700]" /> Admin Portal
          </span>
          <button onClick={() => { logout(); navigate('/login'); }} className="p-2 rounded-full hover:bg-red-900/20 group">
            <LogOut className="w-5 h-5 text-zinc-500 group-hover:text-red-500 transition-colors" />
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-6 space-y-6">

        {/* --- 1. Identity Card --- */}
        <div className="relative bg-zinc-900 rounded-2xl p-6 border border-zinc-800 overflow-hidden group hover:border-[#FFD700]/30 transition-colors duration-500">
            {/* Background Gradient */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-600/30 to-[#FFD700]/20 blur-[60px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Avatar with Admin Crown */}
                <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-purple-600 via-[#FFD700] to-purple-600">
                        <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center border-4 border-black">
                            <Crown className="w-10 h-10 text-[#FFD700]" />
                        </div>
                    </div>
                    <div className="absolute bottom-0 right-0 bg-[#FFD700] text-black text-[10px] font-bold px-2 py-0.5 rounded-full border-4 border-zinc-900 shadow-lg flex items-center gap-1">
                        <Star className="w-3 h-3 fill-black" /> 99+
                    </div>
                </div>

                <h2 className="text-2xl font-black text-white tracking-tight">{formData.name}</h2>
                <p className="text-[#FFD700] font-bold text-xs uppercase tracking-widest flex items-center gap-1 mt-1">
                    <Lock className="w-3 h-3" /> System Administrator
                </p>

                {/* Level Progress Bar */}
                <div className="w-full max-w-[200px] h-1.5 bg-zinc-800 rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-[#FFD700] rounded-full shadow-[0_0_10px_#FFD700]" style={{ width: `${stats.xp}%` }}></div>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">{stats.xp}/100 XP to Master</p>
            </div>
        </div>

        {/* --- 2. KPI Stats (Grid) --- */}
        <div className="grid grid-cols-2 gap-3">
            {/* Products Managed */}
            <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex flex-col justify-between h-28 relative overflow-hidden group hover:border-zinc-700 transition-colors">
                <div className="absolute right-[-10px] top-[-10px] w-16 h-16 bg-purple-500/10 rounded-full blur-xl"></div>
                <div className="flex justify-between items-start">
                    <div className="p-2 bg-purple-900/20 rounded-lg text-purple-400">
                        <Package className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-purple-500 font-bold bg-purple-500/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                         <TrendingUp className="w-3 h-3" /> 15%
                    </span>
                </div>
                <div>
                    <span className="text-2xl font-black text-white block tracking-tight">{stats.productsManaged.toLocaleString()}</span>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Inventory</span>
                </div>
            </div>

            {/* Orders Processed */}
            <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex flex-col justify-between h-28 hover:border-zinc-700 transition-colors">
                <div className="flex justify-between items-start">
                    <div className="p-2 bg-[#FFD700]/10 rounded-lg text-[#FFD700]">
                        <Activity className="w-5 h-5" />
                    </div>
                    <span className="text-xs text-zinc-500 font-mono opacity-50">YTD</span>
                </div>
                <div>
                    <span className="text-2xl font-black text-white block tracking-tight">{stats.ordersProcessed.toLocaleString()}</span>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Orders</span>
                </div>
            </div>

             {/* Revenue Generated */}
             <div className="col-span-2 bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex flex-col justify-between hover:border-zinc-700 transition-colors relative overflow-hidden">
                 <div className="absolute right-0 bottom-0 w-32 h-full bg-gradient-to-l from-[#FFD700]/5 to-transparent pointer-events-none"></div>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-green-900/20 rounded-lg text-green-400">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Total Revenue</span>
                    </div>
                    <span className="text-xs text-green-500 font-bold bg-green-500/10 px-2 py-0.5 rounded-full">+22.4%</span>
                </div>
                <div className="mt-2">
                    <span className="text-3xl font-black text-white block tracking-tighter">Rs {(stats.revenueGenerated / 1000000).toFixed(2)} Million</span>
                </div>
            </div>
        </div>

        {/* --- 3. Profile Form --- */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-black/40">
                <h3 className="font-bold text-zinc-100 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <Settings className="w-4 h-4 text-[#FFD700]" />
                    Admin Settings
                </h3>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="text-[10px] font-bold bg-[#FFD700] text-black px-3 py-1 rounded hover:bg-white transition-colors">
                        EDIT
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Phone */}
                <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Secure Line</label>
                    <div className={`flex items-center gap-3 p-3 rounded-lg border ${isEditing ? 'bg-black border-zinc-700 focus-within:border-[#FFD700]' : 'bg-transparent border-transparent px-0'}`}>
                        <Phone className="w-4 h-4 text-zinc-500" />
                        <input
                            type="tel" name="phone"
                            disabled={!isEditing} value={formData.phone} onChange={handleChange}
                            className="bg-transparent w-full outline-none text-zinc-200 placeholder-zinc-700 font-medium text-sm"
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Admin Email</label>
                    <div className={`flex items-center gap-3 p-3 rounded-lg border ${isEditing ? 'bg-black border-zinc-700 focus-within:border-[#FFD700]' : 'bg-transparent border-transparent px-0'}`}>
                        <Mail className="w-4 h-4 text-zinc-500" />
                        <input
                            type="email" name="email"
                            disabled={!isEditing} value={formData.email} onChange={handleChange}
                            className="bg-transparent w-full outline-none text-zinc-200 placeholder-zinc-700 font-medium text-sm"
                        />
                    </div>
                </div>

                {/* Status Box */}
                <div className="bg-black rounded-xl p-4 border border-zinc-800/50 mt-2 flex justify-between items-center">
                    <div>
                        <span className="text-[10px] uppercase font-bold text-zinc-500 block">System Efficiency</span>
                        <span className="text-lg font-bold text-green-400">{stats.efficiency}</span>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-zinc-500 block">Join Date</span>
                        <span className="text-sm font-bold text-white">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                </div>

                {/* Edit Actions */}
                {isEditing && (
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-3 bg-zinc-800 text-zinc-400 font-bold rounded-xl text-sm hover:bg-zinc-700 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="flex-1 py-3 bg-[#FFD700] text-black font-bold rounded-xl text-sm hover:bg-[#E6C200] transition-colors flex justify-center items-center shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                        </button>
                    </div>
                )}
            </form>
        </div>

        {/* --- 4. Admin Permissions (Read Only) --- */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-bold text-zinc-100 flex items-center gap-2 mb-4 text-sm uppercase">
                <Lock className="w-4 h-4 text-[#FFD700]" />
                Access Control
            </h3>

            <div className="grid grid-cols-1 gap-2">
                {[
                    { label: 'Products & Inventory', icon: Package, color: 'text-blue-400' },
                    { label: 'Financial Data', icon: BarChart3, color: 'text-green-400' },
                    { label: 'User Management', icon: Users, color: 'text-purple-400' },
                    { label: 'System Configuration', icon: Settings, color: 'text-red-400' },
                ].map((permission, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-black/40 border border-zinc-800/50 rounded-xl hover:bg-black transition-colors group">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-500 group-hover:text-white transition-colors">
                                <permission.icon className={`w-3.5 h-3.5 ${permission.color}`} />
                            </div>
                            <span className="font-medium text-sm text-zinc-300 group-hover:text-white">{permission.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-zinc-600 uppercase">Active</span>
                            <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </main>
    </div>
  );
};

export default AdminProfile;