import React, { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Box, CircularProgress, Typography } from "@mui/material";

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { googleLogin, facebookLogin } = useContext(AuthContext);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');

      if (!code) {
        console.error('No authorization code received');
        navigate('/login');
        return;
      }

      try {
        let user;
        if (window.location.pathname.includes('google')) {
          user = await googleLogin(code);
        } else if (window.location.pathname.includes('facebook')) {
          user = await facebookLogin(code);
        } else {
          throw new Error('Unknown OAuth provider');
        }

        // Redirect based on user role
        if (user.role === "admin") {
          navigate("/admin");
        } else if (user.role === "rider") {
          navigate("/rider");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, navigate, googleLogin, facebookLogin]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <CircularProgress size={60} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Completing sign in...
      </Typography>
    </Box>
  );
};

export default OAuthCallback;