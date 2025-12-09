import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Typography, Box, Grid, Button,
  TextField, InputAdornment, Stack, Chip, LinearProgress,
  CircularProgress, Fade, Avatar
} from "@mui/material";
import { styled, alpha, keyframes } from '@mui/system';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';

import api from "../services/api";

// === 1. ANIMATIONS ===
const pulseGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(255, 215, 0, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0); }
`;

// === 2. THEME PALETTE (Sleek Yellow & Black) ===
const THEME = {
  bg: '#000000', // True Black
  glass: 'rgba(20, 20, 20, 0.8)', // Darker Glass
  glassBorder: 'rgba(255, 215, 0, 0.15)', // Subtle Yellow Border
  primary: '#FFD700', // Bright Yellow
  success: '#10B981', // Emerald (Keep green for Delivered status clarity)
  warning: '#F59E0B', // Amber
  text: '#FFFFFF',
  textMuted: '#9ca3af', // Cool Grey
  gradient: 'linear-gradient(135deg, #FFD700 0%, #FDB931 100%)' // Yellow Gradient
};

// === 3. STYLED COMPONENTS ===

const PageWrapper = styled(Box)({
  backgroundColor: THEME.bg,
  minHeight: '100vh',
  color: THEME.text,
  paddingBottom: '80px',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-20%', right: '-10%',
    width: '60%', height: '60%',
    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.08) 0%, transparent 70%)', // Yellow Ambient
    filter: 'blur(80px)',
    zIndex: 0
  }
});

// Stats Card for top dashboard
const StatCard = styled(Box)(({ theme }) => ({
  background: 'rgba(20, 20, 20, 0.6)',
  border: `1px solid ${THEME.glassBorder}`,
  borderRadius: '16px',
  padding: theme.spacing(2.5),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  backdropFilter: 'blur(10px)'
}));

const IconBox = styled(Box)(({ color }) => ({
  width: 48, height: 48,
  borderRadius: '12px',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: alpha(color || THEME.primary, 0.15),
  color: color || THEME.primary,
  border: `1px solid ${alpha(color || THEME.primary, 0.2)}`
}));

// Main Order Card
const OrderCard = styled(Box)(({ active }) => ({
  background: THEME.glass,
  border: `1px solid ${active ? alpha(THEME.primary, 0.5) : 'rgba(255,255,255,0.05)'}`,
  borderRadius: '20px',
  marginBottom: '24px',
  overflow: 'hidden',
  backdropFilter: 'blur(12px)',
  transition: 'all 0.3s ease',
  boxShadow: active ? '0 8px 30px rgba(255, 215, 0, 0.1)' : 'none',
  animation: active ? `${pulseGlow} 3s infinite` : 'none',
  '&:hover': {
    transform: 'translateY(-4px)',
    borderColor: THEME.primary, // Yellow Border on Hover
    boxShadow: '0 10px 40px -10px rgba(255, 215, 0, 0.15)'
  }
}));

const ProductImage = styled('img')({
  width: 70, height: 70,
  borderRadius: '12px',
  objectFit: 'contain',
  backgroundColor: '#1c1c1e', // Dark grey background for product image
  border: `1px solid ${THEME.glassBorder}`,
  padding: '4px'
});

const SearchField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    background: 'rgba(20, 20, 20, 0.8)',
    borderRadius: '12px',
    color: THEME.text,
    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
    '&:hover fieldset': { borderColor: THEME.primary }, // Yellow hover
    '&.Mui-focused fieldset': { borderColor: THEME.primary }, // Yellow focus
  }
});

// === HELPER FUNCTIONS ===
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'delivered': return THEME.success;
    case 'shipped': return THEME.primary; // Yellow
    case 'processing': return THEME.warning;
    case 'cancelled': return '#EF4444';
    default: return THEME.textMuted;
  }
};

const getStatusStep = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending': return 10;
    case 'processing': return 40;
    case 'shipped': return 75;
    case 'delivered': return 100;
    default: return 0;
  }
};

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Stats
  const [stats, setStats] = useState({ total: 0, spent: 0, active: 0 });

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredOrders(orders);
    } else {
      const lowerSearch = search.toLowerCase();
      const filtered = orders.filter(order => 
        order._id.toLowerCase().includes(lowerSearch) ||
        order.items.some(item => item.productId?.name?.toLowerCase().includes(lowerSearch))
      );
      setFilteredOrders(filtered);
    }
  }, [search, orders]);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/my-orders");
      const sorted = (res.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sorted);
      setFilteredOrders(sorted);

      // Calculate Stats
      const totalSpent = sorted.reduce((acc, order) => acc + (order.totalAmount || order.total || 0), 0);
      const activeOrders = sorted.filter(o => o.status === 'processing' || o.status === 'shipped').length;
      setStats({
        total: sorted.length,
        spent: totalSpent,
        active: activeOrders
      });

    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageWrapper sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: THEME.primary }} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container maxWidth="lg" sx={{ pt: 5, position: 'relative', zIndex: 2 }}>
        
        {/* 1. HEADER */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h3" fontWeight={800} sx={{ background: THEME.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', width: 'fit-content', mb: 1 }}>
            My Orders
          </Typography>
          <Typography variant="body1" color={THEME.textMuted}>
            Track shipment progress, manage returns, and view invoices.
          </Typography>
        </Box>

        {/* 2. STATS DASHBOARD */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12} sm={4}>
            <StatCard>
              {/* Yellow Icon */}
              <IconBox color={THEME.primary}><InventoryIcon /></IconBox>
              <Box>
                <Typography variant="h4" fontWeight={700} sx={{ color: '#fff' }}>{stats.total}</Typography>
                <Typography variant="caption" color={THEME.textMuted} textTransform="uppercase" fontWeight={700}>Total Orders</Typography>
              </Box>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatCard>
               {/* Yellow Icon */}
              <IconBox color={THEME.primary}><AttachMoneyIcon /></IconBox>
              <Box>
                <Typography variant="h4" fontWeight={700} sx={{ color: '#fff' }}>Rs {(stats.spent / 1000).toFixed(1)}k</Typography>
                <Typography variant="caption" color={THEME.textMuted} textTransform="uppercase" fontWeight={700}>Total Spent</Typography>
              </Box>
            </StatCard>
          </Grid>
          <Grid item xs={12} sm={4}>
             {/* Highlight active orders with yellow border if any */}
            <StatCard sx={{ border: stats.active > 0 ? `1px solid ${THEME.primary}` : undefined }}>
              <IconBox color={THEME.warning}><LocalShippingIcon /></IconBox>
              <Box>
                <Typography variant="h4" fontWeight={700} sx={{ color: '#fff' }}>{stats.active}</Typography>
                <Typography variant="caption" color={THEME.textMuted} textTransform="uppercase" fontWeight={700}>In Transit</Typography>
              </Box>
            </StatCard>
          </Grid>
        </Grid>

        {/* 3. SEARCH BAR */}
        <Box sx={{ mb: 4 }}>
          <SearchField
            placeholder="Search by Order ID, Product, or Price..."
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: THEME.textMuted }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* 4. EMPTY STATE */}
        {filteredOrders.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 10, border: `1px dashed ${THEME.glassBorder}`, borderRadius: 4, background: alpha(THEME.glass, 0.3) }}>
            <ShoppingBagIcon sx={{ fontSize: 60, color: THEME.textMuted, mb: 2, opacity: 0.5 }} />
            <Typography variant="h5" fontWeight={600} sx={{ color: '#fff' }}>No orders found</Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/')}
              sx={{ 
                  mt: 3, 
                  background: THEME.primary, // Yellow
                  color: '#000', // Black text
                  fontWeight: 800, 
                  borderRadius: 2,
                  '&:hover': { background: '#e6c200' }
              }}
            >
              Browse Catalog
            </Button>
          </Box>
        )}

        {/* 5. ORDER LIST */}
        {filteredOrders.map((order) => {
          const isActive = order.status === 'processing' || order.status === 'shipped';
          const statusColor = getStatusColor(order.status);

          return (
            <Fade in={true} key={order._id}>
              <OrderCard active={isActive ? 1 : 0}>
                
                {/* Card Header */}
                <Box sx={{ 
                  p: 2.5, 
                  borderBottom: `1px solid rgba(255,255,255,0.05)`, 
                  display: 'flex', 
                  flexWrap: 'wrap',
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  bgcolor: 'rgba(0,0,0,0.3)' 
                }}>
                  <Stack direction="row" spacing={3} alignItems="center">
                    <Box>
                       <Typography variant="caption" color={THEME.textMuted} fontWeight={700}>ORDER PLACED</Typography>
                       <Typography variant="body2" fontWeight={600}>
                         {new Date(order.createdAt || order.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                       </Typography>
                    </Box>
                    <Box>
                       <Typography variant="caption" color={THEME.textMuted} fontWeight={700}>TOTAL</Typography>
                       <Typography variant="body2" fontWeight={800} color={THEME.primary}>
                         Rs {(order.totalAmount || order.total).toLocaleString()}
                       </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={2} alignItems="center">
                    <Chip 
                      label={order.status} 
                      size="small"
                      sx={{ 
                        bgcolor: alpha(statusColor, 0.15), 
                        color: statusColor, 
                        fontWeight: 800, 
                        textTransform: 'uppercase',
                        border: `1px solid ${alpha(statusColor, 0.3)}`
                      }} 
                    />
                    <Button 
                      variant="outlined" 
                      size="small"
                      endIcon={<ChevronRightIcon />}
                      onClick={() => navigate(`/order/${order._id}`)}
                      sx={{ 
                        borderColor: 'rgba(255,255,255,0.2)', 
                        color: THEME.text, 
                        borderRadius: 2,
                        '&:hover': { borderColor: THEME.primary, color: THEME.primary, background: 'rgba(255,215,0,0.05)' }
                      }}
                    >
                      Track
                    </Button>
                  </Stack>
                </Box>

                {/* Progress Bar (Only for Active) */}
                {isActive && (
                  <LinearProgress 
                    variant="determinate" 
                    value={getStatusStep(order.status)} 
                    sx={{ height: 4, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { bgcolor: THEME.primary } }}
                  />
                )}

                {/* Items */}
                <Box sx={{ p: 3 }}>
                  {order.items?.map((item, idx) => (
                    <Box key={idx} sx={{ display: 'flex', gap: 2, mb: idx !== order.items.length - 1 ? 3 : 0 }}>
                      <ProductImage
                        src={item.productId?.image || item.product?.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%231c1c1e'/%3E%3Ctext x='40' y='45' font-family='Arial, sans-serif' font-size='10' fill='%23FFD700' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E"}
                        alt={item.productId?.name}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Grid container alignItems="center">
                          <Grid item xs={12} sm={8}>
                            <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#fff' }}>
                              {item.productId?.name || item.product?.name}
                            </Typography>
                            <Typography variant="body2" color={THEME.textMuted}>
                              Qty: {item.qty || item.quantity} • {item.productId?.brand || 'Part'}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'left', sm: 'right' }, mt: { xs: 1, sm: 0 } }}>
                             <Typography variant="h6" fontWeight={700} sx={{ color: THEME.primary }}>
                               Rs {(item.price || (item.productId?.price * (item.qty || item.quantity)))?.toLocaleString()}
                             </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  ))}
                </Box>

              </OrderCard>
            </Fade>
          );
        })}

      </Container>
    </PageWrapper>
  );
}