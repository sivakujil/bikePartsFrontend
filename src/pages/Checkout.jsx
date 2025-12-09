import React, { useEffect, useState } from "react";
import {
  Container, Typography, Box, Button, TextField, CircularProgress,
  Alert, Grid, Divider, Stack, Stepper, Step, StepLabel, Fade
} from "@mui/material";
import { styled, alpha } from '@mui/system';
import { 
  Lock, LocalShipping, Payment, CheckCircle, 
  CreditCard, Shield 
} from "@mui/icons-material";
import paymentService from "../services/paymentService";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

// === 1. THEME CONFIGURATION (Updated to Black/Yellow) ===
const THEME = {
  bg: '#000000', // Pure Black
  glass: 'rgba(20, 20, 20, 0.8)', // Darker, sleek backing
  glassBorder: 'rgba(255, 215, 0, 0.15)', // Subtle Yellow border
  primary: '#FFD700', // Vibrant Yellow (Gold)
  secondary: '#333333', // Dark Gray
  success: '#10B981', // Green
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
  // Updated Gradient
  backgroundImage: `radial-gradient(circle at 50% 0%, #1a1a1a 0%, ${THEME.bg} 80%)`,
});

const GlassCard = styled(Box)({
  background: THEME.glass,
  backdropFilter: 'blur(12px)',
  border: `1px solid ${THEME.glassBorder}`,
  borderRadius: '0px', // Sharper corners for sleek look
  padding: '32px',
  marginBottom: '24px',
});

const CustomTextField = styled(TextField)({
  '& .MuiInputLabel-root': { color: THEME.textMuted },
  '& .MuiInputLabel-root.Mui-focused': { color: THEME.primary },
  '& .MuiOutlinedInput-root': {
    color: THEME.text,
    backgroundColor: 'rgba(255,255,255,0.05)', // Slightly lighter input bg
    borderRadius: '0px', // Sharp corners
    '& fieldset': { borderColor: THEME.glassBorder },
    '&:hover fieldset': { borderColor: 'rgba(255, 215, 0, 0.5)' },
    '&.Mui-focused fieldset': { borderColor: THEME.primary },
  }
});

const SummaryRow = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '12px',
  color: THEME.textMuted,
  fontSize: '0.95rem'
});

const SecureBadge = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  marginTop: '24px',
  padding: '12px',
  background: 'rgba(255, 215, 0, 0.05)', // Very faint yellow tint
  border: `1px solid ${alpha(THEME.primary, 0.2)}`,
  borderRadius: '0px',
  color: THEME.primary,
  fontSize: '0.85rem',
  fontWeight: 600
});

// Custom Stepper Styles
const CustomStepper = styled(Stepper)({
  marginBottom: '40px',
  backgroundColor: 'transparent',
  '& .MuiStepLabel-label': { color: THEME.textMuted },
  '& .MuiStepLabel-label.Mui-active': { color: THEME.primary, fontWeight: 'bold' },
  '& .MuiStepLabel-label.Mui-completed': { color: THEME.success },
  '& .MuiStepIcon-root': { color: 'rgba(255,255,255,0.2)' },
  '& .MuiStepIcon-root.Mui-active': { color: THEME.primary }, // Yellow active step
  '& .MuiStepIcon-root.Mui-completed': { color: THEME.success },
});

