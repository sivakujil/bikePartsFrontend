// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import {
//   ArrowLeft,
//   User,
//   Phone,
//   Mail,
//   MapPin,
//   Package,
//   Clock,
//   CheckCircle,
//   CreditCard,
//   LogOut,
//   Edit2,
//   Save,
//   Loader2,
//   ChevronRight,
//   ShoppingBag,
//   Star,
//   Zap,
//   Box
// } from 'lucide-react';
// import toast from 'react-hot-toast';
// import api from '../services/api';

// const UserProfile = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const [activeTab, setActiveTab] = useState('overview'); // overview, orders, settings
//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(false);
  
//   // Theme Constants
//   const THEME = {
//     yellow: '#FFD700',
//     yellowHover: '#E6C200',
//     black: '#09090b',
//     darkGray: '#18181b',
//     border: '#27272a'
//   };

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//     city: '',
//     zip: ''
//   });

//   // Mock Data for "Best" Experience
//   const mockOrders = [
//     { id: '#ORD-7782', date: 'Oct 24, 2023', total: 'Rs 12,500', status: 'Delivered', items: 3 },
//     { id: '#ORD-7781', date: 'Oct 10, 2023', total: 'Rs 4,200', status: 'Processing', items: 1 },
//     { id: '#ORD-7780', date: 'Sep 28, 2023', total: 'Rs 8,900', status: 'Cancelled', items: 2 },
//   ];

