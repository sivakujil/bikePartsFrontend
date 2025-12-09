import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, Card, Container, Button, Avatar,
  IconButton, Chip, Skeleton, Fab, Badge, Drawer,
  useTheme, useMediaQuery, LinearProgress, Tab, Tabs,
  alpha
} from "@mui/material";
import { styled, keyframes } from '@mui/system';

// Icons
import {
  TwoWheeler, Navigation, Phone, MyLocation,
  AttachMoney, History, PowerSettingsNew,
  CheckCircle, Cancel, AccessTime, Map,
  Notifications, Menu as MenuIcon, ChevronRight, Place
} from "@mui/icons-material";

import { useAuth } from "../context/AuthContext"; // Adjust path as needed
import api from "../services/api"; // Adjust path as needed
import { format } from "date-fns";
import toast from "react-hot-toast";

// === 1. DESIGN SYSTEM & STYLED COMPONENTS ===

const THEME = {
  bg: '#000000',         // Black
  cardBg: '#1a1a1a',     // Dark gray
  primary: '#FFD700',    // Gold yellow
  success: '#FFFF00',    // Bright yellow
  warning: '#FFA500',    // Orange
  danger: '#FF4500',     // Red-orange
  text: '#FFFFFF',       // White
  muted: '#CCCCCC'       // Light gray
};

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(255, 215, 0, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0); }
`;

const PageContainer = styled(Box)({
  backgroundColor: THEME.bg,
  minHeight: '100vh',
  color: THEME.text,
  paddingBottom: '100px', // Space for bottom nav/actions
  overflowX: 'hidden'
});

const DashboardHeader = styled(Box)({
  background: 'rgba(0, 0, 0, 0.95)',
  backdropFilter: 'blur(10px)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
  borderBottom: `1px solid ${alpha(THEME.primary, 0.3)}`,
  padding: '16px',
});

const MetricCard = styled(Box)(({ color }) => ({
  background: alpha(color, 0.1),
  border: `1px solid ${alpha(color, 0.2)}`,
  borderRadius: '16px',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flex: 1,
}));

const ActionButton = styled(Button)(({ bgcolor }) => ({
  borderRadius: '12px',
  padding: '12px',
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 700,
  boxShadow: '0 4px 14px 0 rgba(0,0,0,0.3)',
  backgroundColor: bgcolor,
  color: '#fff',
  '&:hover': {
    backgroundColor: alpha(bgcolor, 0.8),
  }
}));

const StatusPill = styled(Chip)(({ status }) => {
  let color = THEME.muted;
  let bg = alpha(THEME.muted, 0.2);

  if (status === 'Assigned' || status === 'New') { color = THEME.primary; bg = alpha(THEME.primary, 0.2); }
  if (status === 'Picked Up') { color = THEME.warning; bg = alpha(THEME.warning, 0.2); }
  if (status === 'Out for Delivery') { color = "#FFD700"; bg = alpha("#FFD700", 0.2); }
  if (status === 'Delivered') { color = THEME.success; bg = alpha(THEME.success, 0.2); }

  return {
    backgroundColor: bg,
    color: color,
    fontWeight: 700,
    border: `1px solid ${alpha(color, 0.3)}`,
    borderRadius: '8px'
  };
});

const GoOnlineButton = styled(Box)(({ isonline }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  width: '100%',
  padding: '16px',
  borderRadius: '100px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: isonline === 'true' ? alpha(THEME.success, 0.15) : alpha(THEME.bg, 0.5),
  border: `2px solid ${isonline === 'true' ? THEME.success : THEME.muted}`,
  color: isonline === 'true' ? THEME.success : THEME.muted,
  animation: isonline === 'true' ? `${pulseGlow} 2s infinite` : 'none',
  fontWeight: 800,
  letterSpacing: '1px',
  textTransform: 'uppercase'
}));

export default function RiderHome() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State
  const [loading, setLoading] = useState(true);
  const [riderData, setRiderData] = useState(null);
  const [orders, setOrders] = useState({ new: [], active: [], history: [] });
  const [stats, setStats] = useState({ earnings: 0, completed: 0, hours: 0 });
  const [activeTab, setActiveTab] = useState(0); // 0: Requests, 1: Active, 2: History

  // === EFFECTS ===
  useEffect(() => {
    if (!user || user.role !== 'rider') {
      navigate('/login');
      return;
    }
    fetchDashboardData();
    
    // Poll for new orders every 10s if online
    const poller = setInterval(() => {
      if(riderData?.isOnline) fetchDashboardData(true); // silent update
    }, 10000);
    return () => clearInterval(poller);
  }, [user]);

  // === API CALLS ===
  const fetchDashboardData = async (silent = false) => {
    if(!silent) setLoading(true);
    try {
      // Mocking parallel API calls - replace with your actual endpoints
      const [profileRes, ordersRes, statsRes] = await Promise.all([
        api.get('/rider/profile'),
        api.get('/rider/orders'), // Should return { new: [], active: [], history: [] }
        api.get('/rider/stats')
      ]);

      setRiderData(profileRes.data);
      // Ensure orders structure matches UI needs
      // Assuming API returns array, we filter here for demo:
      const allOrders = ordersRes.data; 
      const newReq = allOrders.filter(o => o.status === 'Assigned' || o.status === 'Pending');
      const activeReq = allOrders.filter(o => ['Picked Up', 'Out for Delivery'].includes(o.status));
      const historyReq = allOrders.filter(o => ['Delivered', 'Cancelled'].includes(o.status));

      setOrders({ new: newReq, active: activeReq, history: historyReq });
      setStats(statsRes.data);

      // Auto-switch tabs based on priority
      if (!silent) {
        if (newReq.length > 0) setActiveTab(0);
        else if (activeReq.length > 0) setActiveTab(1);
      }

    } catch (error) {
      console.error("Dashboard Error", error);
    } finally {
      if(!silent) setLoading(false);
    }
  };

  const toggleOnlineStatus = async () => {
    try {
      const newState = !riderData.isOnline;
      await api.put('/rider/status', { isOnline: newState });
      setRiderData(prev => ({ ...prev, isOnline: newState }));
      toast.success(newState ? "You are now ONLINE" : "You are now OFFLINE");
    } catch (err) {
      toast.error("Connection failed");
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.put(`/rider/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Status updated: ${newStatus}`);
      fetchDashboardData(true);
    } catch (error) {
      toast.error("Update failed");
    }
  };

  // === RENDER HELPERS ===

  // 1. New Request Card (Accept/Decline)
  const RequestCard = ({ order }) => (
    <Box 
      sx={{ 
        bgcolor: THEME.cardBg, 
        borderRadius: '20px', 
        p: 3, mb: 2,
        border: `1px solid ${alpha(THEME.primary, 0.3)}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Box>
          <Typography variant="h6" fontWeight={800} color={THEME.text}>
            New Order #{order._id.slice(-4)}
          </Typography>
          <Box display="flex" alignItems="center" gap={1} mt={0.5}>
             <AccessTime sx={{ fontSize: 16, color: THEME.muted }} />
             <Typography variant="caption" color={THEME.muted}>
               {format(new Date(order.createdAt), "h:mm a")} • 3.5 km total
             </Typography>
          </Box>
        </Box>
        <Chip
          label="Rs 12.50" // Replace with order.earnings
          sx={{ bgcolor: THEME.success, color: '#000', fontWeight: '900', fontSize: '1rem' }}
        />
      </Box>

      {/* Route Visualization */}
      <Box sx={{ position: 'relative', pl: 2, borderLeft: `2px dashed ${alpha(THEME.muted, 0.3)}`, ml: 1, my: 3 }}>
        <Box position="relative" mb={3}>
          <Box sx={{ position: 'absolute', left: -21, top: 0, bgcolor: THEME.bg, border: `2px solid ${THEME.text}`, borderRadius: '50%', width: 12, height: 12 }} />
          <Typography variant="caption" color={THEME.muted} display="block" mb={0.5}>PICK UP</Typography>
          <Typography fontWeight={600}>{order.restaurant?.name || "Restaurant Name"}</Typography>
          <Typography variant="body2" color={THEME.muted}>{order.restaurant?.address}</Typography>
        </Box>
        <Box position="relative">
          <Box sx={{ position: 'absolute', left: -21, top: 0, bgcolor: THEME.primary, borderRadius: '50%', width: 12, height: 12 }} />
          <Typography variant="caption" color={THEME.muted} display="block" mb={0.5}>DROP OFF</Typography>
          <Typography fontWeight={600}>{order.delivery?.name}</Typography>
          <Typography variant="body2" color={THEME.muted}>{order.delivery?.address}</Typography>
        </Box>
      </Box>

      <Box display="flex" gap={2}>
        <Button 
          fullWidth 
          variant="outlined" 
          color="error"
          sx={{ borderRadius: '12px', py: 1.5 }}
          onClick={() => handleStatusUpdate(order._id, 'Rejected')}
        >
          Decline
        </Button>
        <Button 
          fullWidth 
          variant="contained" 
          sx={{ bgcolor: THEME.primary, color: '#000', fontWeight: 'bold', borderRadius: '12px', py: 1.5, '&:hover': { bgcolor: THEME.success } }}
          onClick={() => handleStatusUpdate(order._id, 'Picked Up')} // Or 'Accepted' based on your logic
        >
          Accept Order
        </Button>
      </Box>
    </Box>
  );

  // 2. Active Mission Card (The workhorse)
  const ActiveMissionCard = ({ order }) => {
    const nextStep = order.status === 'Assigned' ? 'Picked Up' 
                   : order.status === 'Picked Up' ? 'Out for Delivery' 
                   : 'Delivered';
    
    const btnColor = nextStep === 'Delivered' ? THEME.success : THEME.primary;
    const btnText = nextStep === 'Delivered' ? 'Complete Delivery' : nextStep;

    const targetAddress = order.status === 'Assigned' ? order.restaurant?.address : order.delivery?.address;
    const targetPhone = order.status === 'Assigned' ? order.restaurant?.phone : order.delivery?.phone;

    return (
      <Box sx={{ bgcolor: THEME.cardBg, borderRadius: '24px', overflow: 'hidden', mb: 3 }}>
        {/* Map Placeholder Header */}
        <Box sx={{ height: 120, bgcolor: '#000000', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Map sx={{ fontSize: 48, color: alpha(THEME.primary, 0.3) }} />
          <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', background: `linear-gradient(to top, ${THEME.cardBg}, transparent)` }} />
        </Box>

        <Container sx={{ mt: -4, position: 'relative', zIndex: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
             <StatusPill label={order.status} status={order.status} />
             <Typography variant="h6" fontWeight={700}>#{order._id.slice(-4)}</Typography>
          </Box>

          {/* Current Target Details */}
          <Typography variant="caption" color={THEME.primary} fontWeight="bold" letterSpacing={1}>
            {order.status === 'Assigned' ? 'HEAD TO RESTAURANT' : 'HEAD TO CUSTOMER'}
          </Typography>
          <Typography variant="h5" fontWeight={600} mb={1} mt={1}>
            {order.status === 'Assigned' ? order.restaurant?.name : order.delivery?.name}
          </Typography>
          <Typography variant="body1" color={THEME.muted} mb={3}>
            {targetAddress}
          </Typography>

          {/* Utility Buttons */}
          <Box display="flex" gap={2} mb={4}>
            <ActionButton 
              bgcolor="#374151" 
              fullWidth 
              onClick={() => window.open(`tel:${targetPhone}`)}
              startIcon={<Phone />}
            >
              Call
            </ActionButton>
            <ActionButton 
              bgcolor="#2563EB" 
              fullWidth 
              onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(targetAddress)}`)}
              startIcon={<Navigation />}
            >
              Navigate
            </ActionButton>
          </Box>

          {/* Slider/Big Button */}
          <Box pb={3}>
            <ActionButton 
              bgcolor={btnColor} 
              fullWidth 
              size="large"
              sx={{ py: 2, fontSize: '1.2rem', boxShadow: `0 0 20px ${alpha(btnColor, 0.4)}` }}
              onClick={() => handleStatusUpdate(order._id, nextStep)}
            >
              {btnText}
            </ActionButton>
          </Box>
        </Container>
      </Box>
    );
  };

  // === MAIN UI ===

  if (loading && !riderData) return (
    <Box height="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor={THEME.bg}>
      <TwoWheeler sx={{ fontSize: 60, color: THEME.primary, animation: `${pulseGlow} 1s infinite` }} />
    </Box>
  );

  return (
    <PageContainer>
      {/* 1. Header */}
      <DashboardHeader>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar src={riderData?.avatar} sx={{ width: 40, height: 40, border: `2px solid ${THEME.primary}` }} />
            <Box>
              <Typography variant="subtitle1" fontWeight={700} lineHeight={1.1}>
                {riderData?.name}
              </Typography>
              <Typography variant="caption" color={THEME.muted}>
                {riderData?.vehicleType}
              </Typography>
            </Box>
          </Box>
          <IconButton sx={{ color: THEME.text }}>
            <Badge badgeContent={orders.new.length} color="error">
              <Notifications />
            </Badge>
          </IconButton>
        </Box>
      </DashboardHeader>

      <Container maxWidth="sm" sx={{ pt: 3 }}>
        
        {/* 2. Status & Earnings */}
        <Box mb={4}>
          <GoOnlineButton 
            isonline={riderData?.isOnline.toString()} 
            onClick={toggleOnlineStatus}
          >
            <PowerSettingsNew />
            {riderData?.isOnline ? "You are Online" : "Go Online"}
          </GoOnlineButton>
        </Box>

        {riderData?.isOnline && (
          <Box display="flex" gap={2} mb={4}>
            <MetricCard color={THEME.success}>
              <Typography variant="caption" color={THEME.success} fontWeight={700}>EARNINGS</Typography>
              <Typography variant="h5" fontWeight={800}>Rs {stats.earnings}</Typography>
            </MetricCard>
            <MetricCard color={THEME.primary}>
               <Typography variant="caption" color={THEME.primary} fontWeight={700}>TRIPS</Typography>
               <Typography variant="h5" fontWeight={800}>{stats.completed}</Typography>
            </MetricCard>
            <MetricCard color={THEME.warning}>
               <Typography variant="caption" color={THEME.warning} fontWeight={700}>RATING</Typography>
               <Typography variant="h5" fontWeight={800}>{stats.rating || '5.0'}</Typography>
            </MetricCard>
          </Box>
        )}

        {/* 3. Custom Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: alpha(THEME.muted, 0.2), mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, v) => setActiveTab(v)}
            variant="fullWidth"
            textColor="inherit"
            TabIndicatorProps={{ sx: { bgcolor: THEME.primary, height: 3 } }}
            sx={{ '& .MuiTab-root': { color: THEME.muted, fontWeight: 600 } }}
          >
            <Tab 
              label={
                <Badge badgeContent={orders.new.length} color="primary" sx={{ '& .MuiBadge-badge': { right: -15, top: 5 } }}>
                  Requests
                </Badge>
              } 
            />
            <Tab 
               label={
                <Badge badgeContent={orders.active.length} color="warning" sx={{ '& .MuiBadge-badge': { right: -15, top: 5 } }}>
                  Active
                </Badge>
               }
            />
            <Tab label="History" />
          </Tabs>
        </Box>

        {/* 4. Tab Panels */}
        <Box minHeight="50vh">
          
          {/* REQUESTS TAB */}
          {activeTab === 0 && (
            <Box>
              {!riderData.isOnline ? (
                <Box textAlign="center" py={5}>
                  <Typography color={THEME.muted}>Go online to receive orders.</Typography>
                </Box>
              ) : orders.new.length === 0 ? (
                <Box textAlign="center" py={8} sx={{ opacity: 0.5 }}>
                  <TwoWheeler sx={{ fontSize: 60, color: THEME.muted, mb: 2 }} />
                  <Typography variant="h6">Searching for orders...</Typography>
                  <LinearProgress sx={{ mt: 2, maxWidth: 200, mx: 'auto', bgcolor: 'transparent' }} />
                </Box>
              ) : (
                orders.new.map(order => <RequestCard key={order._id} order={order} />)
              )}
            </Box>
          )}

          {/* ACTIVE TAB */}
          {activeTab === 1 && (
            <Box>
              {orders.active.length === 0 ? (
                <Box textAlign="center" py={8}>
                  <Typography color={THEME.muted}>No active deliveries.</Typography>
                </Box>
              ) : (
                orders.active.map(order => <ActiveMissionCard key={order._id} order={order} />)
              )}
            </Box>
          )}

          {/* HISTORY TAB */}
          {activeTab === 2 && (
             <Box>
               {orders.history.map(order => (
                 <Box 
                    key={order._id} 
                    display="flex" 
                    justifyContent="space-between" 
                    alignItems="center"
                    sx={{ p: 2, mb: 1, bgcolor: alpha('#fff', 0.03), borderRadius: '12px' }}
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: alpha(THEME.success, 0.2), color: THEME.success }}>
                        <CheckCircle sx={{ fontSize: 20 }} />
                      </Avatar>
                      <Box>
                        <Typography fontWeight={600}>Rs {order.deliveryFee || '8.50'}</Typography>
                        <Typography variant="caption" color={THEME.muted}>
                          {order.delivery?.address.substring(0, 20)}...
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="caption" color={THEME.muted}>
                      {format(new Date(order.updatedAt), "HH:mm")}
                    </Typography>
                 </Box>
               ))}
             </Box>
          )}

        </Box>
      </Container>
    </PageContainer>
  );
}