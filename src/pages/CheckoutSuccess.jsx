import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Button, CircularProgress, Alert, Grid, Stack, Fade, Avatar } from "@mui/material";
import { styled, keyframes, alpha } from '@mui/system';
import { CheckCircle, LocalShipping, ReceiptLong, ArrowForward, ShoppingBag, Email } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

// === 1. THEME (Sleek Yellow & Black) ===
const THEME = {
  bg: '#000000', // True Black
  glass: 'rgba(20, 20, 20, 0.9)', // Dark Glass
  glassBorder: 'rgba(255, 215, 0, 0.2)', // Yellow Border
  primary: '#FFD700', // Bright Yellow
  success: '#FFD700', // Yellow for Success (Theme consistent)
  gold: '#FDB931', // Metallic Gold
  text: '#FFFFFF',
  textMuted: '#9ca3af', // Cool Grey
};

// === 2. ANIMATIONS ===
const popIn = keyframes`
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// === 3. STYLED COMPONENTS ===

const PageWrapper = styled(Box)({
  backgroundColor: THEME.bg,
  minHeight: '100vh',
  color: THEME.text,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  // Dark Gradient
  backgroundImage: `radial-gradient(circle at 50% 0%, #1a1a1a 0%, ${THEME.bg} 80%)`,
  padding: '20px'
});

const SuccessCard = styled(Box)({
  background: THEME.glass,
  backdropFilter: 'blur(16px)',
  border: `1px solid ${THEME.glassBorder}`,
  borderRadius: '24px',
  padding: '40px',
  textAlign: 'center',
  maxWidth: '600px',
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
  animation: `${popIn} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)`
});

const IconCircle = styled(Box)({
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  background: alpha(THEME.success, 0.15), // Yellow Tint
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 24px auto',
  color: THEME.success, // Yellow Icon
  animation: `${float} 3s ease-in-out infinite`,
  border: `1px solid ${alpha(THEME.success, 0.3)}`
});

const ReceiptBox = styled(Box)({
  background: 'rgba(10, 10, 10, 0.6)',
  border: `1px dashed ${THEME.glassBorder}`,
  borderRadius: '16px',
  padding: '24px',
  marginTop: '32px',
  textAlign: 'left'
});

const StepBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  background: 'rgba(255,255,255,0.03)',
  padding: '12px 16px',
  borderRadius: '12px',
  marginBottom: '8px',
  border: '1px solid rgba(255,255,255,0.05)'
});

export default function CheckoutSuccess() {
    const { sessionId } = useParams();
    const [loading, setLoading] = useState(true);
    const [orderDetails, setOrderDetails] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const verifyPayment = async () => {
            if (!sessionId) {
                setError("No session ID found");
                setLoading(false);
                return;
            }
            try {
                // Simulate delay for dramatic effect or actual API call
                // const data = await paymentService.getPaymentBySessionId(sessionId);
                // setOrderDetails(data);

                // MOCK DATA for UI Demo (Replace with above logic)
                setTimeout(() => {
                    setOrderDetails({
                        id: "ORD-8X29-L1",
                        total: 450.00,
                        email: "customer@example.com"
                    });
                    setLoading(false);
                }, 1500);

            } catch (err) {
                console.error(err);
                setError("Payment verification failed");
                setLoading(false);
            }
        };
        verifyPayment();
    }, [sessionId]);

    if (loading) {
        return (
            <PageWrapper>
                <Box textAlign="center">
                    <CircularProgress size={60} sx={{ color: THEME.success }} />
                    <Typography mt={2} color={THEME.textMuted}>Finalizing your order...</Typography>
                </Box>
            </PageWrapper>
        );
    }

    if (error) {
        return (
            <PageWrapper>
                <Alert severity="error" variant="filled" sx={{ borderRadius: '12px' }}>{error}</Alert>
                <Button onClick={() => navigate('/checkout')} sx={{ mt: 2, color: THEME.text }}>Try Again</Button>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <SuccessCard>
                
                {/* Success Icon */}
                <IconCircle>
                    <CheckCircle sx={{ fontSize: 48 }} />
                </IconCircle>

                <Typography variant="h4" fontWeight={800} mb={1} sx={{ color: '#fff' }}>
                    Payment Successful!
                </Typography>
                <Typography color={THEME.textMuted}>
                    Thank you for your purchase. Your order is confirmed.
                </Typography>

                {/* Next Steps Timeline */}
                <Box mt={4}>
                    <StepBox>
                        <Avatar sx={{ bgcolor: alpha(THEME.primary, 0.2), color: THEME.primary }}><Email fontSize="small" /></Avatar>
                        <Box textAlign="left">
                            <Typography variant="body2" fontWeight={700}>Confirmation Email Sent</Typography>
                            <Typography variant="caption" color={THEME.textMuted}>Check your inbox for receipt</Typography>
                        </Box>
                    </StepBox>
                    <StepBox>
                        <Avatar sx={{ bgcolor: alpha(THEME.gold, 0.2), color: THEME.gold }}><LocalShipping fontSize="small" /></Avatar>
                        <Box textAlign="left">
                            <Typography variant="body2" fontWeight={700}>Preparing Shipment</Typography>
                            <Typography variant="caption" color={THEME.textMuted}>We are packing your gear now</Typography>
                        </Box>
                    </StepBox>
                </Box>

                {/* Digital Receipt Stub */}
                {orderDetails && (
                    <ReceiptBox>
                        <Stack direction="row" justifyContent="space-between" mb={1}>
                            <Typography variant="body2" color={THEME.textMuted}>Order Number</Typography>
                            <Typography variant="body2" fontWeight={600} color={THEME.primary}>{orderDetails.id}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between" mb={1}>
                            <Typography variant="body2" color={THEME.textMuted}>Amount Paid</Typography>
                            <Typography variant="body2" fontWeight={600}>Rs {orderDetails.total.toFixed(2)}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color={THEME.textMuted}>Transaction ID</Typography>
                            <Typography variant="caption" color={THEME.textMuted}>{sessionId?.slice(-8).toUpperCase()}</Typography>
                        </Stack>
                    </ReceiptBox>
                )}

                {/* Action Buttons */}
                <Grid container spacing={2} mt={4}>
                    <Grid item xs={6}>
                        <Button 
                            fullWidth 
                            variant="outlined" 
                            onClick={() => navigate('/orders')}
                            sx={{ 
                                borderColor: 'rgba(255,255,255,0.2)', 
                                color: THEME.text, 
                                py: 1.5, 
                                borderRadius: '12px',
                                '&:hover': { 
                                    borderColor: THEME.primary, 
                                    color: THEME.primary,
                                    bgcolor: 'rgba(255, 215, 0, 0.05)' 
                                }
                            }}
                        >
                            Track Order
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button 
                            fullWidth 
                            variant="contained" 
                            onClick={() => navigate('/')}
                            endIcon={<ArrowForward />}
                            sx={{ 
                                bgcolor: THEME.primary, // Yellow Background
                                color: '#000000', // Black Text
                                fontWeight: 'bold', 
                                py: 1.5, 
                                borderRadius: '12px',
                                '&:hover': { bgcolor: '#e6c200' } // Darker Yellow
                            }}
                        >
                            Continue Shopping
                        </Button>
                    </Grid>
                </Grid>

            </SuccessCard>
        </PageWrapper>
    );
}