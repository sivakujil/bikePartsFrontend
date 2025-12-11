import React from 'react';
import {
  Box, Container, Grid, Typography, Card, CardContent,
  Avatar, LinearProgress, TextField, Button, IconButton,
  Chip, Divider, Paper
} from '@mui/material';
import {
  Security as SecurityIcon,
  Inventory2 as InventoryIcon,
  TrendingUp as TrendingIcon,
  AttachMoney as MoneyIcon,
  EmojiEvents as CrownIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Logout as LogoutIcon,
  ArrowBack as BackIcon
} from '@mui/icons-material';

const AdminProfile = () => {

  // --- Theme Colors ---
  const THEME = {
    bg: '#121212',           // கருப்பு பின்னணி
    card: '#1E1E1E',         // கார்ட் நிறம்
    yellow: '#FFC107',       // முக்கிய மஞ்சள் நிறம்
    text: '#FFFFFF',         // வெள்ளை எழுத்து
    textGray: '#B0B0B0',     // சாம்பல் நிற எழுத்து
    success: '#4CAF50',      // பச்சை (Growth)
    border: '#333333'
  };

  // --- Dummy Data (From Screenshot) ---
  const adminData = {
    name: "Admin1",
    role: "System Administrator",
    level: "99+",
    xp: 95, // 95/100
    phone: "+94 77 123 4567",
    email: "admin1@gmail.com",
    stats: {
      inventory: "1,247",
      orders: "5,689",
      revenue: "Rs 1.25 M"
    }
  };

  // --- Input Styles (Dark Mode) ---
  const inputSx = {
    '& .MuiOutlinedInput-root': {
      color: '#FFF',
      bgcolor: '#000',
      '& fieldset': { borderColor: '#333' },
      '&:hover fieldset': { borderColor: '#555' },
      '&.Mui-focused fieldset': { borderColor: THEME.yellow },
    },
    '& .MuiInputLabel-root': { color: '#888' },
    '& .MuiInputLabel-root.Mui-focused': { color: THEME.yellow },
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: THEME.bg, color: THEME.text, p: 3 }}>
      <Container maxWidth="lg">
        
        {/* HEADER SECTION */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ color: THEME.textGray, border: '1px solid #333' }}>
              <BackIcon />
            </IconButton>
            <Typography variant="h5" fontWeight="bold">
              Admin <span style={{ color: THEME.yellow }}>Portal</span>
            </Typography>
          </Box>
          <Button 
            variant="outlined" 
            startIcon={<LogoutIcon />}
            sx={{ color: '#FF5252', borderColor: '#FF5252', '&:hover': { bgcolor: 'rgba(255,82,82,0.1)' } }}
          >
            Logout
          </Button>
        </Box>

        <Grid container spacing={3}>
          
          {/* 1. IDENTITY CARD (Crown & XP) */}
          <Grid item xs={12} md={5}>
            <Card sx={{ bgcolor: THEME.card, borderRadius: 4, border: `1px solid ${THEME.border}`, height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', py: 5 }}>
                
                {/* Avatar with Glow */}
                <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                  <Avatar 
                    sx={{ 
                      width: 100, height: 100, 
                      bgcolor: 'rgba(255, 193, 7, 0.1)', 
                      color: THEME.yellow,
                      border: `2px solid ${THEME.yellow}`,
                      boxShadow: `0 0 20px rgba(255, 193, 7, 0.3)`
                    }}
                  >
                    <CrownIcon sx={{ fontSize: 50 }} />
                  </Avatar>
                  <Chip 
                    label="Lv. 99+" 
                    size="small"
                    sx={{ 
                      position: 'absolute', bottom: -5, left: '50%', transform: 'translate(-50%)',
                      bgcolor: THEME.yellow, color: '#000', fontWeight: 'bold'
                    }} 
                  />
                </Box>

                <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                  {adminData.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1, mb: 3 }}>
                  <SecurityIcon sx={{ fontSize: 16, color: THEME.textGray }} />
                  <Typography variant="body2" color={THEME.textGray}>
                    {adminData.role}
                  </Typography>
                </Box>

                {/* XP Progress Bar */}
                <Box sx={{ px: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" color={THEME.textGray}>XP to Master</Typography>
                    <Typography variant="caption" color={THEME.yellow}>95 / 100</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={adminData.xp} 
                    sx={{ 
                      height: 8, borderRadius: 5, bgcolor: '#333',
                      '& .MuiLinearProgress-bar': { bgcolor: THEME.yellow }
                    }} 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* 2. STATS & SETTINGS */}
          <Grid item xs={12} md={7}>
            
            {/* Stats Grid */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {/* Inventory */}
              <Grid item xs={4}>
                <Paper sx={{ p: 2, bgcolor: THEME.card, borderRadius: 3, border: `1px solid ${THEME.border}` }}>
                  <InventoryIcon sx={{ color: THEME.textGray, mb: 1 }} />
                  <Typography variant="h5" fontWeight="bold">{adminData.stats.inventory}</Typography>
                  <Typography variant="caption" color={THEME.textGray}>Inventory</Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: THEME.success }}>
                    <TrendingIcon sx={{ fontSize: 12, verticalAlign: 'middle' }} /> +15%
                  </Typography>
                </Paper>
              </Grid>
              
              {/* Orders */}
              <Grid item xs={4}>
                <Paper sx={{ p: 2, bgcolor: THEME.card, borderRadius: 3, border: `1px solid ${THEME.border}` }}>
                  <TrendingIcon sx={{ color: THEME.textGray, mb: 1 }} />
                  <Typography variant="h5" fontWeight="bold">{adminData.stats.orders}</Typography>
                  <Typography variant="caption" color={THEME.textGray}>YTD Orders</Typography>
                  <Box sx={{height: 18}} /> {/* Spacer */}
                </Paper>
              </Grid>

              {/* Revenue (Highlighted) */}
              <Grid item xs={4}>
                <Paper sx={{ 
                  p: 2, 
                  bgcolor: THEME.yellow, 
                  color: '#000',
                  borderRadius: 3 
                }}>
                  <MoneyIcon sx={{ mb: 1, opacity: 0.7 }} />
                  <Typography variant="h6" fontWeight="900">{adminData.stats.revenue}</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 'bold' }}>Total Revenue</Typography>
                  <Typography variant="caption" sx={{ display: 'block', fontWeight: 'bold' }}>
                    +22.4%
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Settings Form */}
            <Card sx={{ bgcolor: THEME.card, borderRadius: 4, border: `1px solid ${THEME.border}` }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold">
                     Admin Settings
                  </Typography>
                  <Chip label="Secure Line" size="small" icon={<SecurityIcon style={{ fontSize:14 }} />} sx={{ bgcolor: '#333', color: '#BBB' }} />
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="Secure Line (Phone)" 
                      defaultValue={adminData.phone} 
                      sx={inputSx} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="Admin Email" 
                      defaultValue={adminData.email} 
                      sx={inputSx} 
                    />
                  </Grid>
                  <Grid item xs={12}>
                     <Button 
                       variant="contained" 
                       fullWidth
                       startIcon={<SaveIcon />}
                       sx={{ 
                         bgcolor: THEME.yellow, color: '#000', fontWeight: 'bold', py: 1.5,
                         '&:hover': { bgcolor: '#FFD54F' }
                       }}
                     >
                       Save Changes
                     </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminProfile;