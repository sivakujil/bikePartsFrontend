import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Container, Typography, Box, Button, Grid, Chip, Rating, Alert, 
  CircularProgress, Stack, Divider, IconButton, Fade, Breadcrumbs, Link 
} from "@mui/material";
import { styled } from '@mui/system';
import { 
  ShoppingCart, ArrowBack, FavoriteBorder, Share, 
  LocalShipping, VerifiedUser, Home 
} from "@mui/icons-material";
import api from "../services/api";
import { useCart } from "../context/CartContext";

// === 1. THEME (Sleek Yellow & Black) ===
const THEME = {
  bg: '#000000', // True Black
  glass: 'rgba(20, 20, 20, 0.8)', 
  glassBorder: 'rgba(255, 215, 0, 0.15)', // Yellow Border
  primary: '#FFD700', // Yellow
  success: '#10B981', // Green (Keep for stock/warranty)
  danger: '#EF4444',
  text: '#FFFFFF',
  textMuted: '#9ca3af',
};

// === 2. STYLED COMPONENTS ===

const PageWrapper = styled(Box)({
  backgroundColor: THEME.bg,
  minHeight: '100vh',
  color: THEME.text,
  paddingBottom: '80px',
  // Dark Gradient
  backgroundImage: `radial-gradient(circle at 50% 0%, #1a1a1a 0%, ${THEME.bg} 80%)`,
});

const GlassCard = styled(Box)({
  background: THEME.glass,
  backdropFilter: 'blur(12px)',
  border: `1px solid ${THEME.glassBorder}`,
  borderRadius: '20px',
  overflow: 'hidden',
});

const ProductImage = styled('img')({
  width: '100%',
  height: '100%',
  maxHeight: '500px',
  objectFit: 'contain',
  backgroundColor: '#1c1c1e', // Dark grey background for product image
  borderRadius: '20px',
  border: `1px solid ${THEME.glassBorder}`,
  padding: '24px'
});

