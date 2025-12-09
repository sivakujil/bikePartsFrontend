import React, { useEffect, useState } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableHead, TableRow,
  Button, TextField, Grid, Drawer, Stack, IconButton, Chip, LinearProgress, 
  Container, Fade, Tooltip, Select, MenuItem, FormControl, InputLabel, 
  InputAdornment, Avatar, Divider
} from "@mui/material";
import { styled, alpha } from '@mui/system';
import {
  Visibility, Search, FilterList, Close, Print, Person, LocationOn,
  LocalShipping, CheckCircle, Cancel, AccessTime, ReceiptLong, Timeline,
  ShoppingBag, CreditCard
} from "@mui/icons-material";
import { Timeline as MuiTimeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import { format } from "date-fns";
import api from "../../services/api";

// === 1. THEME ===
const THEME = {
  bg: '#0F172A',
  glass: 'rgba(30, 41, 59, 0.6)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  primary: '#38BDF8',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  text: '#F8FAFC',
  textMuted: '#94A3B8',
};

// === 2. STYLED COMPONENTS ===

const PageWrapper = styled(Box)({
  backgroundColor: THEME.bg,
  minHeight: '100vh',
  color: THEME.text,
  padding: '32px',
  backgroundImage: `radial-gradient(circle at 50% 0%, #1e293b 0%, ${THEME.bg} 80%)`,
});

const GlassPanel = styled(Box)({
  background: THEME.glass,
  backdropFilter: 'blur(12px)',
  border: `1px solid ${THEME.glassBorder}`,
  borderRadius: '20px',
  padding: '24px',
  height: '100%',
  overflow: 'hidden'
});

const SearchField = styled(TextField)({
  '& .MuiInputBase-root': {
    color: THEME.text,
    backgroundColor: alpha(THEME.bg, 0.5),
    borderRadius: '12px',
    height: '48px'
  },
  '& .MuiOutlinedInput-notchedOutline': { borderColor: THEME.glassBorder },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: THEME.primary },
  '& .MuiSvgIcon-root': { color: THEME.textMuted },
});

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
    fontSize: '0.9rem',
    padding: '16px'
  },
  '& .MuiTableRow-root:hover': {
    backgroundColor: alpha(THEME.primary, 0.04)
  }
});

const StatusChip = styled(Chip)(({ statuscolor }) => ({
  backgroundColor: alpha(statuscolor, 0.15),
  color: statuscolor,
  fontWeight: 700,
  borderRadius: '8px',
  border: `1px solid ${alpha(statuscolor, 0.3)}`,
  fontSize: '0.75rem',
  height: '26px'
}));

// Drawer Styling
const DrawerContent = styled(Box)({
  width: 600,
  maxWidth: '100vw',
  backgroundColor: '#1E293B',
  height: '100%',
  color: '#fff',
  padding: '32px',
  overflowY: 'auto'
});

