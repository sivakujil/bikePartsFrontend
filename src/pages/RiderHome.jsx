import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Typography, Container, Button, Avatar,
  IconButton, Chip, Tab, Tabs, Badge,
  useTheme, CircularProgress, LinearProgress, Paper
} from "@mui/material";
import { styled, keyframes, alpha } from '@mui/system';

// Icons
import {
  TwoWheeler, Navigation, Phone,
  PowerSettingsNew, CheckCircle, AccessTime,
  Map, Notifications, ArrowForward,
  LocationOn, MyLocation, MonetizationOn
} from "@mui/icons-material";

// Mock Services (Replace with your actual imports)
// import { useAuth } from "../context/AuthContext";
// import api from "../services/api";
import { format } from "date-fns";
import toast, { Toaster } from "react-hot-toast";

// ==============================
// 1. DESIGN SYSTEM (Yellow & Black)
// ==============================

const THEME = {
  bg: '#000000',           // Pure Black
  surface: '#121212',      // Dark Grey (Material)
  surfaceHighlight: '#1E1E1E', 
  primary: '#FFD700',      // Gold / Safety Yellow
  secondary: '#FFFFFF',    // White
  textSecondary: '#A0A0A0', // Muted Grey
  success: '#00E676',      // Bright Green
  error: '#FF3D00',        // Bright Red
};

// Animations
const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(255, 215, 0, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0); }
`;

const slideIn = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

// Styled Components
const PageWrapper = styled(Box)({
  backgroundColor: THEME.bg,
  minHeight: '100vh',
  color: THEME.secondary,
  paddingBottom: '80px',
  fontFamily: '"Inter", "Roboto", sans-serif',
});

const AppBar = styled(Box)({
  background: 'rgba(18, 18, 18, 0.8)',
  backdropFilter: 'blur(12px)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
  padding: '16px 20px',
  borderBottom: `1px solid ${alpha(THEME.textSecondary, 0.1)}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
});

const MetricBox = styled(Box)({
  background: THEME.surfaceHighlight,
  borderRadius: '16px',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  border: `1px solid ${alpha(THEME.textSecondary, 0.1)}`,
  flex: 1,
});

const GoOnlineBtn = styled(Box)(({ isonline }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  width: '100%',
  padding: '18px',
  borderRadius: '50px',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  background: isonline === 'true' 
    ? `linear-gradient(135deg, ${alpha(THEME.success, 0.2)}, ${alpha(THEME.success, 0.05)})` 
    : THEME.surfaceHighlight,
  border: `2px solid ${isonline === 'true' ? THEME.success : THEME.textSecondary}`,
  color: isonline === 'true' ? THEME.success : THEME.textSecondary,
  boxShadow: isonline === 'true' ? `0 0 20px ${alpha(THEME.success, 0.2)}` : 'none',
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  fontSize: '1.1rem',
  marginBottom: '24px',
  '&:active': { transform: 'scale(0.98)' }
}));

const ActionButton = styled(Button)(({ bg, textcolor }) => ({
  borderRadius: '14px',
  padding: '14px',
  fontSize: '1rem',
  fontWeight: 700,
  textTransform: 'none',
  backgroundColor: bg,
  color: textcolor || '#000',
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  '&:hover': { backgroundColor: alpha(bg, 0.8) }
}));

// ==============================
// 2. MAIN COMPONENT
// ==============================

