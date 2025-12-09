import React, { useState } from "react";
import { 
  Container, Typography, Box, Grid, IconButton, Button, 
  Alert, CircularProgress, Snackbar, Divider, LinearProgress, 
  Tooltip, Fade, Stack 
} from "@mui/material";
import { styled, alpha } from '@mui/system';
import { 
  Add, Remove, Delete, ShoppingBag, ArrowBack, 
  LocalOffer, VerifiedUser, LocalShipping 
} from "@mui/icons-material";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

// === 1. THEME CONFIGURATION (Updated to Black/Yellow) ===
const THEME = {
  bg: '#000000', // Pure Black
  glass: 'rgba(20, 20, 20, 0.8)', // Darker, sleek backing
  glassBorder: 'rgba(255, 215, 0, 0.15)', // Subtle Yellow border
  primary: '#FFD700', // Vibrant Yellow (Gold)
  secondary: '#333333', // Dark Gray
  success: '#10B981', // Green (Keep for success states)
  danger: '#EF4444', // Red
  text: '#FFFFFF', // White
  textMuted: '#A3A3A3', // Light Gray
};

// === 2. STYLED COMPONENTS ===

const PageWrapper = styled(Box)({
  backgroundColor: THEME.bg,
  minHeight: '100vh',
  color: THEME.text,
  paddingTop: '40px',
  paddingBottom: '80px',
  // Changed gradient to Black/Dark Gray
  backgroundImage: `radial-gradient(circle at 50% 0%, #1a1a1a 0%, ${THEME.bg} 80%)`,
});

const GlassCard = styled(Box)({
  background: THEME.glass,
  backdropFilter: 'blur(12px)',
  border: `1px solid ${THEME.glassBorder}`,
  borderRadius: '0px', // Sharper corners for "Sleek Bike" look
  overflow: 'hidden',
  marginBottom: '24px'
});

const CartItemRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: '24px',
  borderBottom: `1px solid ${THEME.glassBorder}`,
  transition: 'background 0.2s',
  '&:last-child': { borderBottom: 'none' },
  '&:hover': { background: 'rgba(255, 215, 0, 0.03)' } // Subtle yellow tint on hover
});

const ProductImage = styled('img')({
  width: 100, height: 100,
  borderRadius: '4px', // Slightly sharper
  objectFit: 'contain',
  backgroundColor: '#fff', 
  border: `1px solid ${THEME.glassBorder}`,
  padding: '8px'
});

const QtyButton = styled(IconButton)({
  border: `1px solid ${THEME.glassBorder}`,
  color: THEME.text,
  borderRadius: '4px',
  padding: '4px',
  '&:hover': {
    background: THEME.primary,
    color: '#000', // Black text on Yellow button
    borderColor: THEME.primary
  },
  '&:disabled': { opacity: 0.3 }
});

const SummaryRow = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '12px',
  fontSize: '0.95rem',
  color: THEME.textMuted
});

const EmptyCartBox = styled(Box)({
  textAlign: 'center',
  padding: '80px 20px',
  background: THEME.glass,
  borderRadius: '0px',
  border: `1px dashed ${THEME.glassBorder}`,
});