// === 3. HELPERS ===
const getStatusColor = (status) => {
  switch (status) {
    case "Delivered": return THEME.success;
    case "Shipped": case "Out for Delivery": return THEME.primary;
    case "Pending": return THEME.warning;
    case "Cancelled": return THEME.error;
    default: return THEME.textMuted;
  }
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", status: "All", payment: "All" });
  
  // Drawer State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // --- LOGIC ---
  useEffect(() => { loadOrders(); }, []);
  useEffect(() => { applyFilters(); }, [orders, filters]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/orders");
      // Mock data fallback if API empty for demo
      setOrders(response.data.length > 0 ? response.data : []); 
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  const applyFilters = () => {
    let filtered = [...orders];
    if (filters.search) {
      const s = filters.search.toLowerCase();
      filtered = filtered.filter(o => 
        o.orderNumber?.toLowerCase().includes(s) || o.user_id?.name?.toLowerCase().includes(s)
      );
    }
    if (filters.status !== "All") filtered = filtered.filter(o => o.status === filters.status);
    setFilteredOrders(filtered);
  };

  const handleViewOrder = (order) => { setSelectedOrder(order); setDrawerOpen(true); };

  if (loading) return <Box sx={{ bgcolor: THEME.bg, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LinearProgress sx={{ width: 200, color: THEME.primary }} /></Box>;

  return (
    <PageWrapper>
      <Container maxWidth="xl">
        
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h4" fontWeight={800}>Order Logistics</Typography>
            <Typography variant="body2" color={THEME.textMuted}>Manage shipments, track deliveries, and process invoices.</Typography>
          </Box>
          <Button variant="contained" startIcon={<Print />} sx={{ bgcolor: THEME.primary, color: '#000', fontWeight: 'bold', borderRadius: '12px' }}>
            Export List
          </Button>
        </Box>

        <GlassPanel sx={{ p: 0 }}>
          
          {/* FILTERS BAR */}
          <Box sx={{ p: 3, borderBottom: `1px solid ${THEME.glassBorder}`, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <SearchField
              placeholder="Search Order # or Customer"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Search sx={{ color: THEME.textMuted }} /></InputAdornment>
              }}
              size="small"
              sx={{ width: 300 }}
            />
            
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel sx={{ color: THEME.textMuted }}>Status</InputLabel>
              <Select 
                value={filters.status} 
                label="Status" 
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                sx={{ color: THEME.text, '.MuiOutlinedInput-notchedOutline': { borderColor: THEME.glassBorder } }}
                MenuProps={{ PaperProps: { sx: { bgcolor: '#1E293B', color: '#fff' } } }}
              >
                {["All", "Pending", "Shipped", "Delivered", "Cancelled"].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>

          {/* TABLE */}
          <Box sx={{ overflowX: 'auto' }}>
            <ModernTable>
              <TableHead>
                <TableRow>
                  <TableCell>Order Details</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={700} color={THEME.primary}>{order.orderNumber || `#${order._id.slice(-6)}`}</Typography>
                        <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
                          <AccessTime sx={{ fontSize: 12, color: THEME.textMuted }} />
                          <Typography variant="caption" color={THEME.textMuted}>
                            {format(new Date(order.createdAt), "MMM dd, HH:mm")}
                          </Typography>
                        </Stack>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1.5}>
                         <Avatar sx={{ width: 28, height: 28, bgcolor: alpha(THEME.primary, 0.2), fontSize: '0.8rem', color: THEME.primary }}>
                            {order.user_id?.name?.[0] || 'G'}
                         </Avatar>
                         <Box>
                            <Typography variant="body2">{order.user_id?.name || 'Guest'}</Typography>
                            <Typography variant="caption" color={THEME.textMuted} display="block">{order.user_id?.phone}</Typography>
                         </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <StatusChip label={order.status} statuscolor={getStatusColor(order.status)} />
                    </TableCell>
                    <TableCell>
                       <Stack direction="row" alignItems="center" spacing={1}>
                         {order.paymentType === 'Card' ? <CreditCard fontSize="small" sx={{ color: THEME.textMuted }} /> : <ReceiptLong fontSize="small" sx={{ color: THEME.textMuted }} />}
                         <Typography variant="caption">{order.paymentType}</Typography>
                       </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={700}>Rs {order.totalAmount?.toLocaleString()}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleViewOrder(order)} sx={{ color: THEME.primary, bgcolor: alpha(THEME.primary, 0.1) }}>
                        <Visibility fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </ModernTable>
          </Box>
          
          {filteredOrders.length === 0 && (
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <ShoppingBag sx={{ fontSize: 48, color: THEME.textMuted, opacity: 0.3 }} />
              <Typography color={THEME.textMuted} mt={2}>No orders found matching criteria.</Typography>
            </Box>
          )}
        </GlassPanel>

        {/* DRAWER DETAILS */}
        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          {selectedOrder && (
            <DrawerContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h5" fontWeight={700}>Order #{selectedOrder.orderNumber || selectedOrder._id.slice(-6)}</Typography>
                <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: THEME.textMuted }}><Close /></IconButton>
              </Box>

              {/* Order Items */}
              <Box mb={4}>
                 <Typography variant="subtitle2" color={THEME.primary} mb={2}>ORDER ITEMS</Typography>
                 {selectedOrder.items?.map((item, idx) => (
                   <Box key={idx} display="flex" justifyContent="space-between" mb={2} pb={2} borderBottom={`1px solid ${THEME.glassBorder}`}>
                      <Box>
                        <Typography fontWeight={600}>{item.product_id?.name}</Typography>
                        <Typography variant="caption" color={THEME.textMuted}>Qty: {item.quantity} | Unit: Rs {item.price}</Typography>
                      </Box>
                      <Typography fontWeight={700}>Rs {item.price * item.quantity}</Typography>
                   </Box>
                 ))}
                 <Box display="flex" justifyContent="space-between" mt={2}>
                   <Typography fontWeight={700}>Total Amount</Typography>
                   <Typography variant="h6" color={THEME.primary} fontWeight={700}>Rs {selectedOrder.totalAmount?.toLocaleString()}</Typography>
                 </Box>
              </Box>

              {/* Customer & Shipping */}
              <Grid container spacing={3} mb={4}>
                <Grid item xs={6}>
                  <Box p={2} border={`1px solid ${THEME.glassBorder}`} borderRadius={2}>
                    <Stack direction="row" spacing={1} mb={1}>
                       <Person fontSize="small" sx={{ color: THEME.textMuted }} />
                       <Typography variant="caption" color={THEME.textMuted} fontWeight={700}>CUSTOMER</Typography>
                    </Stack>
                    <Typography variant="body2">{selectedOrder.user_id?.name}</Typography>
                    <Typography variant="caption" color={THEME.textMuted}>{selectedOrder.user_id?.email}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box p={2} border={`1px solid ${THEME.glassBorder}`} borderRadius={2}>
                    <Stack direction="row" spacing={1} mb={1}>
                       <LocationOn fontSize="small" sx={{ color: THEME.textMuted }} />
                       <Typography variant="caption" color={THEME.textMuted} fontWeight={700}>SHIPPING TO</Typography>
                    </Stack>
                    <Typography variant="body2">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.zipCode}</Typography>
                    <Typography variant="caption" color={THEME.textMuted}>{selectedOrder.shippingAddress?.street}</Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Timeline */}
              <Typography variant="subtitle2" color={THEME.primary} mb={2}>TRACKING HISTORY</Typography>
              <MuiTimeline position="right" sx={{ p: 0 }}>
                {selectedOrder.trackingHistory?.map((track, index) => (
                   <TimelineItem key={index}>
                     <TimelineSeparator>
                       <TimelineDot sx={{ bgcolor: index === 0 ? THEME.success : THEME.glassBorder }} />
                       {index < selectedOrder.trackingHistory.length - 1 && <TimelineConnector sx={{ bgcolor: THEME.glassBorder }} />}
                     </TimelineSeparator>
                     <TimelineContent>
                       <Typography variant="body2" fontWeight={600}>{track.status}</Typography>
                       <Typography variant="caption" color={THEME.textMuted}>{format(new Date(track.timestamp), "MMM dd, HH:mm")}</Typography>
                     </TimelineContent>
                   </TimelineItem>
                ))}
              </MuiTimeline>

            </DrawerContent>
          )}
        </Drawer>

      </Container>
    </PageWrapper>
  );
}