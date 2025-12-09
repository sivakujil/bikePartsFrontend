import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Paper,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Fade,
  Grid
} from "@mui/material";
import {
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon
} from "@mui/icons-material";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setOtp("");
    setLoading(true);

    if (!email) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
      setSuccess("OTP sent to your email successfully!");
      setOtp(response.data.otp);
    } catch (err) {
      console.error("Forgot password error:", err);
      if (err.response?.status === 404) {
        setError("User not found with this email address");
      } else {
        setError("Failed to generate reset token. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container component="main" sx={{ height: "100vh", overflow: "hidden" }}>
      {/* LEFT SIDE - IMAGE & BRANDING (Hidden on mobile) */}
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?ixlib=rb-0)`,
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) => t.palette.grey[900],
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
              <Box display="flex" alignItems="center" gap={1} mb={1} sx={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                <ArrowBackIcon />
                <Typography variant="button">Back to Store</Typography>
              </Box>
              <Box sx={{ mt: '30vh' }}>
                <Typography variant="h2" fontWeight={800} sx={{ letterSpacing: -1, mb: 2 }}>
                  Reset Your Password
                </Typography>
                <Typography variant="h5" fontWeight={300} sx={{ opacity: 0.9, maxWidth: 500 }}>
                  Enter your email to receive a password reset token.
                </Typography>
              </Box>
            </Box>
          </Fade>
        )}
      </Grid>

      {/* RIGHT SIDE - FORGOT PASSWORD FORM */}
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
          bgcolor: "background.paper",
          position: "relative"
        }}
      >
        {/* Mobile Header */}
        {isMobile && (
          <Box sx={{ position: 'absolute', top: 20, left: 20 }} onClick={() => navigate('/')}>
            <ArrowBackIcon />
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
            <Typography component="h1" variant="h4" fontWeight={800} color="text.primary">
              Forgot Password
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Enter your email address and we'll send you a reset token.
            </Typography>
          </Box>

          {/* Alerts */}
          {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

          {/* Form */}
          <Box component="form" noValidate onSubmit={handleSubmit}>
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
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: 2 }
              }}
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
                fontWeight: 700,
                fontSize: '1rem',
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)'
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Send OTP"}
            </Button>
          </Box>

          {/* OTP Display */}
          {otp && (
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2, width: '100%' }}>
              <Typography variant="h6" color="primary" gutterBottom>
                Your OTP:
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  bgcolor: 'white',
                  p: 2,
                  borderRadius: 1,
                  border: '1px solid #ddd',
                  textAlign: 'center',
                  letterSpacing: 2
                }}
              >
                {otp}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Copy this OTP and use it to reset your password.
              </Typography>
              <Button
                component={Link}
                to="/reset-password"
                variant="outlined"
                sx={{ mt: 2, borderRadius: 2 }}
              >
                Go to Reset Password
              </Button>
            </Box>
          )}

          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Remember your password?{" "}
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Typography component="span" variant="body2" color="primary" fontWeight={700}>
                  Sign in
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}