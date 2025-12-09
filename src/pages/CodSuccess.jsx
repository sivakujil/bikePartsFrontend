import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Button, CircularProgress, Alert, Grid, Stack, Fade, Avatar } from "@mui/material";
import { styled, keyframes, alpha } from '@mui/system';
import { CheckCircle, LocalShipping, ReceiptLong, ArrowForward, ShoppingBag } from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getOrderById } from "../services/cartOrderService";

// === 1. THEME ===
const THEME = {
  bg: '#0F172A',
  glass: 'rgba(30, 41, 59, 0.6)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  primary: '#38BDF8',
  success: '#10B981',
  gold: '#F59E0B',
  text: '#F8FAFC',
  textMuted: '#94A3B8',
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
  backgroundImage: `radial-gradient(circle at 50% 0%, #1e293b 0%, ${THEME.bg} 80%)`,
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
  boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
  animation: `${popIn} 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)`
});

const IconCircle = styled(Box)({
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  background: alpha(THEME.success, 0.2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 24px auto',
  color: THEME.success,
  animation: `${float} 3s ease-in-out infinite`
});

const ReceiptBox = styled(Box)({
  background: 'rgba(15, 23, 42, 0.6)',
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
  marginBottom: '8px'
});

export default function CodSuccess() {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [loading, setLoading] = useState(true);
    const [orderDetails, setOrderDetails] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                setError("No order ID found");
                setLoading(false);
                return;
            }
            try {
                const order = await getOrderById(orderId);
                setOrderDetails(order);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Failed to load order details");
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    if (loading) {
        return (
            <PageWrapper>
                <Box textAlign="center">
                    <CircularProgress size={60} sx={{ color: THEME.success }} />
                    <Typography mt={2} color={THEME.textMuted}>Processing your order...</Typography>
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

                <Typography variant="h4" fontWeight={800} mb={1}>
                    Order Placed Successfully!
                </Typography>
                <Typography color={THEME.textMuted} mb={4}>
                    Your Cash on Delivery order has been confirmed.
                </Typography>

                {/* Order Details */}
                {orderDetails && (
                    <Box sx={{ background: 'rgba(15, 23, 42, 0.6)', border: `1px dashed ${THEME.glassBorder}`, borderRadius: '16px', padding: '24px', textAlign: 'left', mb: 4 }}>
                        <Typography variant="h6" fontWeight={600} mb={2}>Order Details</Typography>
                        <Stack spacing={1}>
                            <Typography>• Order ID: {orderDetails.orderNumber}</Typography>
                            <Typography>• Amount: Rs. {orderDetails.totalAmount}</Typography>
                            <Typography>• Payment Method: Cash on Delivery</Typography>
                            <Typography>• Delivery Date: {orderDetails.estimatedDeliveryTime ? new Date(orderDetails.estimatedDeliveryTime).toLocaleDateString() : 'Within 3-5 business days'}</Typography>
                        </Stack>
                        <Typography mt={2}>Your order has been sent to our delivery team.</Typography>
                        <Typography>Please keep the cash ready during delivery.</Typography>
                        <Typography mt={2} fontWeight={600}>Thank you for shopping with us!</Typography>
                    </Box>
                )}

                {/* Next Steps Timeline */}
                <Box mt={4}>
                    <StepBox>
                        <Avatar sx={{ bgcolor: alpha(THEME.success, 0.2), color: THEME.success }}><CheckCircle fontSize="small" /></Avatar>
                        <Box textAlign="left">
                            <Typography variant="body2" fontWeight={700}>Order Confirmed</Typography>
                            <Typography variant="caption" color={THEME.textMuted}>Your COD order has been placed</Typography>
                        </Box>
                    </StepBox>
                    <StepBox>
                        <Avatar sx={{ bgcolor: alpha(THEME.gold, 0.2), color: THEME.gold }}><LocalShipping fontSize="small" /></Avatar>
                        <Box textAlign="left">
                            <Typography variant="body2" fontWeight={700}>Preparing for Delivery</Typography>
                            <Typography variant="caption" color={THEME.textMuted}>We are packing your gear now</Typography>
                        </Box>
                    </StepBox>
                </Box>

                {/* Digital Receipt Stub */}
                {orderDetails && (
                    <ReceiptBox>
                        <Stack direction="row" justifyContent="space-between" mb={1}>
                            <Typography variant="body2" color={THEME.textMuted}>Order Number</Typography>
                            <Typography variant="body2" fontWeight={600} color={THEME.primary}>{orderDetails.orderNumber}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between" mb={1}>
                            <Typography variant="body2" color={THEME.textMuted}>Amount</Typography>
                            <Typography variant="body2" fontWeight={600}>Rs. {orderDetails.totalAmount}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color={THEME.textMuted}>Payment Method</Typography>
                            <Typography variant="body2" fontWeight={600}>Cash on Delivery</Typography>
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
                                borderColor: THEME.glassBorder, color: THEME.text, py: 1.5, borderRadius: '12px',
                                '&:hover': { borderColor: THEME.textMuted, bgcolor: 'rgba(255,255,255,0.05)' }
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
                                bgcolor: THEME.success, color: '#000', fontWeight: 'bold', py: 1.5, borderRadius: '12px',
                                '&:hover': { bgcolor: '#34D399' }
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