import React, { useEffect, useState } from "react";
import {
  Grid, Typography, Table, TableHead, TableRow, TableCell, TableBody,
  Box, Alert, Chip, IconButton, LinearProgress, Avatar, Button,
  List, ListItem, ListItemText, ListItemAvatar, Container, Stack, Fade
} from "@mui/material";
import { styled, alpha, keyframes } from '@mui/system';
import {
  Visibility, LocalShipping, TrendingUp, TrendingDown,
  CheckCircle, Cancel, Pending, Refresh, AttachMoney,
  ShoppingBag, PersonOutline, NotificationsActive
} from "@mui/icons-material";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar 
} from "recharts";
import api from "../../services/api";

// === 1. THEME CONFIGURATION ===
const THEME = {
  bg: '#0F172A', // Deep Navy
  glass: 'rgba(30, 41, 59, 0.6)', // Glass Card
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  primary: '#38BDF8', // Cyan
  success: '#10B981', // Emerald
  warning: '#F59E0B', // Amber
  error: '#EF4444', // Red
  text: '#F1F5F9',
  textMuted: '#94A3B8',
  gradient: 'linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)'
};

// === 2. STYLED COMPONENTS ===

const DashboardWrapper = styled(Box)({
  backgroundColor: THEME.bg,
  minHeight: '100vh',
  color: THEME.text,
  padding: '32px',
  backgroundImage: `radial-gradient(circle at 50% 0%, #1e293b 0%, ${THEME.bg} 80%)`,
});

const GlassCard = styled(Box)({
  background: THEME.glass,
  backdropFilter: 'blur(12px)',
  border: `1px solid ${THEME.glassBorder}`,
  borderRadius: '20px',
  padding: '24px',
  height: '100%',
  transition: 'transform 0.2s',
  '&:hover': {
    borderColor: 'rgba(255,255,255,0.15)',
  }
});

const StatBox = styled(Box)(({ color }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  '& .icon-box': {
    width: '48px', height: '48px',
    borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: alpha(color, 0.15),
    color: color,
    marginBottom: '12px'
  }
}));

const ModernTable = styled(Table)({
  '& .MuiTableCell-head': {
    color: THEME.textMuted,
    borderBottom: `1px solid ${THEME.glassBorder}`,
    fontWeight: 600,
    textTransform: 'uppercase',
    fontSize: '0.75rem',
    letterSpacing: '1px'
  },
  '& .MuiTableCell-body': {
    color: THEME.text,
    borderBottom: `1px solid ${THEME.glassBorder}`,
    fontSize: '0.9rem'
  }
});