//   useEffect(() => {
//     if (user) {
//       setFormData({
//         name: user.name || '',
//         email: user.email || '',
//         phone: user.phone || '',
//         address: user.address || '',
//         city: user.city || '',
//         zip: user.zip || ''
//       });
//     }
//   }, [user]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       // Simulate API call
//       // const response = await api.put('/auth/profile', formData); 
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       toast.success('Profile updated successfully', {
//         icon: '✨',
//         style: { background: '#333', color: THEME.yellow }
//       });
//       setIsEditing(false);
//     } catch (error) {
//       toast.error('Failed to update profile');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!user) return (
//     <div className="min-h-screen bg-black flex items-center justify-center">
//       <Loader2 className="w-10 h-10 text-[#FFD700] animate-spin" />
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-black text-zinc-100 font-sans pb-12 selection:bg-[#FFD700] selection:text-black">
      
//       {/* 1. Navbar / Header */}
//       <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-zinc-900 px-6 py-4">
//         <div className="max-w-6xl mx-auto flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button 
//               onClick={() => navigate('/')}
//               className="group p-2 -ml-2 rounded-full hover:bg-zinc-900 transition-colors"
//             >
//               <ArrowLeft className="w-5 h-5 text-zinc-400 group-hover:text-[#FFD700]" />
//             </button>
//             <h1 className="text-xl font-bold tracking-tight uppercase">My Account</h1>
//           </div>
          
//           <button 
//             onClick={() => { logout(); navigate('/login'); }}
//             className="flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-red-500 transition-colors"
//           >
//             <LogOut className="w-4 h-4" />
//             <span className="hidden sm:inline">Sign Out</span>
//           </button>
//         </div>
//       </header>

//       <div className="max-w-6xl mx-auto px-6 py-8">
        
//         {/* 2. Hero Profile Card */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//             {/* User Info */}
//             <div className="col-span-1 md:col-span-2 relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 overflow-hidden">
//                 {/* Yellow Glow Effect */}
//                 <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-[80px] -mr-10 -mt-10 pointer-events-none"></div>

//                 <div className="relative flex items-center gap-6">
//                     <div className="relative">
//                         <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center border-2 border-zinc-800 shadow-xl">
//                             <span className="text-2xl font-bold text-[#FFD700]">{user.name?.charAt(0)}</span>
//                         </div>
//                         <div className="absolute -bottom-2 -right-2 bg-[#FFD700] text-black text-[10px] font-bold px-2 py-0.5 rounded-full border-4 border-zinc-900">
//                             PRO
//                         </div>
//                     </div>
//                     <div>
//                         <h2 className="text-2xl font-bold text-white">{user.name}</h2>
//                         <p className="text-zinc-400 text-sm">{user.email}</p>
//                         <div className="mt-3 flex items-center gap-3">
//                             <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20">
//                                 <Zap className="w-3 h-3 fill-current" /> Gold Member
//                             </span>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Wallet / Points */}
//             <div className="bg-gradient-to-br from-[#FFD700] to-yellow-600 rounded-2xl p-6 text-black flex flex-col justify-between relative overflow-hidden shadow-lg shadow-yellow-900/20">
//                 <div className="absolute right-0 top-0 w-32 h-32 bg-white/20 blur-3xl rounded-full -mr-10 -mt-10"></div>
                
//                 <div className="flex justify-between items-start z-10">
//                     <div className="p-2 bg-black/10 rounded-lg backdrop-blur-sm">
//                         <CreditCard className="w-6 h-6 text-black" />
//                     </div>
//                     <span className="font-bold text-xs bg-black/20 px-2 py-1 rounded text-black/80">WALLET</span>
//                 </div>
                
//                 <div className="z-10">
//                     <p className="text-sm font-semibold opacity-80 mb-1">Available Balance</p>
//                     <h3 className="text-3xl font-black tracking-tight">Rs 12,450.00</h3>
//                 </div>
//             </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
//             {/* 3. Sidebar Navigation */}
//             <nav className="lg:col-span-1 space-y-2">
//                 {[
//                     { id: 'overview', label: 'Profile Overview', icon: User },
//                     { id: 'orders', label: 'My Orders', icon: Package },
//                     { id: 'settings', label: 'Addresses', icon: MapPin },
//                 ].map((item) => (
//                     <button
//                         key={item.id}
//                         onClick={() => setActiveTab(item.id)}
//                         className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${
//                             activeTab === item.id
//                             ? 'bg-[#FFD700] text-black shadow-[0_0_20px_rgba(255,215,0,0.2)]'
//                             : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
//                         }`}
//                     >
//                         <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-black' : ''}`} />
//                         {item.label}
//                         {activeTab === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
//                     </button>
//                 ))}
//             </nav>

//             {/* 4. Main Content Area */}
//             <div className="lg:col-span-3">
//                 <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 min-h-[500px] relative">
                    
//                     {/* --- TAB: OVERVIEW (Form) --- */}
//                     {activeTab === 'overview' && (
//                         <>
//                             <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800">
//                                 <div>
//                                     <h2 className="text-lg font-bold text-white">Personal Information</h2>
//                                     <p className="text-sm text-zinc-500">Manage your identity and contact info</p>
//                                 </div>
//                                 {!isEditing && (
//                                     <button 
//                                         onClick={() => setIsEditing(true)}
//                                         className="flex items-center gap-2 px-4 py-2 bg-black border border-zinc-800 hover:border-[#FFD700] text-[#FFD700] rounded-lg text-xs font-bold transition-all"
//                                     >
//                                         <Edit2 className="w-3 h-3" /> EDIT
//                                     </button>
//                                 )}
//                             </div>

//                             <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     <div className="space-y-1.5">
//                                         <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Full Name</label>
//                                         <div className="relative group">
//                                             <User className="absolute left-3 top-3 w-4 h-4 text-zinc-600 group-focus-within:text-[#FFD700] transition-colors" />
//                                             <input type="text" name="name" disabled={!isEditing} value={formData.name} onChange={handleChange}
//                                                 className="w-full bg-black border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#FFD700] disabled:opacity-50 transition-all" />
//                                         </div>
//                                     </div>

//                                     <div className="space-y-1.5">
//                                         <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Phone Number</label>
//                                         <div className="relative group">
//                                             <Phone className="absolute left-3 top-3 w-4 h-4 text-zinc-600 group-focus-within:text-[#FFD700] transition-colors" />
//                                             <input type="tel" name="phone" disabled={!isEditing} value={formData.phone} onChange={handleChange}
//                                                 className="w-full bg-black border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#FFD700] disabled:opacity-50 transition-all" />
//                                         </div>
//                                     </div>

//                                     <div className="space-y-1.5 md:col-span-2">
//                                         <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Email Address</label>
//                                         <div className="relative group">
//                                             <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-600 group-focus-within:text-[#FFD700] transition-colors" />
//                                             <input type="email" name="email" disabled={!isEditing} value={formData.email} onChange={handleChange}
//                                                 className="w-full bg-black border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#FFD700] disabled:opacity-50 transition-all" />
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {isEditing && (
//                                     <div className="flex gap-4 pt-4 border-t border-zinc-800 mt-6">
//                                         <button type="button" onClick={() => setIsEditing(false)}
//                                             className="px-6 py-2.5 rounded-lg bg-zinc-800 text-zinc-400 font-bold text-sm hover:bg-zinc-700 transition-colors">
//                                             Cancel
//                                         </button>
//                                         <button type="submit" disabled={loading}
//                                             className="px-8 py-2.5 rounded-lg bg-[#FFD700] text-black font-bold text-sm hover:bg-[#E6C200] transition-colors flex items-center gap-2 shadow-lg shadow-[#FFD700]/20">
//                                             {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
//                                             Save Changes
//                                         </button>
//                                     </div>
//                                 )}
//                             </form>
//                         </>
//                     )}

//                     {/* --- TAB: ORDERS --- */}
//                     {activeTab === 'orders' && (
//                         <>
//                             <h2 className="text-lg font-bold text-white mb-6">Recent Orders</h2>
//                             <div className="space-y-4">
//                                 {mockOrders.map((order) => (
//                                     <div key={order.id} className="group bg-black border border-zinc-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between hover:border-[#FFD700]/50 transition-all cursor-pointer">
//                                         <div className="flex items-center gap-4 mb-3 md:mb-0">
//                                             <div className="p-3 bg-zinc-900 rounded-lg group-hover:bg-[#FFD700] group-hover:text-black transition-colors">
//                                                 <ShoppingBag className="w-6 h-6" />
//                                             </div>
//                                             <div>
//                                                 <h4 className="font-bold text-white">{order.id}</h4>
//                                                 <p className="text-xs text-zinc-500">{order.items} Items • {order.date}</p>
//                                             </div>
//                                         </div>
                                        
//                                         <div className="flex items-center gap-6 w-full md:w-auto justify-between">
//                                             <div className="text-right">
//                                                 <span className="block font-bold text-white">{order.total}</span>
//                                             </div>
//                                             <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
//                                                 order.status === 'Delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
//                                                 order.status === 'Processing' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
//                                                 'bg-red-500/10 text-red-500 border-red-500/20'
//                                             }`}>
//                                                 {order.status}
//                                             </div>
//                                             <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-[#FFD700]" />
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </>
//                     )}

//                     {/* --- TAB: SETTINGS (Address) --- */}
//                     {activeTab === 'settings' && (
//                         <>
//                             <div className="flex justify-between items-center mb-6">
//                                 <h2 className="text-lg font-bold text-white">Saved Addresses</h2>
//                                 <button className="text-xs font-bold text-[#FFD700] hover:underline">+ ADD NEW</button>
//                             </div>
                            
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <div className="p-4 bg-black border border-[#FFD700] rounded-xl relative">
//                                     <div className="absolute top-4 right-4 text-[#FFD700]">
//                                         <CheckCircle className="w-5 h-5 fill-[#FFD700]/20" />
//                                     </div>
//                                     <div className="flex items-center gap-2 mb-3">
//                                         <div className="p-1.5 bg-[#FFD700] rounded text-black">
//                                             <MapPin className="w-3 h-3" />
//                                         </div>
//                                         <span className="text-xs font-bold uppercase text-[#FFD700]">Default</span>
//                                     </div>
//                                     <p className="text-white font-bold text-sm mb-1">{user.name}</p>
//                                     <p className="text-zinc-400 text-xs leading-relaxed">
//                                         {formData.address || "123 Main Street, Industrial Zone"}<br />
//                                         Colombo 03, 100300<br />
//                                         (+94) 77 123 4567
//                                     </p>
//                                     <div className="mt-4 pt-3 border-t border-zinc-900 flex gap-4">
//                                         <button className="text-xs font-bold text-zinc-500 hover:text-white">EDIT</button>
//                                         <button className="text-xs font-bold text-zinc-500 hover:text-red-500">DELETE</button>
//                                     </div>
//                                 </div>

//                                 <div className="p-4 bg-black border border-zinc-800 border-dashed rounded-xl flex flex-col items-center justify-center text-zinc-600 hover:border-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer min-h-[160px]">
//                                     <MapPin className="w-8 h-8 mb-2 opacity-50" />
//                                     <span className="text-xs font-bold uppercase">Add New Address</span>
//                                 </div>
//                             </div>
//                         </>
//                     )}

//                 </div>
//             </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserProfile;





import React, { useState } from 'react';
import {
  Box, Container, Grid, Typography, Button, Paper, Avatar,
  List, ListItemButton, ListItemIcon, ListItemText, Divider,
  Chip, IconButton, Card, CardContent
} from '@mui/material';
import {
  Person as PersonIcon,
  ShoppingBag as OrderIcon,
  LocationOn as AddressIcon,
  AccountBalanceWallet as WalletIcon,
  Logout as LogoutIcon,
  Edit as EditIcon,
  Star as StarIcon,
  ChevronRight as ArrowIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material';

// -(Theme Settings) ---
const THEME = {
  bg: '#121212',           
  card: '#1E1E1E',         
  yellow: '#FFC107',       
  yellowDark: '#FFB300',
  text: '#FFFFFF',         
  textGray: '#B0B0B0',     
  border: '#333333',
  danger: '#FF5252'
};

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // (Dummy Data based on your screenshot)
  const user = {
    name: "Virat",
    email: "virat@gmail.com",
    phone: "+94 77 123 4567",
    membership: "Gold Member",
    balance: "Rs 12,450.00",
    avatar: "https://www.freepik.com/free-photos-vectors/avatar" 
  };

  // --- Components ---

  // (Sidebar Menu)
  const SidebarItem = ({ icon, label, value }) => (
    <ListItemButton
      selected={activeTab === value}
      onClick={() => setActiveTab(value)}
      sx={{
        borderRadius: 2,
        mb: 1,
        '&.Mui-selected': {
          bgcolor: THEME.yellow,
          color: '#000',
          '& .MuiListItemIcon-root': { color: '#000' },
          '&:hover': { bgcolor: THEME.yellowDark }
        },
        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' },
        color: THEME.textGray
      }}
    >
      <ListItemIcon sx={{ color: activeTab === value ? '#000' : THEME.yellow, minWidth: 40 }}>
        {icon}
      </ListItemIcon>
      <ListItemText primary={label} primaryTypographyProps={{ fontWeight: 'bold' }} />
      {activeTab === value && <ArrowIcon fontSize="small" />}
    </ListItemButton>
  );

  // 2. (Wallet Section)
  const WalletCard = () => (
    <Card sx={{ 
      background: `linear-gradient(135deg, ${THEME.yellow} 0%, #FF6F00 100%)`, 
      borderRadius: 4, 
      mb: 4,
      color: '#000',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Decor */}
      <Box sx={{ position: 'absolute', right: -20, top: -20, opacity: 0.2 }}>
        <WalletIcon sx={{ fontSize: 150 }} />
      </Box>

      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <WalletIcon sx={{ fontSize: 20 }} />
          <Typography variant="subtitle2" fontWeight="bold" sx={{ opacity: 0.8 }}>WALLET BALANCE</Typography>
        </Box>
        <Typography variant="h3" fontWeight="900">
          {user.balance}
        </Typography>
        <Typography variant="body2" fontWeight="500" sx={{ mt: 1, opacity: 0.8 }}>
          Available for instant checkout
        </Typography>
      </CardContent>
    </Card>
  );

  // 3.(Personal Info Section)
  const ProfileOverview = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ color: THEME.text, fontWeight: 'bold' }}>
          Personal Information
        </Typography>
        <Button 
          startIcon={<EditIcon />} 
          variant="outlined"
          sx={{ color: THEME.yellow, borderColor: THEME.border, borderRadius: 2 }}
        >
          Edit
        </Button>
      </Box>

      <Grid container spacing={3}>
        {[
          { label: "Full Name", value: user.name, icon: <PersonIcon /> },
          { label: "Email Address", value: user.email, icon: <EmailIcon /> },
          { label: "Phone Number", value: user.phone, icon: <PhoneIcon /> },
          { label: "Member Status", value: user.membership, icon: <StarIcon />, isHighlight: true }
        ].map((item, idx) => (
          <Grid item xs={12} md={6} key={idx}>
            <Paper sx={{ 
              p: 2, 
              bgcolor: '#252525', 
              borderRadius: 3,
              border: '1px solid #333',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <Box sx={{ 
                width: 45, height: 45, borderRadius: '50%', 
                bgcolor: 'rgba(255, 193, 7, 0.1)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: THEME.yellow
              }}>
                {item.icon}
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: THEME.textGray }}>{item.label}</Typography>
                <Typography variant="body1" sx={{ 
                  color: item.isHighlight ? THEME.yellow : THEME.text, 
                  fontWeight: 'bold' 
                }}>
                  {item.value}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: THEME.bg, py: 4 }}>
      <Container maxWidth="lg">
        
        {/* TOP HEADER */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar 
              sx={{ 
                width: 80, height: 80, 
                bgcolor: THEME.yellow, 
                color: '#000', 
                fontSize: '2rem',
                fontWeight: 'bold',
                border: '4px solid #333'
              }}
            >
              {user.name.charAt(0)}
            </Avatar>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h4" sx={{ color: THEME.text, fontWeight: 'bold' }}>
                  {user.name}
                </Typography>
                <Chip 
                  icon={<StarIcon style={{color: '#000', fontSize: 16}} />} 
                  label="PRO" 
                  size="small"
                  sx={{ bgcolor: THEME.yellow, color: '#000', fontWeight: 'bold', borderRadius: 1 }} 
                />
              </Box>
              <Typography sx={{ color: THEME.textGray }}>{user.email}</Typography>
            </Box>
          </Box>

          <Button 
            variant="outlined" 
            startIcon={<LogoutIcon />}
            sx={{ 
              color: THEME.danger, 
              borderColor: 'rgba(255, 82, 82, 0.3)',
              '&:hover': { borderColor: THEME.danger, bgcolor: 'rgba(255, 82, 82, 0.1)' }
            }}
          >
            Sign Out
          </Button>
        </Box>

        <Divider sx={{ borderColor: '#333', mb: 4 }} />

        {/* MAIN LAYOUT */}
        <Grid container spacing={4}>
          
          {/* LEFT SIDEBAR */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ bgcolor: THEME.card, p: 2, borderRadius: 3, border: `1px solid ${THEME.border}` }}>
              <List disablePadding>
                <SidebarItem icon={<PersonIcon />} label="Profile Overview" value="overview" />
                <SidebarItem icon={<OrderIcon />} label="My Orders" value="orders" />
                <SidebarItem icon={<AddressIcon />} label="Addresses" value="address" />
                <SidebarItem icon={<WalletIcon />} label="Wallet" value="wallet" />
              </List>
            </Paper>
          </Grid>

          {/* RIGHT CONTENT AREA */}
          <Grid item xs={12} md={9}>
            {/* Wallet shows on top if active or in overview */}
            {(activeTab === 'overview' || activeTab === 'wallet') && <WalletCard />}

            <Paper sx={{ 
              p: 4, 
              bgcolor: THEME.card, 
              borderRadius: 4, 
              border: `1px solid ${THEME.border}`,
              minHeight: 400
            }}>
              {activeTab === 'overview' && <ProfileOverview />}
              
              {activeTab === 'orders' && (
                <Box sx={{ textAlign: 'center', py: 5 }}>
                  <OrderIcon sx={{ fontSize: 60, color: '#333', mb: 2 }} />
                  <Typography sx={{ color: THEME.textGray }}>No recent orders found</Typography>
                  <Button sx={{ mt: 2, color: THEME.yellow }}>Start Shopping</Button>
                </Box>
              )}

              {activeTab === 'address' && (
                 <Box sx={{ textAlign: 'center', py: 5 }}>
                 <AddressIcon sx={{ fontSize: 60, color: '#333', mb: 2 }} />
                 <Typography sx={{ color: THEME.textGray }}>No addresses saved</Typography>
                 <Button variant="contained" sx={{ mt: 2, bgcolor: THEME.yellow, color: '#000' }}>Add New Address</Button>
               </Box>
              )}
            </Paper>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
};

export default ProfilePage;