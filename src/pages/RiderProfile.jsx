import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRiderAuth } from '../context/RiderAuthContext';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Bike,
  Car,
  Truck,
  Star,
  DollarSign,
  Package,
  Calendar,
  Edit2,
  Loader2,
  LogOut,
  ShieldCheck,
  Zap,
  ChevronRight,
  MapPin,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

const RiderProfile = () => {
  const { rider, updateProfile, logout } = useRiderAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Mock Stats for UI visualization
  const stats = {
    level: "Gold Rider",
    xp: 75, // percentage
    todayEarnings: 1250,
    totalTrips: rider?.totalDeliveries || 142,
    rating: rider?.rating || 4.9,
    acceptanceRate: "94%"
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleType: 'bike',
    vehicleNumber: '',
    city: 'Colombo'
  });

  useEffect(() => {
    if (rider) {
      setFormData({
        name: rider.name || '',
        email: rider.email || '',
        phone: rider.phone || '',
        vehicleType: rider.vehicleType || 'bike',
        vehicleNumber: rider.vehicleNumber || '',
        city: rider.city || 'Colombo'
      });
    }
  }, [rider]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setIsEditing(false);
        toast.success('Profile Updated', {
          icon: '🛠️',
          style: { background: '#333', color: '#FFD700' }
        });
      }
    } catch (error) {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  const getVehicleIcon = (type) => {
    switch(type) {
      case 'car': return <Car className="w-5 h-5" />;
      case 'van': return <Truck className="w-5 h-5" />;
      default: return <Bike className="w-5 h-5" />;
    }
  };

  if (!rider) return <div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="w-8 h-8 text-[#FFD700] animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans pb-6">
      
      {/* --- Top Navigation --- */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-zinc-900 px-4 py-4">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <button onClick={() => navigate('/rider/dashboard')} className="p-2 -ml-2 rounded-full hover:bg-zinc-900 transition-colors group">
            <ArrowLeft className="w-6 h-6 text-zinc-400 group-hover:text-[#FFD700]" />
          </button>
          <span className="font-bold text-lg tracking-wide uppercase">Profile</span>
          <button onClick={() => { logout(); navigate('/rider/login'); }} className="p-2 rounded-full hover:bg-red-900/20 group">
            <LogOut className="w-5 h-5 text-zinc-500 group-hover:text-red-500 transition-colors" />
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-6 space-y-6">

        {/* --- 1. Identity Card --- */}
        <div className="relative bg-zinc-900 rounded-2xl p-6 border border-zinc-800 overflow-hidden group">
            {/* Background Gradient */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700]/10 blur-[60px] rounded-full"></div>
            
            <div className="relative z-10 flex flex-col items-center">
                {/* Avatar with Level Ring */}
                <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-[#FFD700] to-orange-600">
                        <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center border-4 border-black">
                            <User className="w-10 h-10 text-zinc-400" />
                        </div>
                    </div>
                    <div className="absolute bottom-0 right-0 bg-[#FFD700] text-black text-[10px] font-bold px-2 py-0.5 rounded-full border-4 border-zinc-900 shadow-lg flex items-center gap-1">
                        <Star className="w-3 h-3 fill-black" /> {stats.rating}
                    </div>
                </div>

                <h2 className="text-2xl font-black text-white tracking-tight">{formData.name}</h2>
                <p className="text-[#FFD700] font-medium text-sm flex items-center gap-1 mt-1">
                    <Zap className="w-3 h-3 fill-current" /> {stats.level}
                </p>

                {/* Level Progress Bar */}
                <div className="w-full max-w-[200px] h-1.5 bg-zinc-800 rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-[#FFD700] rounded-full" style={{ width: `${stats.xp}%` }}></div>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">{stats.xp}/100 XP to Platinum</p>
            </div>
        </div>

        {/* --- 2. Performance Stats (Grid) --- */}
        <div className="grid grid-cols-2 gap-3">
            {/* Earnings */}
            <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex flex-col justify-between h-28 relative overflow-hidden">
                <div className="absolute right-[-10px] top-[-10px] w-16 h-16 bg-green-500/10 rounded-full blur-xl"></div>
                <div className="flex justify-between items-start">
                    <div className="p-2 bg-green-900/20 rounded-lg">
                        <DollarSign className="w-5 h-5 text-green-400" />
                    </div>
                    <span className="text-xs text-green-500 font-bold">+12%</span>
                </div>
                <div>
                    <span className="text-2xl font-black text-white block">Rs {stats.todayEarnings}</span>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Today's Earnings</span>
                </div>
            </div>

            {/* Trips */}
            <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex flex-col justify-between h-28">
                <div className="flex justify-between items-start">
                    <div className="p-2 bg-[#FFD700]/10 rounded-lg">
                        <Package className="w-5 h-5 text-[#FFD700]" />
                    </div>
                    <span className="text-xs text-zinc-500 font-mono">#{rider?.riderId}</span>
                </div>
                <div>
                    <span className="text-2xl font-black text-white block">{stats.totalTrips}</span>
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Lifetime Deliveries</span>
                </div>
            </div>
        </div>

        {/* --- 3. Profile Form --- */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/80">
                <h3 className="font-bold text-zinc-100 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#FFD700]" /> 
                    Rider Details
                </h3>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="text-xs font-bold text-[#FFD700] hover:text-white transition-colors">
                        EDIT
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Phone */}
                <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Mobile Contact</label>
                    <div className={`flex items-center gap-3 p-3 rounded-lg border ${isEditing ? 'bg-black border-zinc-700 focus-within:border-[#FFD700]' : 'bg-transparent border-transparent px-0'}`}>
                        <Phone className="w-5 h-5 text-zinc-600" />
                        <input 
                            type="tel" name="phone"
                            disabled={!isEditing} value={formData.phone} onChange={handleChange}
                            className="bg-transparent w-full outline-none text-zinc-200 placeholder-zinc-700 font-medium"
                        />
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Email Address</label>
                    <div className={`flex items-center gap-3 p-3 rounded-lg border ${isEditing ? 'bg-black border-zinc-700 focus-within:border-[#FFD700]' : 'bg-transparent border-transparent px-0'}`}>
                        <Mail className="w-5 h-5 text-zinc-600" />
                        <input 
                            type="email" name="email"
                            disabled={!isEditing} value={formData.email} onChange={handleChange}
                            className="bg-transparent w-full outline-none text-zinc-200 placeholder-zinc-700 font-medium"
                        />
                    </div>
                </div>

                {/* Vehicle Info Box */}
                <div className="bg-black/40 rounded-xl p-4 border border-zinc-800/50 mt-2">
                    <label className="text-[10px] uppercase font-bold text-[#FFD700] tracking-wider mb-3 block">Vehicle & Zone</label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="text-[10px] text-zinc-500 block mb-1">Type</label>
                             <div className="relative">
                                {isEditing ? (
                                    <select 
                                        name="vehicleType" value={formData.vehicleType} onChange={handleChange}
                                        className="w-full bg-zinc-900 text-white text-sm p-2 rounded border border-zinc-700 outline-none focus:border-[#FFD700]"
                                    >
                                        <option value="bike">Motorbike</option>
                                        <option value="scooter">Scooter</option>
                                        <option value="car">Car</option>
                                    </select>
                                ) : (
                                    <div className="flex items-center gap-2 text-sm font-bold text-white capitalize">
                                        {getVehicleIcon(formData.vehicleType)} {formData.vehicleType}
                                    </div>
                                )}
                             </div>
                        </div>
                        <div>
                             <label className="text-[10px] text-zinc-500 block mb-1">Plate Number</label>
                             <input 
                                type="text" name="vehicleNumber"
                                disabled={!isEditing} value={formData.vehicleNumber} onChange={handleChange}
                                className={`w-full bg-transparent outline-none text-sm font-mono ${isEditing ? 'border-b border-zinc-700 pb-1' : 'text-zinc-300'}`}
                                placeholder="WP ABC-1234"
                             />
                        </div>
                    </div>
                </div>

                {/* Edit Actions */}
                {isEditing && (
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-3 bg-zinc-800 text-zinc-400 font-bold rounded-xl text-sm hover:bg-zinc-700 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="flex-1 py-3 bg-[#FFD700] text-black font-bold rounded-xl text-sm hover:bg-[#E6C200] transition-colors flex justify-center items-center shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                        </button>
                    </div>
                )}
            </form>
        </div>

        {/* --- 4. Menu Links --- */}
        <div className="space-y-2 pb-6">
            {[
                { label: 'Delivery History', icon: Calendar },
                { label: 'Compliance Documents', icon: FileText },
            ].map((item, idx) => (
                <button key={idx} className="w-full flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-[#FFD700] transition-all group">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-black rounded-lg text-zinc-500 group-hover:text-[#FFD700] transition-colors">
                            <item.icon className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-zinc-300 group-hover:text-white">{item.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-[#FFD700]" />
                </button>
            ))}
        </div>

      </main>
    </div>
  );
};

export default RiderProfile;