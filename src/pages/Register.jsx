import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import {
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
  Checkbox,
  FormControlLabel,
  useTheme,
  useMediaQuery,
  Fade
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  ArrowBack as ArrowBackIcon
} from "@mui/icons-material";

// --- Assets ---
// A "Workshop/Mechanic" image to represent building/creating an account
const REGISTER_IMAGE =  "https://images.unsplash.com/photo-1586104139836-0709304372eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";

// --- THEME CONSTANTS ---
const THEME = {
  bg: '#000000', // True Black
  primary: '#FFD700', // Bright Yellow
  textMain: '#FFFFFF',
  textSecondary: '#9ca3af',
  border: 'rgba(255, 255, 255, 0.15)'
};

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { username, email, password, confirmPassword } = formData;

    // 1. Basic Validation
    if (!username.trim() || !email.trim() || !password) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    // 2. Password Match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    // 3. Password Strength
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    // 4. Terms Agreement
    if (!agreedToTerms) {
        setError("You must agree to the Terms & Conditions.");
        setLoading(false);
        return;
    }

    try {
      await api.post("/auth/register", {
        name: username,
        email,
        password,
      });

      navigate("/login", {
        state: { message: "Registration successful! Welcome to the team." }
      });

    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
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
      
      {/* LEFT SIDE - IMAGE (Hidden on Mobile) */}
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), url(${REGISTER_IMAGE})`,
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
                  Join The Crew.
                </Typography>
                <Typography variant="h5" fontWeight={300} sx={{ opacity: 0.9, maxWidth: 550, color: '#d1d5db' }}>
                  Create an account to track orders, save your bike specs, and get exclusive access to new parts.
                </Typography>
              </Box>
            </Box>
          </Fade>
        )}
      </Grid>

      {/* RIGHT SIDE - FORM */}
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
          overflowY: "auto",
          borderLeft: `1px solid ${THEME.border}`
        }}
      >
         {/* Mobile Back Button */}
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
          <Box sx={{ mb: 3 }}>
            <Typography component="h1" variant="h4" fontWeight={800} sx={{ color: '#fff' }}>
              Create Account
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, color: THEME.textSecondary }}>
              Start your journey with The Cycling Depot.
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

          <Box component="form" noValidate onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              
              {/* Full Name */}
              <TextField
                name="username"
                required
                fullWidth
                label="Full Name"
                autoFocus
                value={formData.username}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
                sx={inputStyles}
              />

              {/* Email */}
              <TextField
                required
                fullWidth
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
                sx={inputStyles}
              />

              {/* Password */}
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: THEME.textSecondary }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={inputStyles}
              />

              {/* Confirm Password */}
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword}
                helperText={
                    formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword 
                    ? "Passwords do not match" 
                    : ""
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                }}
                sx={inputStyles}
              />
            </Stack>

            {/* Terms Checkbox */}
            <FormControlLabel
              control={
                <Checkbox 
                    value="remember" 
                    onChange={(e) => setAgreedToTerms(e.target.checked)} 
                    sx={{ 
                        color: THEME.textSecondary,
                        '&.Mui-checked': { color: THEME.primary }
                    }}
                />
              }
              label={<Typography variant="body2" sx={{ color: THEME.textSecondary }}>I agree to the <span style={{color: THEME.primary, cursor: 'pointer'}}>Terms of Service</span> and Privacy Policy</Typography>}
              sx={{ mt: 2 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.8,
                borderRadius: 2,
                fontWeight: 800,
                textTransform: 'none',
                fontSize: '1rem',
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
              {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
            </Button>

            <Divider sx={{ my: 3, '&::before, &::after': { borderColor: 'rgba(255,255,255,0.1)' } }}>
                <Typography variant="body2" sx={{ color: THEME.textSecondary }}>OR SIGN UP WITH</Typography>
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
                Already have an account?{" "}
                <Link to="/login" style={{ textDecoration: "none" }}>
                  <Typography component="span" variant="body2" sx={{ color: THEME.primary, fontWeight: 700 }}>
                    Log in here
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