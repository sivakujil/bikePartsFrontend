import React, { useEffect, useState } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableHead, TableRow,
  Button, TextField, Grid, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel,
  Avatar, Tabs, Tab, IconButton, Chip, LinearProgress, Container, Stack, Fade, Tooltip, InputAdornment
} from "@mui/material";
import { styled, alpha } from '@mui/system';
import {
  Visibility, Edit, Add, Search, Person, AdminPanelSettings,
  Shield, TwoWheeler, Delete, VerifiedUser, Block, CheckCircle, Pending, Schedule
} from "@mui/icons-material";
import { format } from "date-fns";
import { getAllProductRequests, replyToProductRequest } from "../../services/productRequestService";

// === 1. THEME CONFIGURATION ===
const THEME = {
  bg: '#0F172A', // Deep Navy
  glass: 'rgba(30, 41, 59, 0.6)', // Glass Card
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  primary: '#38BDF8', // Cyan (Standard)
  success: '#10B981', // Emerald
  warning: '#F59E0B', // Amber
  error: '#EF4444', // Red
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

const GlassCard = styled(Box)({
  background: THEME.glass,
  backdropFilter: 'blur(12px)',
  border: `1px solid ${THEME.glassBorder}`,
  borderRadius: '20px',
  padding: '24px',
  height: '100%',
  overflow: 'hidden'
});

const StatBox = styled(Box)(({ color }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '& .icon-wrapper': {
    width: '48px', height: '48px',
    borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: alpha(color, 0.15),
    color: color,
    border: `1px solid ${alpha(color, 0.3)}`
  }
}));

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

// Status Badge for Requests
const StatusBadge = styled(Chip)(({ statuscolor }) => ({
  backgroundColor: alpha(statuscolor, 0.15),
  color: statuscolor,
  fontWeight: 700,
  borderRadius: '8px',
  border: `1px solid ${alpha(statuscolor, 0.3)}`,
  textTransform: 'uppercase',
  fontSize: '0.7rem',
  height: '24px',
  '& .MuiChip-icon': { color: statuscolor }
}));

const CustomTab = styled(Tab)({
  color: THEME.textMuted,
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1rem',
  minHeight: '48px',
  '&.Mui-selected': { color: THEME.primary }
});

