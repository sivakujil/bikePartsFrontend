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
  Shield, TwoWheeler, Delete, VerifiedUser, Block
} from "@mui/icons-material";
import { format } from "date-fns";
import api from "../../services/api";

// === 1. THEME CONFIGURATION ===
const THEME = {
  bg: '#0F172A', // Deep Navy
  glass: 'rgba(30, 41, 59, 0.6)', // Glass Card
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  primary: '#38BDF8', // Cyan (Standard)
  admin: '#F43F5E', // Rose (Admin)
  rider: '#F59E0B', // Amber (Rider)
  user: '#10B981', // Emerald (User)
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

// Dynamic Badge for Roles
const RoleBadge = styled(Chip)(({ rolecolor }) => ({
  backgroundColor: alpha(rolecolor, 0.15),
  color: rolecolor,
  fontWeight: 700,
  borderRadius: '8px',
  border: `1px solid ${alpha(rolecolor, 0.3)}`,
  textTransform: 'uppercase',
  fontSize: '0.7rem',
  height: '24px',
  '& .MuiChip-icon': { color: rolecolor }
}));

const CustomTab = styled(Tab)({
  color: THEME.textMuted,
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1rem',
  minHeight: '48px',
  '&.Mui-selected': { color: THEME.primary }
});

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [userDialog, setUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  
  const [newUser, setNewUser] = useState({
    name: "", email: "", password: "", role: "user", permissions: [],
  });

  useEffect(() => { loadUsers(); }, []);
  useEffect(() => { applyFilters(); }, [users, search, tabValue]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/users");
      setUsers(response.data);
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  const applyFilters = () => {
    let filtered = [...users];
    
    // Tab Filter
    if (tabValue === 1) filtered = filtered.filter(u => u.role === 'admin');
    if (tabValue === 2) filtered = filtered.filter(u => u.role === 'rider');

    // Search Filter
    if (search) {
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase()) ||
        user.role?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredUsers(filtered);
  };

  // ... (Keep your existing handlers: create, update, delete, toggleStatus)
  const handleCreateUser = async () => {
    try { await api.post("/admin/users", newUser); loadUsers(); setUserDialog(false); } catch (e) { console.error(e); }
  };
  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    try { await api.put(`/admin/users/${selectedUser._id}`, selectedUser); loadUsers(); setUserDialog(false); } catch (e) { console.error(e); }
  };

  const openUserDialog = (user = null, isEdit = false) => {
    setSelectedUser(user);
    setEditMode(isEdit);
    setUserDialog(true);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin": return THEME.admin;
      case "rider": return THEME.rider;
      default: return THEME.user;
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin": return <AdminPanelSettings fontSize="small" />;
      case "rider": return <TwoWheeler fontSize="small" />;
      default: return <Shield fontSize="small" />;
    }
  };

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    riders: users.filter(u => u.role === 'rider').length,
    active: users.filter(u => u.isActive !== false).length
  };

  if (loading) return <Box sx={{ bgcolor: THEME.bg, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LinearProgress sx={{ width: 200, color: THEME.primary }} /></Box>;

  return (
    <PageWrapper>
      <Container maxWidth="xl">
        
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h4" fontWeight={800}>User Management</Typography>
            <Typography variant="body2" color={THEME.textMuted}>Manage access, roles, and driver profiles.</Typography>
          </Box>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => openUserDialog()}
            sx={{ 
              bgcolor: THEME.primary, color: '#000', fontWeight: 'bold', 
              borderRadius: '12px', padding: '10px 24px',
              '&:hover': { bgcolor: alpha(THEME.primary, 0.8) }
            }}
          >
            Add User
          </Button>
        </Box>

        {/* STATS CARDS */}
        <Grid container spacing={3} mb={4}>
          {[
            { label: 'Total Users', val: stats.total, icon: <Person />, color: THEME.primary },
            { label: 'Administrators', val: stats.admins, icon: <AdminPanelSettings />, color: THEME.admin },
            { label: 'Delivery Riders', val: stats.riders, icon: <TwoWheeler />, color: THEME.rider },
            { label: 'Active Accounts', val: stats.active, icon: <VerifiedUser />, color: THEME.user },
          ].map((item, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
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
              <CustomTab label="All Users" />
              <CustomTab label="Admins Only" />
              <CustomTab label="Riders Only" />
            </Tabs>
            
            <SearchField
              placeholder="Search name, email..."
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
                  <TableCell>User Identity</TableCell>
                  <TableCell>System Role</TableCell>
                  <TableCell>Account Status</TableCell>
                  <TableCell>Rider Rating</TableCell>
                  <TableCell>Last Active</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => {
                  const color = getRoleColor(user.role);
                  return (
                    <TableRow key={user._id}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar sx={{ bgcolor: color, color: '#fff', fontWeight: 'bold' }}>
                            {user.name?.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={700}>{user.name}</Typography>
                            <Typography variant="caption" color={THEME.textMuted}>{user.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <RoleBadge 
                          label={user.role} 
                          rolecolor={color} 
                          icon={getRoleIcon(user.role)} 
                        />
                      </TableCell>
                      <TableCell>
                         <Chip 
                           label={user.isActive !== false ? "Active" : "Banned"} 
                           size="small"
                           sx={{ 
                             bgcolor: user.isActive !== false ? alpha(THEME.user, 0.1) : alpha(THEME.admin, 0.1),
                             color: user.isActive !== false ? THEME.user : THEME.admin,
                             fontWeight: 700
                           }}
                         />
                      </TableCell>
                      <TableCell>
                        {user.role === 'rider' ? (
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <Typography fontWeight={700} color={THEME.rider}>{user.rating?.toFixed(1) || 'N/A'}</Typography>
                            <Typography variant="caption" color={THEME.textMuted}>★</Typography>
                          </Box>
                        ) : <Typography color={THEME.textMuted}>-</Typography>}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color={THEME.textMuted}>
                          {user.lastLogin ? format(new Date(user.lastLogin), "MMM dd, HH:mm") : "Never"}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Edit User">
                            <IconButton size="small" onClick={() => openUserDialog(user, true)} sx={{ color: THEME.primary }}>
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {user.role !== 'admin' && (
                            <Tooltip title={user.isActive !== false ? "Ban User" : "Activate User"}>
                              <IconButton size="small" sx={{ color: user.isActive !== false ? THEME.admin : THEME.user }}>
                                {user.isActive !== false ? <Block fontSize="small" /> : <VerifiedUser fontSize="small" />}
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </ModernTable>
          </Box>
          
          {filteredUsers.length === 0 && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color={THEME.textMuted}>No users found matching criteria.</Typography>
            </Box>
          )}
        </GlassCard>

        {/* === DIALOG FOR ADD/EDIT USER === */}
        <Dialog 
          open={userDialog} 
          onClose={() => setUserDialog(false)} 
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
            {editMode ? "Edit User Profile" : "Create New User"}
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth label="Full Name" variant="filled"
                  value={editMode ? selectedUser?.name : newUser.name}
                  onChange={(e) => editMode ? setSelectedUser({...selectedUser, name: e.target.value}) : setNewUser({...newUser, name: e.target.value})}
                  InputProps={{ sx: { color: '#fff', bgcolor: alpha('#fff', 0.05) } }}
                  InputLabelProps={{ sx: { color: THEME.textMuted } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth label="Email Address" variant="filled" type="email"
                  value={editMode ? selectedUser?.email : newUser.email}
                  onChange={(e) => editMode ? setSelectedUser({...selectedUser, email: e.target.value}) : setNewUser({...newUser, email: e.target.value})}
                  InputProps={{ sx: { color: '#fff', bgcolor: alpha('#fff', 0.05) } }}
                  InputLabelProps={{ sx: { color: THEME.textMuted } }}
                />
              </Grid>
              {!editMode && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth label="Password" variant="filled" type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    InputProps={{ sx: { color: '#fff', bgcolor: alpha('#fff', 0.05) } }}
                    InputLabelProps={{ sx: { color: THEME.textMuted } }}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <FormControl fullWidth variant="filled">
                  <InputLabel sx={{ color: THEME.textMuted }}>System Role</InputLabel>
                  <Select
                    value={editMode ? selectedUser?.role : newUser.role}
                    onChange={(e) => editMode ? setSelectedUser({...selectedUser, role: e.target.value}) : setNewUser({...newUser, role: e.target.value})}
                    sx={{ color: '#fff', bgcolor: alpha('#fff', 0.05), '& .MuiSvgIcon-root': {color: '#fff'} }}
                    MenuProps={{ PaperProps: { sx: { bgcolor: '#1E293B', color: '#fff' } } }}
                  >
                    <MenuItem value="user">Customer</MenuItem>
                    <MenuItem value="rider">Delivery Rider</MenuItem>
                    <MenuItem value="admin">Administrator</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Admin Permissions Toggle */}
              {editMode && selectedUser?.role === "admin" && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color={THEME.primary} sx={{ mt: 1, mb: 1 }}>ACCESS PERMISSIONS</Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {["products", "orders", "customers", "riders", "reports"].map((perm) => (
                      <FormControlLabel
                        key={perm}
                        control={<Switch color="primary" checked={selectedUser.permissions?.includes(perm) || false} />}
                        label={<Typography fontSize="0.9rem" color={THEME.textMuted}>{perm}</Typography>}
                        onChange={(e) => {
                           const current = selectedUser.permissions || [];
                           const updated = e.target.checked ? [...current, perm] : current.filter(p => p !== perm);
                           setSelectedUser({...selectedUser, permissions: updated});
                        }}
                      />
                    ))}
                  </Box>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: `1px solid ${THEME.glassBorder}` }}>
            <Button onClick={() => setUserDialog(false)} sx={{ color: THEME.textMuted }}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={editMode ? handleUpdateUser : handleCreateUser}
              sx={{ bgcolor: THEME.primary, color: '#000', fontWeight: 'bold' }}
            >
              {editMode ? "Save Changes" : "Create User"}
            </Button>
          </DialogActions>
        </Dialog>

      </Container>
    </PageWrapper>
  );
}