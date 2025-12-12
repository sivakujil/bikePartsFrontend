import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRiderAuth } from '../context/RiderAuthContext';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  Paper,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
  Grid
} from '@mui/material';
import {
  TwoWheeler as BikeIcon,
  PhoneAndroid as PhoneIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Login as LoginIcon
} from '@mui/icons-material';

const RiderLogin = () => {
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useRiderAuth();
  const navigate = useNavigate();

  // --- தீம் கலர்ஸ் (Theme Colors) ---
  const THEME = {
    bg: '#000000',           // முழு கருப்பு பின்னணி
    card: '#121212',         // கார்ட் நிறம் (Dark Gray)
    yellow: '#FFC107',       // மஞ்சள்
    text: '#FFFFFF',         // வெள்ளை எழுத்து
    textGray: '#B0B0B0',     // சாம்பல் நிற எழுத்து
    border: '#333333'
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const phone = formData.phone.trim();
    const password = formData.password.trim();

    if (!phone || !password) {
      setError('Mobile number and Password are required');
      return;
    }

    if (phone.length < 10) {
      setError('Please enter a valid mobile number');
      return;
    }

    setLoading(true);
    try {
      const res = await login(phone, password);
      if(res.accessToken) {
         navigate('/rider/dashboard');
      } else {
         setError('Login Failed');
      }
    } catch (err) {
      setError('Invalid Credentials or Server Error');
    } finally {
      setLoading(false);
    }
  };

  // --- Input Field Style (Custom Design) ---
  const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#1E1E1E',
      color: THEME.text,
      borderRadius: '8px',
      '& fieldset': { borderColor: THEME.border },
      '&:hover fieldset': { borderColor: '#555' },
      '&.Mui-focused fieldset': { borderColor: THEME.yellow }, // க்ளிக் செய்தால் மஞ்சள் பார்டர்
    },
    '& .MuiInputLabel-root': { color: THEME.textGray },
    '& .MuiInputLabel-root.Mui-focused': { color: THEME.yellow },
    '& .MuiInputAdornment-root .MuiSvgIcon-root': { color: THEME.textGray },
  };

  return (
    <Box sx={{ 
      minHeight: '90vh', // Navbar தவிர்த்து மீதி இடம்
      bgcolor: THEME.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2
    }}>
      
      <Container maxWidth="md">
        <Grid container spacing={4} alignItems="center">
          
          {/* பகுதி 1: இடது பக்கம் (Welcome Text - Mobile-ல் மறையும்) */}
          <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ mb: 4 }}>
               <Box sx={{ 
                 display: 'inline-flex', 
                 p: 2, 
                 bgcolor: 'rgba(255, 193, 7, 0.1)', 
                 borderRadius: '50%', 
                 mb: 2 
               }}>
                 <BikeIcon sx={{ fontSize: 60, color: THEME.yellow }} />
               </Box>
               <Typography variant="h3" sx={{ fontWeight: 'bold', color: THEME.text, mb: 1 }}>
                 Rider<span style={{ color: THEME.yellow }}>.Go</span>
               </Typography>
               <Typography variant="h6" sx={{ color: THEME.textGray, mb: 4 }}>
                 Join our fleet. Deliver faster. Earn smarter.
               </Typography>
               
               {/* Features List */}
               <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                 {['Fast Payouts', 'Flexible Hours', 'Rider Insurance'].map((item) => (
                   <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                     <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: THEME.yellow }} />
                     <Typography sx={{ color: '#DDD' }}>{item}</Typography>
                   </Box>
                 ))}
               </Box>
            </Box>
          </Grid>

          {/* பகுதி 2: வலது பக்கம் (Login Form) */}
          <Grid item xs={12} md={6}>
            <Paper elevation={10} sx={{ 
              p: 4, 
              bgcolor: THEME.card, 
              borderRadius: 4, 
              border: `1px solid ${THEME.border}`,
              boxShadow: '0 8px 40px rgba(0,0,0,0.5)'
            }}>
              
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: THEME.text }}>
                  Rider Sign In
                </Typography>
                <Typography variant="body2" sx={{ color: THEME.textGray }}>
                  Enter your credentials to start riding
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(255, 82, 82, 0.1)', color: '#ff5252' }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  sx={{ mb: 3, ...textFieldStyle }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><PhoneIcon /></InputAdornment>,
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  sx={{ mb: 1, ...textFieldStyle }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><LockIcon /></InputAdornment>,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: '#777' }}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <FormControlLabel
                    control={<Checkbox sx={{ color: '#555', '&.Mui-checked': { color: THEME.yellow } }} defaultChecked />}
                    label={<Typography variant="body2" sx={{ color: THEME.textGray }}>Remember me</Typography>}
                  />
                  <Link to="/rider/forgot-password" style={{ color: THEME.yellow, textDecoration: 'none', fontSize: '0.9rem' }}>
                    Forgot?
                  </Link>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  disabled={loading}
                  startIcon={!loading && <LoginIcon />}
                  sx={{
                    bgcolor: THEME.yellow,
                    color: '#000',
                    fontWeight: 'bold',
                    py: 1.5,
                    fontSize: '1rem',
                    borderRadius: '8px',
                    '&:hover': { bgcolor: '#FFD54F' },
                    '&:disabled': { bgcolor: '#333', color: '#666' }
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Start Engine'}
                </Button>
              </form>
              
              <Box sx={{ mt: 3, textAlign: 'center', pt: 2, borderTop: '1px solid #333' }}>
                 <Typography variant="body2" sx={{ color: THEME.textGray }}>
                   Don't have an account?{' '}
                   <Link to="/rider/register" style={{ color: THEME.yellow, fontWeight: 'bold', textDecoration: 'none' }}>
                     Join Now
                   </Link>
                 </Typography>
              </Box>

            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default RiderLogin;