// Custom Status Chip
const StatusBadge = styled(Chip)(({ statuscolor }) => ({
  backgroundColor: alpha(statuscolor, 0.15),
  color: statuscolor,
  fontWeight: 700,
  borderRadius: '8px',
  border: `1px solid ${alpha(statuscolor, 0.3)}`,
  textTransform: 'uppercase',
  fontSize: '0.7rem',
  height: '24px'
}));

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
`;

const OnlineIndicator = styled(Box)({
  width: 10, height: 10,
  borderRadius: '50%',
  backgroundColor: THEME.success,
  animation: `${pulse} 2s infinite`
});

// === 3. HELPER FUNCTIONS ===
const getStatusColor = (status) => {
  switch (status) {
    case "Delivered": return THEME.success;
    case "Pending": return THEME.warning;
    case "Processing": return THEME.primary;
    case "Shipped": return THEME.primary;
    case "Cancelled": return THEME.error;
    default: return THEME.textMuted;
  }
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    todayOrders: 0, pendingOrders: 0, deliveredOrders: 0, 
    cancelledOrders: 0, revenue24h: 0, avgDeliveryTime: 0
  });
  const [alerts, setAlerts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [activeRiders, setActiveRiders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Data Fetching Logic (Kept exactly the same as your original)
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const today = new Date();
        const [ordersRes, productsRes, usersRes, ridersRes] = await Promise.all([
          api.get("/orders"), api.get("/products"), api.get("/admin/users"), api.get("/admin/riders"),
        ]);

        const orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
        const products = Array.isArray(productsRes.data) ? productsRes.data : [];
        const riders = Array.isArray(ridersRes.data) ? ridersRes.data : [];

        const todayOrders = orders.filter(order => new Date(order.createdAt).toDateString() === today.toDateString());
        const revenue24h = todayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        setStats({
          todayOrders: todayOrders.length,
          pendingOrders: orders.filter(o => o.status === "Pending").length,
          deliveredOrders: orders.filter(o => o.status === "Delivered").length,
          cancelledOrders: orders.filter(o => o.status === "Cancelled").length,
          revenue24h,
          avgDeliveryTime: 45,
        });

        // Alerts logic
        const newAlerts = [
          ...products.filter(p => p.quantity <= p.reorderThreshold).map(p => ({
             id: p._id, message: `Low stock: ${p.name}`, severity: "warning"
          })),
        ];
        setAlerts(newAlerts);

        setRecentOrders(orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8));
        setActiveRiders(riders.filter(r => r.isOnline));

        // Mock chart data based on logic
        const chartData = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            chartData.push({
                name: d.toLocaleDateString('en', { weekday: 'short' }),
                revenue: Math.floor(Math.random() * 50000) + 10000 // Mocking visual data for demo
            });
        }
        setSalesData(chartData);

      } catch (error) {
        console.error("Dashboard load failed:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  if (loading) return <Box sx={{ bgcolor: THEME.bg, height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><LinearProgress sx={{ width: 200, color: THEME.primary }} /></Box>;

  return (
    <DashboardWrapper>
      <Container maxWidth="xl">
        
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h4" fontWeight={800} sx={{ background: THEME.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Command Center
            </Typography>
            <Typography variant="body2" color={THEME.textMuted}>
              Overview of store performance and logistics.
            </Typography>
          </Box>
          <IconButton sx={{ bgcolor: alpha(THEME.primary, 0.1), color: THEME.primary }}>
            <NotificationsActive />
          </IconButton>
        </Box>

        {/* ALERTS */}
        {alerts.length > 0 && (
          <Box sx={{ mb: 4 }}>
            {alerts.slice(0, 2).map((alert) => (
              <Alert 
                key={alert.id} 
                severity={alert.severity} 
                variant="filled"
                sx={{ mb: 1, borderRadius: '12px', bgcolor: alpha(THEME.warning, 0.2), color: THEME.warning, border: `1px solid ${THEME.warning}` }}
              >
                {alert.message}
              </Alert>
            ))}
          </Box>
        )}

        {/* STATS GRID */}
        <Grid container spacing={3} mb={4}>
          {[
            { label: "Today's Revenue", val: `Rs ${stats.revenue24h.toLocaleString()}`, icon: <AttachMoney />, color: THEME.primary },
            { label: "New Orders", val: stats.todayOrders, icon: <ShoppingBag />, color: THEME.success },
            { label: "Pending Dispatch", val: stats.pendingOrders, icon: <Pending />, color: THEME.warning },
            { label: "Avg Delivery", val: `${stats.avgDeliveryTime} min`, icon: <LocalShipping />, color: THEME.primary },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Fade in timeout={500 + (index * 100)}>
                <GlassCard>
                  <StatBox color={item.color}>
                    <Box className="icon-box">{item.icon}</Box>
                    <Typography variant="h4" fontWeight={700}>{item.val}</Typography>
                    <Typography variant="body2" color={THEME.textMuted} fontWeight={600} textTransform="uppercase">
                      {item.label}
                    </Typography>
                  </StatBox>
                </GlassCard>
              </Fade>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          
          {/* LEFT COLUMN - CHARTS & TABLES */}
          <Grid item xs={12} lg={8}>
            
            {/* REVENUE CHART */}
            <GlassCard sx={{ mb: 3 }}>
              <Box display="flex" justifyContent="space-between" mb={3}>
                <Typography variant="h6" fontWeight={700}>Revenue Analytics</Typography>
                <Chip label="Last 7 Days" size="small" sx={{ bgcolor: alpha(THEME.primary, 0.2), color: THEME.primary }} />
              </Box>
              <Box height={300} width="100%" sx={{ minHeight: 300 }}>
                {salesData && salesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={THEME.primary} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={THEME.primary} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" stroke={THEME.textMuted} />
                      <YAxis stroke={THEME.textMuted} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '8px', color: '#fff' }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke={THEME.primary} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <Typography color={THEME.textMuted}>No data available</Typography>
                  </Box>
                )}
              </Box>
            </GlassCard>

            {/* RECENT ORDERS */}
            <GlassCard>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h6" fontWeight={700}>Recent Orders</Typography>
                <Button size="small" sx={{ color: THEME.primary }}>View All</Button>
              </Box>
              <Box sx={{ overflowX: 'auto' }}>
                <ModernTable>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell>
                           <Typography variant="body2" fontWeight={700} color={THEME.primary}>
                             #{order._id?.slice(-6)?.toUpperCase() || 'N/A'}
                           </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                             <Avatar sx={{ width: 24, height: 24, bgcolor: alpha(THEME.text, 0.1), fontSize: '0.8rem' }}>
                               <PersonOutline fontSize="inherit" />
                             </Avatar>
                             {order.user_id?.name || order.shippingAddress?.name || 'Guest'}
                          </Box>
                        </TableCell>
                        <TableCell>Rs {order.totalAmount?.toLocaleString() || '0'}</TableCell>
                        <TableCell>
                          <StatusBadge 
                            label={order.status} 
                            statuscolor={getStatusColor(order.status)} 
                          />
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small" sx={{ color: THEME.textMuted }}>
                            <Visibility fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </ModernTable>
              </Box>
            </GlassCard>
          </Grid>

          {/* RIGHT COLUMN - RIDERS & SECONDARY STATS */}
          <Grid item xs={12} lg={4}>
            
            {/* ACTIVE RIDERS */}
            <GlassCard sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={2}>Online Fleet</Typography>
              {activeRiders.length === 0 ? (
                <Alert severity="info" sx={{ bgcolor: 'transparent', color: THEME.textMuted }}>No riders online.</Alert>
              ) : (
                <List disablePadding>
                  {activeRiders.map((rider) => (
                    <ListItem key={rider._id} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Box position="relative">
                           <Avatar src={rider.avatar} sx={{ bgcolor: THEME.primary }}>{rider.name?.[0] || 'R'}</Avatar>
                           <Box position="absolute" bottom={0} right={0}>
                             <OnlineIndicator />
                           </Box>
                        </Box>
                      </ListItemAvatar>
                      <ListItemText
                        primary={<Typography fontWeight={600}>{rider.name || 'Unknown Rider'}</Typography>}
                        secondary={<Typography variant="caption" color={THEME.textMuted}>{rider.vehicleType || 'N/A'}</Typography>}
                      />
                      <Chip label="Active" size="small" sx={{ bgcolor: alpha(THEME.success, 0.2), color: THEME.success, height: 20 }} />
                    </ListItem>
                  ))}
                </List>
              )}
              <Button fullWidth variant="outlined" sx={{ mt: 2, borderColor: THEME.glassBorder, color: THEME.textMuted }}>
                Manage Fleet
              </Button>
            </GlassCard>

            {/* ORDER SUMMARY DONUT (Simulated with Bar for now) */}
            <GlassCard>
              <Typography variant="h6" fontWeight={700} mb={2}>Order Status</Typography>
              <Box height={200} width="100%" sx={{ minHeight: 200 }}>
                {stats ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Delivered', val: stats.deliveredOrders || 0 },
                      { name: 'Cancelled', val: stats.cancelledOrders || 0 },
                      { name: 'Pending', val: stats.pendingOrders || 0 }
                    ]}>
                      <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1E293B', border: 'none' }}/>
                      <Bar dataKey="val" fill={THEME.primary} radius={[4, 4, 0, 0]} barSize={30} />
                      <XAxis dataKey="name" stroke={THEME.textMuted} fontSize={12} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <Typography color={THEME.textMuted}>Loading...</Typography>
                  </Box>
                )}
              </Box>
            </GlassCard>

          </Grid>
        </Grid>

      </Container>
    </DashboardWrapper>
  );
}