export default function Cart() {
  const {
    cartItems = [], loading, error, updateItem, removeItem,
    totalPrice = 0, subtotal = 0, tax = 0, shipping = 0
  } = useCart();

  const navigate = useNavigate();
  const [updatingItem, setUpdatingItem] = useState(null);
  const [feedback, setFeedback] = useState({ show: false, message: '' });

  // --- HANDLERS ---
  const handleQuantityChange = async (item, delta) => {
    if (!item.product?._id) return;
    try {
      setUpdatingItem(item.product._id);
      const newQty = (item.quantity || 1) + delta;
      if (newQty < 1) return;
      await updateItem(item.product._id, newQty);
    } catch (_err) {
      console.error("Failed to update quantity:", _err);
      setFeedback({ show: true, message: 'Failed to update quantity' });
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleRemove = async (item) => {
    if (!item.product?._id) return;
    try {
      setUpdatingItem(item.product._id);
      await removeItem(item.product._id);
      setFeedback({ show: true, message: 'Item removed from cart' });
    } catch (_err) {
      setFeedback({ show: true, message: 'Failed to remove item' });
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleCheckout = async () => {
    try {
      // If createOrder logic is needed here, uncomment:
      // await createOrder(); 
      navigate("/checkout");
    } catch (err) {
      setFeedback({ show: true, message: 'Failed to proceed to checkout' });
    }
  };

  // Free shipping progress bar logic (Assuming free shipping at $500)
  const freeShippingThreshold = 500;
  const shippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShip = Math.max(freeShippingThreshold - subtotal, 0);

  if (loading) {
    return (
      <PageWrapper sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ color: THEME.primary }} />
      </PageWrapper>
    );
  }

  if (!cartItems.length) {
    return (
      <PageWrapper>
        <Container maxWidth="md">
          <EmptyCartBox>
            <ShoppingBag sx={{ fontSize: 80, color: THEME.primary, opacity: 0.8, mb: 3 }} />
            <Typography variant="h4" fontWeight={800} mb={1} color="#fff">Your cart is empty</Typography>
            <Typography color={THEME.textMuted} mb={4}>Looks like you haven't added any parts to your build yet.</Typography>
            <Button 
              variant="contained" 
              size="large"
              startIcon={<ArrowBack />}
              onClick={() => navigate("/")}
              sx={{ bgcolor: THEME.primary, color: '#000', fontWeight: 'bold', borderRadius: '0px', px: 4 }}
            >
              Return to Shop
            </Button>
          </EmptyCartBox>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container maxWidth="lg">
        
        {/* HEADER */}
        <Box mb={4} display="flex" alignItems="center" gap={2}>
          <Typography variant="h4" fontWeight={800} color="#fff">Your Cart</Typography>
          <Box bgcolor={alpha(THEME.primary, 0.2)} color={THEME.primary} px={2} py={0.5} borderRadius="4px" fontWeight="bold">
            {cartItems.length} Items
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '0px' }}>{error}</Alert>}

        <Grid container spacing={4}>
          
          {/* LEFT COLUMN: CART ITEMS */}
          <Grid item xs={12} lg={8}>
            
            {/* FREE SHIPPING BAR */}
            <GlassCard sx={{ p: 3, border: `1px solid ${shippingProgress === 100 ? THEME.success : THEME.primary}` }}>
              <Stack direction="row" alignItems="center" gap={2} mb={2}>
                <LocalShipping sx={{ color: shippingProgress === 100 ? THEME.success : THEME.primary }} />
                <Typography fontWeight={600} color="#fff">
                  {shippingProgress === 100
                    ? "You've unlocked Free Shipping!"
                    : `Add Rs ${remainingForFreeShip.toFixed(2)} more for Free Shipping`}
                </Typography>
              </Stack>
              <LinearProgress 
                variant="determinate" 
                value={shippingProgress} 
                sx={{ 
                  height: 8, 
                  borderRadius: 0, 
                  bgcolor: 'rgba(255,255,255,0.1)', 
                  '& .MuiLinearProgress-bar': { bgcolor: shippingProgress === 100 ? THEME.success : THEME.primary } 
                }} 
              />
            </GlassCard>

            <GlassCard>
              {cartItems.map((item) => (
                <Fade in={true} key={item.product?._id || Math.random()}>
                  <CartItemRow>
                    {/* Product Image */}
                    <ProductImage
                      src={item.product?.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23F3F4F6'/%3E%3Ctext x='50' y='55' font-family='Arial, sans-serif' font-size='14' fill='%239B9BA4' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E"}
                      alt={item.product?.name}
                    />
                    
                    {/* Info */}
                    <Box sx={{ flex: 1, px: 3 }}>
                      <Typography variant="subtitle2" color={THEME.primary} fontWeight="bold" textTransform="uppercase" fontSize="0.75rem">
                        {item.product?.category || 'Part'}
                      </Typography>
                      <Typography variant="h6" fontWeight={700} mb={0.5} color="#fff">
                        {item.product?.name || "Unknown Item"}
                      </Typography>
                      <Typography variant="body2" color={THEME.textMuted}>
                        Unit Price: Rs {item.product?.price?.toFixed(2)}
                      </Typography>
                    </Box>

                    {/* Actions */}
                    <Box display="flex" flexDirection="column" alignItems="flex-end" gap={2}>
                      <Typography variant="h6" fontWeight={700} color="#fff">
                        Rs {((item.product?.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </Typography>
                      
                      <Box display="flex" alignItems="center" gap={2} bgcolor="rgba(255,255,255,0.05)" borderRadius="4px" p={0.5}>
                        <QtyButton 
                          size="small" 
                          onClick={() => handleQuantityChange(item, -1)}
                          disabled={updatingItem === item.product?._id || item.quantity <= 1}
                        >
                          <Remove fontSize="small" />
                        </QtyButton>
                        <Typography fontWeight="bold" minWidth="20px" textAlign="center">
                          {updatingItem === item.product?._id ? <CircularProgress size={14} color="inherit" /> : item.quantity}
                        </Typography>
                        <QtyButton 
                          size="small" 
                          onClick={() => handleQuantityChange(item, 1)}
                          disabled={updatingItem === item.product?._id}
                        >
                          <Add fontSize="small" />
                        </QtyButton>
                      </Box>

                      <Button 
                        size="small" 
                        startIcon={<Delete />} 
                        color="error" 
                        onClick={() => handleRemove(item)}
                        sx={{ textTransform: 'none', color: THEME.danger, opacity: 0.8, '&:hover': { opacity: 1, bgcolor: 'transparent' } }}
                      >
                        Remove
                      </Button>
                    </Box>
                  </CartItemRow>
                </Fade>
              ))}
            </GlassCard>
          </Grid>

          {/* RIGHT COLUMN: SUMMARY */}
          <Grid item xs={12} lg={4}>
            <GlassCard sx={{ position: 'sticky', top: 24, p: 4 }}>
              <Typography variant="h5" fontWeight={800} mb={3} color="#fff">Order Summary</Typography>
              
              <SummaryRow>
                <Typography>Subtotal</Typography>
                <Typography color={THEME.text}>Rs {subtotal.toFixed(2)}</Typography>
              </SummaryRow>

              <SummaryRow>
                <Typography>Shipping</Typography>
                <Typography color={shipping === 0 ? THEME.success : THEME.text}>
                  {shipping === 0 ? 'FREE' : `Rs ${shipping.toFixed(2)}`}
                </Typography>
              </SummaryRow>

              <SummaryRow>
                <Typography>Tax Estimate</Typography>
                <Typography color={THEME.text}>Rs {tax.toFixed(2)}</Typography>
              </SummaryRow>

              <Divider sx={{ my: 3, borderColor: THEME.glassBorder }} />

              <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={4}>
                <Typography variant="h6" fontWeight="bold" color="#fff">Total</Typography>
                <Box textAlign="right">
                  <Typography variant="h4" fontWeight={800} color={THEME.primary}>
                    Rs {totalPrice.toFixed(2)}
                  </Typography>
                  <Typography variant="caption" color={THEME.textMuted}>LKR</Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleCheckout}
                sx={{ 
                  bgcolor: THEME.primary, 
                  color: '#000', // Black text
                  fontWeight: 800, 
                  py: 2, 
                  borderRadius: '0px', // Square corners
                  fontSize: '1.1rem',
                  boxShadow: `0 0 20px ${alpha(THEME.primary, 0.3)}`,
                  '&:hover': { bgcolor: '#FACC15', boxShadow: `0 0 30px ${alpha(THEME.primary, 0.5)}` } // Slightly different yellow on hover
                }}
              >
                Checkout Securely
              </Button>

              <Box mt={3} display="flex" alignItems="center" justifyContent="center" gap={1} color={THEME.textMuted}>
                <VerifiedUser fontSize="small" sx={{ color: THEME.primary }} />
                <Typography variant="caption">Secure SSL Encrypted Transaction</Typography>
              </Box>

              {/* Optional Coupon Input */}
              <Box mt={4}>
                <Typography variant="caption" color={THEME.textMuted} fontWeight="bold" mb={1} display="block">
                  HAVE A COUPON?
                </Typography>
                <Box display="flex" gap={1}>
                  <Box 
                    component="input" 
                    placeholder="Enter Code" 
                    sx={{ 
                      flex: 1, bgcolor: 'rgba(255,255,255,0.1)', border: `1px solid ${THEME.glassBorder}`, 
                      borderRadius: '0px', color: '#fff', px: 2, outline: 'none',
                      '&:focus': { borderColor: THEME.primary }
                    }} 
                  />
                  <Button variant="outlined" sx={{ color: THEME.primary, borderColor: THEME.primary, borderRadius: '0px', '&:hover': { borderColor: '#fff', color: '#fff' } }}>
                    Apply
                  </Button>
                </Box>
              </Box>

            </GlassCard>
          </Grid>

        </Grid>

        <Snackbar
          open={feedback.show}
          autoHideDuration={3000}
          onClose={() => setFeedback({ ...feedback, show: false })}
          message={feedback.message}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />

      </Container>
    </PageWrapper>
  );
}