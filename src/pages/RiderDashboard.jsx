import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Button, IconButton,
  Avatar, Switch, Grid, Tab, Tabs, Chip, CircularProgress,
  Container, Badge, Divider
} from '@mui/material';
import {
  Notifications as NotifIcon,
  LocationOn as LocationIcon,
  Navigation as NavIcon,
  Phone as PhoneIcon,
  AttachMoney as MoneyIcon,
  FiberManualRecord as DotIcon,
  TwoWheeler as BikeIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useRiderAuth } from '../context/RiderAuthContext';
import RiderAssistant from '../components/RiderAssistant'; // மேலே உள்ள கோப்பு

// --- Yellow & Black Theme Constants ---
const COLORS = {
  bg: '#121212',         // ஆழ்ந்த கருப்பு பின்னணி
  card: '#1E1E1E',       // கார்ட் நிறம்
  primary: '#FFC107',    // மஞ்சள் (Main Yellow)
  primaryDark: '#FFB300',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  success: '#4CAF50',
  danger: '#FF5252',
  divider: 'rgba(255, 255, 255, 0.1)'
};

const RiderDashboard = () => {
  const { rider, getOrders, updateOrderStatus, loading: authLoading } = useRiderAuth();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [isOnline, setIsOnline] = useState(rider?.isOnline || false);

  // ஆர்டர்களை எடுக்கும் function
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data || []);
    } catch (err) {
      console.error("Error fetching orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  // ஆர்டர் ஸ்டேட்டஸ் மாற்றும் function
  const handleStatusChange = async (orderId, currentStatus) => {
    let newStatus = '';
    if (currentStatus === 'Assigned') newStatus = 'Picked Up';
    else if (currentStatus === 'Picked Up') newStatus = 'Delivered';

    if (newStatus) {
      try {
        await updateOrderStatus(orderId, newStatus);
        fetchOrders(); // Refresh Data
      } catch (err) {
        console.error("Update failed", err);
      }
    }
  };

  const activeOrders = orders.filter(o => ['Assigned', 'Picked Up'].includes(o.status));
  const historyOrders = orders.filter(o => ['Delivered', 'Cancelled'].includes(o.status));

  // --- UI Components ---

  // 1. Header Section
  const Header = () => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar 
          src={rider?.avatar} 
          sx={{ width: 50, height: 50, border: `2px solid ${COLORS.primary}`, bgcolor: '#333' }}
        >
          {rider?.name?.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ color: COLORS.text, fontWeight: 'bold', lineHeight: 1 }}>
            {rider?.name || 'Rider'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <DotIcon sx={{ fontSize: 12, color: isOnline ? COLORS.success : COLORS.textSecondary }} />
            <Typography variant="caption" sx={{ color: COLORS.textSecondary }}>
              {isOnline ? 'On Duty' : 'Off Duty'}
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Switch 
          checked={isOnline} 
          onChange={(e) => setIsOnline(e.target.checked)}
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': { color: COLORS.primary },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: COLORS.primary },
          }}
        />
        <IconButton sx={{ color: COLORS.text }}>
          <Badge badgeContent={activeOrders.length} color="error">
            <NotifIcon />
          </Badge>
        </IconButton>
      </Box>
    </Box>
  );

  // 2. Earnings Stats
  const StatsCard = () => (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={6}>
        <Card sx={{ bgcolor: COLORS.primary, borderRadius: 3, color: '#000' }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" sx={{ fontWeight: 'bold', opacity: 0.8 }}>EARNINGS</Typography>
              <MoneyIcon fontSize="small" />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: '900', mt: 0.5 }}>$84.00</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6}>
        <Card sx={{ bgcolor: COLORS.card, borderRadius: 3, border: '1px solid #333' }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" sx={{ color: COLORS.textSecondary }}>TRIPS</Typography>
              <CheckCircleIcon sx={{ color: COLORS.success, fontSize: 20 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: COLORS.text, mt: 0.5 }}>
              {historyOrders.length}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  // 3. Order Card Design
  const OrderCard = ({ order, isActive }) => {
    // Status colors
    const isPickedUp = order.status === 'Picked Up';
    const statusColor = isPickedUp ? COLORS.primary : '#FFF';
    
    return (
      <Card sx={{ 
        mb: 2.5, 
        bgcolor: COLORS.card, 
        color: COLORS.text, 
        borderRadius: 4,
        position: 'relative',
        overflow: 'visible',
        border: isActive ? `1px solid ${COLORS.primary}` : '1px solid #333'
      }}>
        <CardContent sx={{ pb: isActive ? 2 : 3 }}>
          
          {/* Top Row: ID & Price */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Chip 
              label={`#${order._id.slice(-6).toUpperCase()}`} 
              size="small" 
              sx={{ bgcolor: '#333', color: COLORS.textSecondary, borderRadius: 1 }} 
            />
            <Typography variant="h6" sx={{ color: COLORS.primary, fontWeight: 'bold' }}>
              ${order.deliveryFee || '5.00'}
            </Typography>
          </Box>

          {/* Timeline Visualizer */}
          <Box sx={{ position: 'relative', pl: 1.5, mb: 2 }}>
            {/* Connecting Line */}
            <Box sx={{ 
              position: 'absolute', left: 20, top: 10, bottom: 25, 
              width: '2px', bgcolor: '#444', zIndex: 0 
            }} />

            {/* Pickup */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, position: 'relative', zIndex: 1 }}>
              <DotIcon sx={{ color: isActive && !isPickedUp ? COLORS.primary : '#666', fontSize: 20, mt: 0.5 }} />
              <Box>
                <Typography variant="caption" sx={{ color: COLORS.textSecondary }}>PICKUP</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {order.restaurantName || "Restaurant Name"}
                </Typography>
                <Typography variant="caption" sx={{ color: '#888' }}>
                  {order.pickupAddress || "123 Main St"}
                </Typography>
              </Box>
            </Box>

            {/* Dropoff */}
            <Box sx={{ display: 'flex', gap: 2, position: 'relative', zIndex: 1 }}>
              <LocationIcon sx={{ color: isActive && isPickedUp ? COLORS.danger : '#666', fontSize: 20, mt: 0.5 }} />
              <Box>
                <Typography variant="caption" sx={{ color: COLORS.textSecondary }}>DROPOFF</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {order.customerName || "Customer Name"}
                </Typography>
                <Typography variant="caption" sx={{ color: '#888' }}>
                  {order.deliveryAddress || "456 2nd Ave, Apt 4B"}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Action Buttons (Only for active) */}
          {isActive && (
            <>
              <Divider sx={{ borderColor: COLORS.divider, mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    sx={{ 
                      borderColor: '#444', color: '#FFF', borderRadius: 2, height: 48,
                      '&:hover': { borderColor: COLORS.primary }
                    }}
                  >
                    <PhoneIcon />
                  </Button>
                </Grid>
                <Grid item xs={8}>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    onClick={() => handleStatusChange(order._id, order.status)}
                    startIcon={<NavIcon />}
                    sx={{ 
                      bgcolor: COLORS.primary, 
                      color: '#000', 
                      fontWeight: 'bold', 
                      borderRadius: 2, 
                      height: 48,
                      '&:hover': { bgcolor: COLORS.primaryDark }
                    }}
                  >
                    {order.status === 'Assigned' ? 'Slide to Pickup' : 'Slide to Complete'}
                  </Button>
                </Grid>
              </Grid>
            </>
          )}

          {!isActive && (
            <Chip 
              label={order.status} 
              sx={{ width: '100%', bgcolor: order.status === 'Delivered' ? 'rgba(76, 175, 80, 0.1)' : '#333', color: order.status === 'Delivered' ? COLORS.success : '#888' }} 
            />
          )}

        </CardContent>
      </Card>
    );
  };

  if (authLoading || loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: COLORS.bg, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ color: COLORS.primary }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: COLORS.bg, pb: 10 }}>
      <Container maxWidth="sm" sx={{ px: 2 }}>
        
        <Header />
        <StatsCard />

        {/* Tab Selection */}
        <Box sx={{ mb: 3, borderBottom: `1px solid ${COLORS.divider}` }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, v) => setTabValue(v)}
            TabIndicatorProps={{ style: { backgroundColor: COLORS.primary } }}
            sx={{ 
              '& .MuiTab-root': { color: COLORS.textSecondary, textTransform: 'none', fontSize: '1rem' },
              '& .Mui-selected': { color: `${COLORS.primary} !important` }
            }}
          >
            <Tab label={`Active Task (${activeOrders.length})`} />
            <Tab label="History" />
          </Tabs>
        </Box>

        {/* Orders List */}
        <Box sx={{ minHeight: 300 }}>
          {tabValue === 0 ? (
            activeOrders.length > 0 ? (
              activeOrders.map(order => <OrderCard key={order._id} order={order} isActive={true} />)
            ) : (
              <Box sx={{ textAlign: 'center', mt: 8, opacity: 0.5 }}>
                <BikeIcon sx={{ fontSize: 60, color: '#444', mb: 2 }} />
                <Typography sx={{ color: COLORS.textSecondary }}>No new orders yet.</Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>Stay online to receive requests.</Typography>
              </Box>
            )
          ) : (
            historyOrders.map(order => <OrderCard key={order._id} order={order} isActive={false} />)
          )}
        </Box>

      </Container>
      
      {/* Floating Assistant */}
      <RiderAssistant rider={rider} orders={orders} />
    </Box>
  );
};

export default RiderDashboard;