export default function ProductRequests() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [replyDialog, setReplyDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [estimatedDate, setEstimatedDate] = useState("");

  useEffect(() => { loadRequests(); }, []);
  useEffect(() => { applyFilters(); }, [requests, search, tabValue]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await getAllProductRequests();
      setRequests(response.requests || []);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const applyFilters = () => {
    let filtered = [...requests];

    // Tab Filter
    if (tabValue === 1) filtered = filtered.filter(r => r.status === 'pending');
    if (tabValue === 2) filtered = filtered.filter(r => r.status === 'replied');

    // Search Filter
    if (search) {
      filtered = filtered.filter(request =>
        request.productId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        request.messageFromUser?.toLowerCase().includes(search.toLowerCase()) ||
        request.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        request.userId?.email?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredRequests(filtered);
  };


  const handleReply = async () => {
    try {
      await replyToProductRequest(selectedRequest._id, replyMessage, estimatedDate);
      loadRequests();
      setReplyDialog(false);
      setSelectedRequest(null);
      setReplyMessage("");
      setEstimatedDate("");
    } catch (error) { console.error(error); }
  };

  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this product request?')) return;
    try {
      await api.delete(`/product-requests/${requestId}`);
      loadRequests();
    } catch (error) { console.error(error); }
  };


  const openReplyDialog = (request) => {
    setSelectedRequest(request);
    setReplyMessage(request.adminReply || "");
    setEstimatedDate(request.estimatedDate ? request.estimatedDate.split('T')[0] : "");
    setReplyDialog(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "replied": return THEME.success;
      case "pending": return THEME.primary;
      default: return THEME.textMuted;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "replied": return <CheckCircle fontSize="small" />;
      case "pending": return <Pending fontSize="small" />;
      default: return null;
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    replied: requests.filter(r => r.status === 'replied').length
  };

  if (loading) return <Box sx={{ bgcolor: THEME.bg, height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><LinearProgress sx={{ width: 200, color: THEME.primary }} /></Box>;

  return (
    <PageWrapper>
      <Container maxWidth="xl">

        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h4" fontWeight={800}>Product Requests</Typography>
            <Typography variant="body2" color={THEME.textMuted}>Manage customer product requests and fulfillment status.</Typography>
          </Box>
        </Box>

        {/* STATS CARDS */}
        <Grid container spacing={3} mb={4}>
          {[
            { label: 'Total Requests', val: stats.total, icon: <Person />, color: THEME.primary },
            { label: 'Pending', val: stats.pending, icon: <Pending />, color: THEME.primary },
            { label: 'Replied', val: stats.replied, icon: <CheckCircle />, color: THEME.success },
          ].map((item, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <GlassCard sx={{ p: 3 }}>
                <StatBox color={item.color}>
                  <Box>
                    <Typography variant="h4" fontWeight={700}>{item.val}</Typography>
                    <Typography variant="body2" color={THEME.textMuted}>{item.label}</Typography>
                  </Box>
                  <Box className="icon-wrapper">{item.icon}</Box>
                </StatBox>
              </GlassCard>
            </Grid>
          ))}
        </Grid>

        {/* MAIN CONTENT */}
        <GlassCard sx={{ p: 0 }}>

          {/* Controls Bar */}
          <Box sx={{ p: 3, borderBottom: `1px solid ${THEME.glassBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} TabIndicatorProps={{ sx: { bgcolor: THEME.primary } }}>
              <CustomTab label="All Requests" />
              <CustomTab label="Pending" />
              <CustomTab label="Replied" />
            </Tabs>

            <SearchField
              placeholder="Search requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Search sx={{ color: THEME.textMuted }} /></InputAdornment>
              }}
              size="small"
              sx={{ width: 300 }}
            />
          </Box>

          {/* Table */}
          <Box sx={{ overflowX: 'auto' }}>
            <ModernTable>
              <TableHead>
                <TableRow>
                  <TableCell>Product Requested</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={700} color={THEME.primary}>
                          {request.productId?.name}
                        </Typography>
                        <Typography variant="caption" color={THEME.textMuted} sx={{ display: 'block', mt: 0.5 }}>
                          {request.messageFromUser && (request.messageFromUser.length > 100 ? `${request.messageFromUser.substring(0, 100)}...` : request.messageFromUser)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: alpha(THEME.text, 0.1), fontSize: '0.8rem' }}>
                          <Person fontSize="inherit" />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={700}>
                            {request.userId?.name || 'Anonymous'}
                          </Typography>
                          <Typography variant="caption" color={THEME.textMuted}>
                            {request.userId?.email || 'No email'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        label={request.status}
                        statuscolor={getStatusColor(request.status)}
                        icon={getStatusIcon(request.status)}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color={THEME.textMuted}>
                        {format(new Date(request.createdAt), "MMM dd, yyyy")}
                      </Typography>
                      <Typography variant="caption" color={THEME.textMuted}>
                        {format(new Date(request.createdAt), "HH:mm")}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Reply">
                          <IconButton size="small" onClick={() => openReplyDialog(request)} sx={{ color: THEME.primary }}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Request">
                          <IconButton size="small" sx={{ color: THEME.error }} onClick={() => handleDeleteRequest(request._id)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </ModernTable>
          </Box>

          {filteredRequests.length === 0 && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color={THEME.textMuted}>No product requests found matching criteria.</Typography>
            </Box>
          )}
        </GlassCard>


        {/* REPLY DIALOG */}
        <Dialog
          open={replyDialog}
          onClose={() => setReplyDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: '#1E293B',
              color: '#fff',
              borderRadius: '20px',
              border: `1px solid ${THEME.glassBorder}`
            }
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, borderBottom: `1px solid ${THEME.glassBorder}` }}>
            Reply to Product Request
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Typography variant="body2" color={THEME.textMuted} sx={{ mb: 2 }}>
              Product: {selectedRequest?.productId?.name}
            </Typography>
            <Typography variant="body2" color={THEME.textMuted} sx={{ mb: 2 }}>
              User Message: {selectedRequest?.messageFromUser || "No message"}
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="filled"
              label="Admin Reply Message"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              sx={{
                '& .MuiInputBase-root': { color: '#fff', bgcolor: alpha('#fff', 0.05) },
                '& .MuiInputLabel-root': { color: THEME.textMuted },
                '& .MuiFilledInput-root': { bgcolor: alpha('#fff', 0.05) },
                mb: 2
              }}
            />
            <TextField
              fullWidth
              type="date"
              variant="filled"
              label="Estimated Availability Date"
              value={estimatedDate}
              onChange={(e) => setEstimatedDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiInputBase-root': { color: '#fff', bgcolor: alpha('#fff', 0.05) },
                '& .MuiInputLabel-root': { color: THEME.textMuted },
                '& .MuiFilledInput-root': { bgcolor: alpha('#fff', 0.05) }
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: `1px solid ${THEME.glassBorder}` }}>
            <Button onClick={() => setReplyDialog(false)} sx={{ color: THEME.textMuted }}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleReply}
              sx={{ bgcolor: THEME.primary, color: '#000', fontWeight: 'bold' }}
            >
              Send Reply
            </Button>
          </DialogActions>
        </Dialog>

      </Container>
    </PageWrapper>
  );
}