export default function RiderHome() {
  const navigate = useNavigate();
  // Mock User Data
  const [rider, setRider] = useState({ 
    name: "Siva Kumar", 
    isOnline: false, 
    avatar: "https://i.pravatar.cc/150?img=11",
    earnings: 1250 
  });
  
  const [activeTab, setActiveTab] = useState(0);
  
  // Mock Orders Data
  const [orders, setOrders] = useState({
    requests: [
      {
        id: 'ORD-9921',
        restaurant: 'Anjappar Chettinad',
        resAddress: '2nd Avenue, Anna Nagar',
        customer: 'Ravi M.',
        cusAddress: 'Block 4, Flat 2B, Green Apts',
        distance: '4.2 km',
        price: 85,
        items: 3,
        time: 'Now'
      }
    ],
    active: [],
    history: [
        { id: 'ORD-8812', price: 60, status: 'Delivered', time: '10:30 AM' },
        { id: 'ORD-8810', price: 45, status: 'Delivered', time: '09:15 AM' }
    ]
  });

  // Toggle Online Status
  const toggleOnline = () => {
    const newState = !rider.isOnline;
    setRider({ ...rider, isOnline: newState });
    if(newState) toast.success("You are now ONLINE");
    else toast.error("You are now OFFLINE");
  };

  // Handle Order Actions
  const handleAccept = (order) => {
    setOrders(prev => ({
      requests: prev.requests.filter(o => o.id !== order.id),
      active: [{ ...order, status: 'Picked Up', step: 1 }, ...prev.active],
      history: prev.history
    }));
    setActiveTab(1);
    toast.success("Order Accepted!");
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    // Logic to move from Picked Up -> Delivered -> History
    if(newStatus === 'Completed') {
        const completedOrder = orders.active.find(o => o.id === orderId);
        setOrders(prev => ({
            ...prev,
            active: prev.active.filter(o => o.id !== orderId),
            history: [{...completedOrder, status: 'Delivered', time: format(new Date(), 'hh:mm a')}, ...prev.history]
        }));
        setRider(prev => ({ ...prev, earnings: prev.earnings + completedOrder.price }));
        toast.success("Delivery Completed! ₹" + completedOrder.price + " added.");
        setActiveTab(0);
    } else {
        toast.success(`Status updated: ${newStatus}`);
    }
  };

  // ==============================
  // 3. SUB-COMPONENTS
  // ==============================

  // --- REQUEST CARD (The Money Maker) ---
  const RequestCard = ({ order }) => (
    <Paper 
      sx={{ 
        bgcolor: THEME.surfaceHighlight, 
        borderRadius: '24px', 
        p: 3, mb: 3,
        animation: `${slideIn} 0.4s ease-out`,
        border: `1px solid ${THEME.primary}`
      }}
    >
      {/* Header: Earnings & Distance */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
        <Box>
          <Chip 
            label="NEW REQUEST" 
            size="small"
            sx={{ bgcolor: THEME.primary, color: '#000', fontWeight: 900, mb: 1 }} 
          />
          <Typography variant="h4" fontWeight={800} color={THEME.secondary}>
            ₹{order.price}
          </Typography>
          <Typography variant="body2" color={THEME.textSecondary}>
            Includes surge pay
          </Typography>
        </Box>
        <Box textAlign="right">
          <Typography variant="h6" fontWeight={700} color={THEME.secondary}>{order.distance}</Typography>
          <Typography variant="caption" color={THEME.textSecondary}>{order.items} Items</Typography>
        </Box>
      </Box>

      {/* Visual Route */}
      <Box sx={{ position: 'relative', pl: 2, borderLeft: `2px dashed ${alpha(THEME.textSecondary, 0.3)}`, ml: 1, mb: 3 }}>
        <Box position="relative" mb={3}>
          <Box sx={{ 
            position: 'absolute', left: -21, top: 2, 
            bgcolor: THEME.bg, border: `4px solid ${THEME.secondary}`, 
            borderRadius: '50%', width: 16, height: 16 
          }} />
          <Typography variant="body2" color={THEME.textSecondary} fontWeight={700}>PICKUP</Typography>
          <Typography variant="h6" color={THEME.secondary} lineHeight={1.2}>{order.restaurant}</Typography>
          <Typography variant="caption" color={THEME.textSecondary}>{order.resAddress}</Typography>
        </Box>

        <Box position="relative">
          <Box sx={{ 
            position: 'absolute', left: -21, top: 2, 
            bgcolor: THEME.primary, borderRadius: '50%', width: 16, height: 16,
            boxShadow: `0 0 10px ${THEME.primary}`
          }} />
          <Typography variant="body2" color={THEME.textSecondary} fontWeight={700}>DROP</Typography>
          <Typography variant="h6" color={THEME.secondary} lineHeight={1.2}>{order.customer}</Typography>
          <Typography variant="caption" color={THEME.textSecondary}>{order.cusAddress}</Typography>
        </Box>
      </Box>

      {/* Actions */}
      <Box display="flex" gap={2}>
        <ActionButton 
          bg={THEME.surface} 
          textcolor={THEME.error} 
          fullWidth
          onClick={() => toast.error("Order Declined")}
        >
          Decline
        </ActionButton>
        <ActionButton 
          bg={THEME.primary} 
          fullWidth
          onClick={() => handleAccept(order)}
        >
          Accept Order
        </ActionButton>
      </Box>
    </Paper>
  );

  // --- ACTIVE ORDER CARD (GPS Mode) ---
  const ActiveOrderCard = ({ order }) => (
    <Paper sx={{ bgcolor: THEME.surfaceHighlight, borderRadius: '24px', overflow: 'hidden', mb: 3 }}>
      {/* Map Header Placeholder */}
      <Box sx={{ 
        height: 140, 
        bgcolor: '#2C2C2C', 
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
        backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}>
        <Map sx={{ fontSize: 60, color: alpha(THEME.primary, 0.5) }} />
        <Box sx={{ 
            position: 'absolute', bottom: 10, right: 10, 
            bgcolor: '#000', p: 1, borderRadius: 2,
            display: 'flex', alignItems: 'center', gap: 1 
        }}>
            <Navigation sx={{ color: THEME.primary, fontSize: 16 }} />
            <Typography variant="caption" fontWeight="bold">Google Maps</Typography>
        </Box>
      </Box>

      <Box p={3}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h5" fontWeight={700} color={THEME.secondary}>
            {order.restaurant}
          </Typography>
          <Typography variant="h5" fontWeight={800} color={THEME.primary}>
            #{order.id.slice(-4)}
          </Typography>
        </Box>

        <Typography variant="body1" color={THEME.textSecondary} mb={3}>
           {order.resAddress}
        </Typography>

        {/* Quick Actions */}
        <Box display="flex" gap={2} mb={4}>
          <ActionButton bg="#333" textcolor="#fff" fullWidth startIcon={<Phone />}>
            Call
          </ActionButton>
          <ActionButton bg="#1976D2" textcolor="#fff" fullWidth startIcon={<DirectionIcon />}>
            Navigate
          </ActionButton>
        </Box>

        {/* Slide to Complete Button Style */}
        <Button
            fullWidth
            variant="contained"
            onClick={() => handleStatusUpdate(order.id, 'Completed')}
            sx={{
                bgcolor: THEME.success,
                color: '#000',
                py: 2,
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: 800,
                '&:hover': { bgcolor: alpha(THEME.success, 0.9) }
            }}
        >
            COMPLETE DELIVERY
        </Button>
      </Box>
    </Paper>
  );

  // ==============================
  // 4. RENDER
  // ==============================

  return (
    <PageWrapper>
      <Toaster position="top-center" />
      
      {/* HEADER */}
      <AppBar>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar src={rider.avatar} sx={{ width: 45, height: 45, border: `2px solid ${THEME.primary}` }} />
          <Box>
            <Typography variant="subtitle1" fontWeight={800} color={THEME.secondary} lineHeight={1}>
              {rider.name}
            </Typography>
            <Typography variant="caption" color={THEME.primary} fontWeight={600}>
              Gold Partner
            </Typography>
          </Box>
        </Box>
        <IconButton sx={{ bgcolor: alpha(THEME.surfaceHighlight, 1), color: THEME.secondary }}>
          <Badge badgeContent={orders.requests.length} color="error">
            <Notifications />
          </Badge>
        </IconButton>
      </AppBar>

      <Container maxWidth="sm" sx={{ pt: 3 }}>
        
        {/* ONLINE TOGGLE */}
        <GoOnlineBtn isonline={rider.isOnline.toString()} onClick={toggleOnline}>
          <PowerSettingsNew />
          {rider.isOnline ? "YOU ARE ONLINE" : "GO ONLINE"}
        </GoOnlineBtn>

        {/* DASHBOARD STATS (Only if Online) */}
        {rider.isOnline && (
            <Box display="flex" gap={2} mb={4} sx={{ animation: `${slideIn} 0.3s ease` }}>
            <MetricBox>
                <Typography variant="caption" color={THEME.textSecondary} fontWeight={700}>TODAY</Typography>
                <Typography variant="h5" color={THEME.secondary} fontWeight={800}>₹{rider.earnings}</Typography>
            </MetricBox>
            <MetricBox>
                <Typography variant="caption" color={THEME.textSecondary} fontWeight={700}>TRIPS</Typography>
                <Typography variant="h5" color={THEME.primary} fontWeight={800}>12</Typography>
            </MetricBox>
            </Box>
        )}

        {/* TABS */}
        <Box sx={{ borderBottom: 1, borderColor: alpha(THEME.textSecondary, 0.2), mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, v) => setActiveTab(v)}
            variant="fullWidth"
            TabIndicatorProps={{ sx: { bgcolor: THEME.primary, height: 3 } }}
            sx={{ '& .MuiTab-root': { color: THEME.textSecondary, fontWeight: 600, '&.Mui-selected': { color: THEME.primary } } }}
          >
            <Tab label={`Requests (${orders.requests.length})`} />
            <Tab label={`Active (${orders.active.length})`} />
            <Tab label="History" />
          </Tabs>
        </Box>

        {/* TAB CONTENT */}
        <Box minHeight="40vh">
            
            {/* 1. REQUESTS TAB */}
            {activeTab === 0 && (
                <Box>
                    {!rider.isOnline ? (
                         <EmptyState icon={<TwoWheeler />} text="Go Online to start receiving orders" />
                    ) : orders.requests.length === 0 ? (
                        <Box textAlign="center" py={6} sx={{ opacity: 0.7 }}>
                            <Box position="relative" display="inline-flex">
                                <CircularProgress size={60} thickness={2} sx={{ color: THEME.primary }} />
                                <Box
                                top={0} left={0} bottom={0} right={0}
                                position="absolute" display="flex" alignItems="center" justifyContent="center"
                                >
                                <TwoWheeler sx={{ color: THEME.primary }} />
                                </Box>
                            </Box>
                            <Typography mt={3} color={THEME.textSecondary}>Finding nearby orders...</Typography>
                        </Box>
                    ) : (
                        orders.requests.map(order => <RequestCard key={order.id} order={order} />)
                    )}
                </Box>
            )}

            {/* 2. ACTIVE TAB */}
            {activeTab === 1 && (
                <Box>
                    {orders.active.length === 0 ? (
                        <EmptyState icon={<CheckCircle />} text="No active deliveries" />
                    ) : (
                        orders.active.map(order => <ActiveOrderCard key={order.id} order={order} />)
                    )}
                </Box>
            )}

            {/* 3. HISTORY TAB */}
            {activeTab === 2 && (
                <Box>
                    {orders.history.map(hist => (
                        <Box 
                            key={hist.id} 
                            display="flex" justifyContent="space-between" alignItems="center"
                            sx={{ 
                                p: 2, mb: 2, 
                                bgcolor: THEME.surfaceHighlight, 
                                borderRadius: '12px',
                                borderLeft: `4px solid ${THEME.success}`
                            }}
                        >
                            <Box>
                                <Typography fontWeight={700} color={THEME.secondary}>Order #{hist.id}</Typography>
                                <Typography variant="caption" color={THEME.textSecondary}>{hist.time}</Typography>
                            </Box>
                            <Box textAlign="right">
                                <Typography fontWeight={700} color={THEME.success}>+ ₹{hist.price}</Typography>
                                <Chip label="Done" size="small" sx={{ height: 20, fontSize: '0.6rem', bgcolor: alpha(THEME.success, 0.2), color: THEME.success }} />
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}

        </Box>
      </Container>
    </PageWrapper>
  );
}

// Helper for empty states
const EmptyState = ({ icon, text }) => (
    <Box textAlign="center" py={6} sx={{ opacity: 0.5 }}>
        {React.cloneElement(icon, { sx: { fontSize: 48, color: THEME.textSecondary, mb: 2 } })}
        <Typography variant="body1" color={THEME.textSecondary}>{text}</Typography>
    </Box>
);

const DirectionIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 12L3 20L5.5 12L3 4L21 12Z" />
    </svg>
);