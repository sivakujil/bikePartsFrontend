import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Stack,
  useTheme,
  useMediaQuery,
  Fade
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  ArrowBack as ArrowBackIcon
} from "@mui/icons-material";

// --- Assets ---
const LOGIN_IMAGE = "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?ixlib=rb-0"; // High-quality cycling/lifestyle image

// --- THEME CONSTANTS ---
const THEME = {
  bg: '#000000', // True Black
  primary: '#FFD700', // Bright Yellow
  textMain: '#FFFFFF',
  textSecondary: '#9ca3af',
  border: 'rgba(255, 255, 255, 0.15)'
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Show success message if coming from registration
  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const user = await login({ email, password });
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "rider") {
        navigate("/rider");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.code === "ECONNABORTED") {
        setError("Connection timeout. Please check internet.");
      } else if (err.response?.status === 400 || err.response?.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Custom Input Styles for Dark Theme
  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      color: THEME.textMain,
      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
      '&:hover fieldset': { borderColor: THEME.primary },
      '&.Mui-focused fieldset': { borderColor: THEME.primary },
    },
    '& .MuiInputLabel-root': { color: THEME.textSecondary },
    '& .MuiInputLabel-root.Mui-focused': { color: THEME.primary },
    '& .MuiSvgIcon-root': { color: THEME.textSecondary }
  };

  return (
    <Grid container component="main" sx={{ height: "100vh", overflow: "hidden", bgcolor: THEME.bg }}>
      
      {/* LEFT SIDE - IMAGE & BRANDING (Hidden on mobile) */}
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)), url(${LOGIN_IMAGE})`,
          backgroundRepeat: "no-repeat",
          backgroundColor: "#000",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: 6,
          color: "white",
        }}
      >
        {!isMobile && (
          <Fade in={true} timeout={1000}>
            <Box>
              <Box 
                display="flex" 
                alignItems="center" 
                gap={1} 
                mb={1} 
                sx={{ 
                    cursor: 'pointer', 
                    color: THEME.textSecondary,
                    transition: '0.3s',
                    '&:hover': { color: THEME.primary }
                }} 
                onClick={() => navigate('/')}
              >
                <ArrowBackIcon />
                <Typography variant="button">Back to Store</Typography>
              </Box>
              <Box sx={{ mt: '30vh' }}>
                 <Typography variant="h2" fontWeight={800} sx={{ letterSpacing: -1, mb: 2, color: '#fff' }}>
                  The Cycling Depot
                </Typography>
                <Typography variant="h5" fontWeight={300} sx={{ opacity: 0.9, maxWidth: 500, color: '#d1d5db' }}>
                  Join our community of pro riders. Premium parts, expert support, and exclusive deals await.
                </Typography>
              </Box>
            </Box>
          </Fade>
        )}
      </Grid>

      {/* RIGHT SIDE - LOGIN FORM */}
      <Grid
        item
        xs={12}
        sm={8}
        md={5}
        component={Paper}
        elevation={6}
        square
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#0F0F11", // Dark Grey/Black Background for Form
          color: THEME.textMain,
          position: "relative",
          borderLeft: `1px solid ${THEME.border}`
        }}
      >
        {/* Mobile Header (Only visible on small screens) */}
        {isMobile && (
            <Box sx={{ position: 'absolute', top: 20, left: 20, color: '#fff' }} onClick={() => navigate('/')}>
                 <IconButton sx={{ color: '#fff' }}><ArrowBackIcon /></IconButton>
            </Box>
        )}

        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            width: "100%",
            maxWidth: "450px",
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography component="h1" variant="h4" fontWeight={800} sx={{ color: '#fff' }}>
              Welcome back
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, color: THEME.textSecondary }}>
              Please enter your details to sign in.
            </Typography>
          </Box>

          {/* Alerts */}
          {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

          {/* Form */}
          <Box component="form" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
                sx={inputStyles}
              />
              
              <Box>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: THEME.textSecondary }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                        ...inputStyles,
                        mb: 1
                    }}
                  />
                  <Box display="flex" justifyContent="flex-end">
                      <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                          <Typography variant="body2" sx={{ color: THEME.primary, fontWeight: 600 }}>
                              Forgot password?
                          </Typography>
                      </Link>
                  </Box>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 2,
                  mb: 2,
                  py: 1.8,
                  borderRadius: 2,
                  fontWeight: 800,
                  fontSize: '1rem',
                  textTransform: 'none',
                  backgroundColor: THEME.primary, // Yellow Button
                  color: '#000000', // Black Text
                  boxShadow: '0 4px 12px rgba(255, 215, 0, 0.2)',
                  '&:hover': {
                    backgroundColor: '#e6c200',
                  },
                  '&:disabled': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.3)'
                  }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
              </Button>
            </Stack>

            <Divider sx={{ my: 3, '&::before, &::after': { borderColor: 'rgba(255,255,255,0.1)' } }}>
                <Typography variant="body2" sx={{ color: THEME.textSecondary }}>OR CONTINUE WITH</Typography>
            </Divider>

            <Stack direction="row" spacing={2}>
                <Button 
                    fullWidth 
                    variant="outlined" 
                    startIcon={<GoogleIcon />}
                    sx={{ 
                        py: 1.5, 
                        borderRadius: 2, 
                        borderColor: 'rgba(255,255,255,0.2)', 
                        color: '#fff',
                        '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.05)' }
                    }}
                >
                    Google
                </Button>
                <Button 
                    fullWidth 
                    variant="outlined" 
                    startIcon={<FacebookIcon />}
                    sx={{ 
                        py: 1.5, 
                        borderRadius: 2, 
                        borderColor: 'rgba(255,255,255,0.2)', 
                        color: '#fff',
                        '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.05)' }
                    }}
                >
                    Facebook
                </Button>
            </Stack>

            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Typography variant="body2" sx={{ color: THEME.textSecondary }}>
                Don't have an account yet?{" "}
                <Link to="/register" style={{ textDecoration: "none" }}>
                  <Typography component="span" variant="body2" sx={{ color: THEME.primary, fontWeight: 700 }}>
                    Sign up for free
                  </Typography>
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}