const SpecBox = styled(Box)({
  background: 'rgba(255,255,255,0.03)',
  borderRadius: '12px',
  padding: '16px',
  border: `1px solid ${THEME.glassBorder}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center'
});

const PriceTag = styled(Typography)({
  // Yellow Gradient Price
  background: `linear-gradient(90deg, ${THEME.primary}, #FDB931)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 800,
  letterSpacing: '-1px'
});

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [adding, setAdding] = useState(false);
    const { addItem } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data);
            } catch (_err) {
                setError("Failed to load product details");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!product || product.quantity <= 0) return;
        setAdding(true);
        try {
            await addItem(product._id, 1);
        } catch {
            setError("Failed to add to cart");
        } finally {
            setAdding(false);
        }
    };

    if (loading) return <PageWrapper sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress sx={{ color: THEME.primary }} /></PageWrapper>;
    if (error || !product) return <PageWrapper><Container sx={{ pt: 10 }}><Alert severity="error" sx={{ borderRadius: '12px' }}>{error || "Product not found"}</Alert><Button startIcon={<ArrowBack />} onClick={() => navigate('/')} sx={{ mt: 2, color: THEME.text }}>Back to Catalog</Button></Container></PageWrapper>;

    return (
        <PageWrapper>
            <Container maxWidth="xl" sx={{ pt: 4 }}>
                
                {/* BREADCRUMBS */}
                <Breadcrumbs separator="›" sx={{ mb: 4, color: THEME.textMuted }}>
                    <Link component="button" onClick={() => navigate('/')} sx={{ display: 'flex', alignItems: 'center', color: THEME.textMuted, textDecoration: 'none', '&:hover': { color: THEME.primary } }}>
                        <Home sx={{ mr: 0.5 }} fontSize="inherit" /> Catalog
                    </Link>
                    <Typography color={THEME.primary}>{product.category || 'Details'}</Typography>
                </Breadcrumbs>

                <Grid container spacing={6}>
                    
                    {/* LEFT: IMAGE GALLERY */}
                    <Grid item xs={12} md={6}>
                        <Fade in={true} timeout={500}>
                            <Box position="relative">
                                <ProductImage
                                    src={product.image || product.images?.[0] || 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'500\' height=\'500\' viewBox=\'0 0 500 500\'%3E%3Crect width=\'500\' height=\'500\' fill=\'%231c1c1e\'/%3E%3Ctext x=\'250\' y=\'260\' font-family=\'Arial, sans-serif\' font-size=\'24\' fill=\'%23FFD700\' text-anchor=\'middle\'%3ENo Image%3C/text%3E%3C/svg%3E'}
                                    alt={product.name}
                                />
                                {product.quantity === 0 && (
                                    <Chip 
                                        label="SOLD OUT" 
                                        sx={{ 
                                            position: 'absolute', top: 20, left: 20, 
                                            bgcolor: THEME.danger, color: '#fff', fontWeight: 'bold', px: 1 
                                        }} 
                                    />
                                )}
                            </Box>
                        </Fade>
                    </Grid>

                    {/* RIGHT: DETAILS & ACTIONS */}
                    <Grid item xs={12} md={6}>
                        <Box>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                    <Typography variant="overline" color={THEME.primary} fontWeight={700} letterSpacing={1.5}>
                                        {product.brand?.toUpperCase() || "PERFORMANCE PART"}
                                    </Typography>
                                    <Typography variant="h3" fontWeight={800} sx={{ mb: 1, lineHeight: 1.1, color: '#fff' }}>
                                        {product.name}
                                    </Typography>
                                    
                                    {/* Rating */}
                                    <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                                        <Rating 
                                            value={product.rating || 4.5} 
                                            readOnly 
                                            precision={0.5} 
                                            sx={{ 
                                                '& .MuiRating-iconFilled': { color: THEME.primary },
                                                '& .MuiRating-iconEmpty': { color: 'rgba(255,255,255,0.3)' }
                                            }} 
                                        />
                                        <Typography variant="body2" color={THEME.textMuted}>({product.reviews || 12} Reviews)</Typography>
                                    </Stack>
                                </Box>
                                <Stack direction="row">
                                    <IconButton sx={{ color: THEME.textMuted, '&:hover': { color: THEME.primary } }}><Share /></IconButton>
                                    <IconButton sx={{ color: THEME.textMuted, '&:hover': { color: THEME.danger } }}><FavoriteBorder /></IconButton>
                                </Stack>
                            </Stack>

                            {/* Price Block */}
                            <Box my={3}>
                                <PriceTag variant="h3">Rs {product.price?.toLocaleString()}</PriceTag>
                                {product.cost && product.cost > product.price && (
                                    <Typography variant="h6" sx={{ textDecoration: 'line-through', color: THEME.textMuted, opacity: 0.6 }}>
                                        Rs {product.cost?.toLocaleString()}
                                    </Typography>
                                )}
                            </Box>

                            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />

                            {/* Description */}
                            <Typography variant="body1" color={THEME.textMuted} sx={{ mb: 4, lineHeight: 1.7 }}>
                                {product.description || "Engineered for durability and performance. This component meets the highest standards of quality control."}
                            </Typography>

                            {/* Specs Grid */}
                            <Grid container spacing={2} mb={4}>
                                <Grid item xs={4}>
                                    <SpecBox>
                                        <Typography variant="caption" color={THEME.textMuted} fontWeight={700}>MODEL</Typography>
                                        <Typography variant="body2" fontWeight={600} sx={{ color: '#fff' }}>{product.model || "N/A"}</Typography>
                                    </SpecBox>
                                </Grid>
                                <Grid item xs={4}>
                                    <SpecBox>
                                        <Typography variant="caption" color={THEME.textMuted} fontWeight={700}>SKU</Typography>
                                        <Typography variant="body2" fontWeight={600} sx={{ color: '#fff' }}>{product._id.slice(-6).toUpperCase()}</Typography>
                                    </SpecBox>
                                </Grid>
                                <Grid item xs={4}>
                                    <SpecBox>
                                        <Typography variant="caption" color={THEME.textMuted} fontWeight={700}>STOCK</Typography>
                                        <Typography variant="body2" color={product.quantity > 0 ? THEME.success : THEME.danger} fontWeight={600}>
                                            {product.quantity > 0 ? "In Stock" : "Empty"}
                                        </Typography>
                                    </SpecBox>
                                </Grid>
                            </Grid>

                            {/* Action Buttons */}
                            <Stack direction="row" spacing={2}>
                                <Button 
                                    variant="contained" 
                                    size="large" 
                                    startIcon={!adding && <ShoppingCart />} 
                                    disabled={adding || product.quantity <= 0} 
                                    onClick={handleAddToCart} 
                                    fullWidth
                                    sx={{ 
                                        bgcolor: THEME.primary, // Yellow
                                        color: '#000', // Black Text
                                        fontWeight: 800, 
                                        py: 1.8, 
                                        borderRadius: '12px',
                                        '&:hover': { bgcolor: '#e6c200', boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)' },
                                        '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' }
                                    }}
                                >
                                    {adding ? <CircularProgress size={24} color="inherit" /> : product.quantity > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
                                </Button>
                            </Stack>

                            {/* Trust Signals */}
                            <Stack direction="row" spacing={3} mt={4} justifyContent="center" color={THEME.textMuted}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <LocalShipping fontSize="small" sx={{ color: THEME.primary }} />
                                    <Typography variant="caption">Fast Delivery</Typography>
                                </Box>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <VerifiedUser fontSize="small" sx={{ color: THEME.success }} />
                                    <Typography variant="caption">1 Year Warranty</Typography>
                                </Box>
                            </Stack>

                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </PageWrapper>
    );
}