export default function Checkout() {
  const { cartItems, loading, error: cartError, subtotal, tax, shipping, totalPrice, createOrder: createOrderFromCart } = useCart();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [address, setAddress] = useState({ street: "", city: "", state: "", zipCode: "" });
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");
  const navigate = useNavigate();

  useEffect(() => { if (cartError) setError(cartError); }, [cartError]);

  const handleAddressChange = (field) => (e) => setAddress(prev => ({ ...prev, [field]: e.target.value }));
  const validateAddress = () => address.street && address.city && address.state && address.zipCode;

  const handleCheckout = async () => {
    if (!validateAddress()) {
      setError("Please complete all shipping address fields");
      return;
    }
    setProcessing(true);
    setError("");

    try {
      if (paymentMethod === "COD") {
        // For COD: Create order and redirect to success
        const createdOrder = await createOrderFromCart(address, "COD");
        navigate(`/cod-success?orderId=${createdOrder._id}`);
      } else {
        // For ONLINE: Create order and proceed with payment
        const createdOrder = await createOrderFromCart(address, "ONLINE");

        // Prepare Payment Payload
        const paymentItems = cartItems.map(item => ({
          name: item.product?.name || item.name,
          price: item.product?.price || item.price,
          quantity: item.quantity,
          description: `Bike Part: ${item.product?.name}`
        }));

        // Get Stripe URL
        const paymentResponse = await paymentService.processOrderPayment(createdOrder._id, paymentItems);

        // Redirect
        window.location.href = paymentResponse.checkout_url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.message || "Failed to process transaction. Please try again.");
      setProcessing(false);
    }
  };

  if (loading) return <PageWrapper sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress sx={{ color: THEME.primary }} /></PageWrapper>;
  if (cartItems.length === 0) return <PageWrapper><Container sx={{ textAlign: "center", mt: 10 }}><Typography variant="h5">Your cart is empty</Typography><Button variant="contained" sx={{ mt: 2, bgcolor: THEME.primary, color: '#000', fontWeight: 'bold' }} onClick={() => navigate("/")}>Go Shopping</Button></Container></PageWrapper>;

  return (
    <PageWrapper>
      <Container maxWidth="lg">
        
        {/* PROGRESS STEPPER */}
        <CustomStepper activeStep={1} alternativeLabel>
          <Step><StepLabel icon={<LocalShipping />}>Shipping</StepLabel></Step>
          <Step><StepLabel icon={<Payment />}>Payment</StepLabel></Step>
          <Step><StepLabel icon={<CheckCircle />}>Confirmation</StepLabel></Step>
        </CustomStepper>

        <Grid container spacing={4}>
          
          {/* LEFT COLUMN: FORM */}
          <Grid item xs={12} md={8}>
            <Fade in={true} timeout={500}>
              <Box>
                <Typography variant="h5" fontWeight={800} mb={3} color="#fff">Shipping Details</Typography>
                
                {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '0px' }}>{error}</Alert>}

                <GlassCard>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <CustomTextField
                        label="Street Address"
                        fullWidth
                        value={address.street}
                        onChange={handleAddressChange('street')}
                        required
                        placeholder="123 Ride Way"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <CustomTextField
                        label="City"
                        fullWidth
                        value={address.city}
                        onChange={handleAddressChange('city')}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <CustomTextField
                            label="State"
                            fullWidth
                            value={address.state}
                            onChange={handleAddressChange('state')}
                            required
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <CustomTextField
                            label="ZIP Code"
                            fullWidth
                            value={address.zipCode}
                            onChange={handleAddressChange('zipCode')}
                            required
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </GlassCard>

                <Typography variant="h5" fontWeight={800} mb={3} mt={4} color="#fff">Payment Method</Typography>
                <GlassCard>
                  <Typography variant="h6" fontWeight={600} mb={2} color="#fff">Choose Payment Method</Typography>
                  <Stack direction="row" spacing={3}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        border: `2px solid ${paymentMethod === 'ONLINE' ? THEME.primary : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: '0px',
                        cursor: 'pointer',
                        bgcolor: paymentMethod === 'ONLINE' ? alpha(THEME.primary, 0.1) : 'transparent',
                        transition: 'all 0.3s ease',
                        '&:hover': { borderColor: THEME.primary }
                      }}
                      onClick={() => setPaymentMethod('ONLINE')}
                    >
                      <input
                        type="radio"
                        checked={paymentMethod === 'ONLINE'}
                        onChange={() => setPaymentMethod('ONLINE')}
                        style={{ marginRight: '12px', accentColor: THEME.primary }}
                      />
                      <Box>
                        <Typography fontWeight={600} color={paymentMethod === 'ONLINE' ? THEME.primary : '#fff'}>Online Payment</Typography>
                        <Typography variant="body2" color={THEME.textMuted}>Pay securely with card</Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        border: `2px solid ${paymentMethod === 'COD' ? THEME.primary : 'rgba(255,255,255,0.1)'}`,
                        borderRadius: '0px',
                        cursor: 'pointer',
                        bgcolor: paymentMethod === 'COD' ? alpha(THEME.primary, 0.1) : 'transparent',
                        transition: 'all 0.3s ease',
                        '&:hover': { borderColor: THEME.primary }
                      }}
                      onClick={() => setPaymentMethod('COD')}
                    >
                      <input
                        type="radio"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                        style={{ marginRight: '12px', accentColor: THEME.primary }}
                      />
                      <Box>
                        <Typography fontWeight={600} color={paymentMethod === 'COD' ? THEME.primary : '#fff'}>Cash on Delivery</Typography>
                        <Typography variant="body2" color={THEME.textMuted}>Pay when you receive</Typography>
                      </Box>
                    </Box>
                  </Stack>
                  {paymentMethod === 'COD' && totalPrice > 25000 && (
                    <Alert severity="warning" sx={{ mt: 2, borderRadius: '0px' }}>
                      COD not available for orders above Rs 25,000
                    </Alert>
                  )}
                </GlassCard>

                <Typography variant="h5" fontWeight={800} mb={3} mt={4} color="#fff">Review Items</Typography>
                <GlassCard sx={{ p: 0, overflow: 'hidden' }}>
                  {cartItems.map((item, index) => (
                    <Box key={index} sx={{ 
                      p: 2, 
                      display: 'flex', 
                      alignItems: 'center', 
                      borderBottom: index !== cartItems.length - 1 ? `1px solid ${THEME.glassBorder}` : 'none' 
                    }}>
                      <Box
                        component="img"
                        src={item.product?.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23F3F4F6'/%3E%3Ctext x='30' y='35' font-family='Arial, sans-serif' font-size='12' fill='%239B9BA4' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E"}
                        sx={{ width: 60, height: 60, borderRadius: '4px', objectFit: 'contain', bgcolor: '#fff', mr: 2 }}
                      />
                      <Box flex={1}>
                        <Typography fontWeight={600} color="#fff">{item.product?.name}</Typography>
                        <Typography variant="body2" color={THEME.textMuted}>Qty: {item.quantity}</Typography>
                      </Box>
                      <Typography fontWeight={700} color="#fff">Rs {((item.product?.price || 0) * item.quantity).toFixed(2)}</Typography>
                    </Box>
                  ))}
                </GlassCard>
              </Box>
            </Fade>
          </Grid>

          {/* RIGHT COLUMN: SUMMARY */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 24 }}>
              <GlassCard>
                <Typography variant="h6" fontWeight={700} mb={3} color="#fff">Order Summary</Typography>
                
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
                  <Typography>Tax (Est.)</Typography>
                  <Typography color={THEME.text}>Rs {tax.toFixed(2)}</Typography>
                </SummaryRow>

                <Divider sx={{ my: 2, borderColor: THEME.glassBorder }} />

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                  <Typography variant="h6" fontWeight={700} color="#fff">Total</Typography>
                  <Typography variant="h4" fontWeight={800} color={THEME.primary}>Rs {totalPrice.toFixed(2)}</Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleCheckout}
                  disabled={processing || (paymentMethod === 'COD' && totalPrice > 25000)}
                  startIcon={!processing && <Lock />}
                  sx={{
                    bgcolor: THEME.primary,
                    color: '#000', // Black Text
                    fontWeight: 800,
                    py: 2,
                    borderRadius: '0px', // Sharp corners
                    fontSize: '1.1rem',
                    boxShadow: `0 0 20px ${alpha(THEME.primary, 0.3)}`,
                    '&:hover': { bgcolor: '#FACC15', boxShadow: `0 0 30px ${alpha(THEME.primary, 0.5)}` }
                  }}
                >
                  {processing ? <CircularProgress size={24} color="inherit" /> : paymentMethod === 'COD' ? "Place Order" : "Pay Securely"}
                </Button>

                <SecureBadge>
                  <Shield fontSize="small" />
                  SSL Encrypted Payment
                </SecureBadge>

                <Stack direction="row" justifyContent="center" gap={2} mt={3} color={THEME.textMuted}>
                  <CreditCard fontSize="large" />
                  {/* Add icons for Visa/Mastercard here if available in your icon set */}
                </Stack>

              </GlassCard>
            </Box>
          </Grid>

        </Grid>
      </Container>
    </PageWrapper>
  );
}