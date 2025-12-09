import { useState, useEffect, useContext } from "react";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  Chip,
  Rating,
  Pagination,
  Stack,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";
import { getPublicProducts } from "../services/productService";
import { addToCart } from "../services/cartOrderService";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import HeroBanner from "../components/HeroBanner";

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { refreshCart } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  // Colors for the theme
  const THEME = {
    primary: '#FFD700', // Yellow
    textMain: '#FFFFFF',
    textSecondary: '#9ca3af',
    bgCard: '#1c1c1e',
    border: 'rgba(255, 255, 255, 0.1)'
  };

  // Fetch products on mount and when page changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getPublicProducts({
          limit: pagination.limit,
          page: pagination.page,
          sort: 'newest'
        });
        if (data && data.products) {
          setProducts(data.products);
          setPagination(prev => ({
            ...prev,
            total: data.pagination?.total || 0,
            pages: data.pagination?.pages || 0
          }));
        } else if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Failed to load products:", error);
        showSnackbar("Failed to load products", "error");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [pagination.page]);


  // Handle snackbar
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle add to cart
  const handleAddToCart = async (product) => {
    if (!product || product.quantity <= 0) return;

    try {
      await addToCart(product._id, 1);
      showSnackbar(`${product.name} added to cart!`, "success");

      // Refresh cart context
      if (refreshCart) {
        refreshCart();
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to add to cart";
      showSnackbar(message, "error");
    }
  };

  // Handle page change
  const handlePageChange = (event, value) => {
    setPagination(prev => ({ ...prev, page: value }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: THEME.primary }} />
      </Container>
    );
  }

  return (
    <>
      {/* Hero Banner */}
      <HeroBanner />

      <Container sx={{ mt: 4, mb: 4 }}>
        {/* Admin Button */}
        {user?.isAdmin && (
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Button
              variant="contained"
              onClick={() => navigate("/admin")}
              sx={{
                  bgcolor: THEME.primary,
                  color: '#000',
                  fontWeight: 'bold',
                  '&:hover': { bgcolor: '#e6c200' }
              }}
            >
              Admin Panel
            </Button>
          </Box>
        )}

        {/* Featured Products */}
        {!loading && products.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', color: THEME.textMain, fontWeight: 700 }}>
              Featured Products
            </Typography>
            <Grid container spacing={3}>
              {products.slice(0, 4).map((product) => (
                <Grid item xs={12} sm={6} md={3} key={`featured-${product._id}`}>
                  <ProductCard
                    product={product}
                    onAdded={handleAddToCart}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* All Products Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "800", color: THEME.textMain }}>
            All Products
          </Typography>
          <Typography variant="body1" sx={{ color: THEME.textSecondary }}>
            Discover our complete range of high-performance motorcycle parts
          </Typography>
        </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10 }}>
          <CircularProgress sx={{ color: THEME.primary }} size={60} thickness={2} />
          <Typography mt={2} sx={{ color: THEME.textSecondary, letterSpacing: 2, fontWeight: 700 }}>
            LOADING PRODUCTS...
          </Typography>
        </Box>
      )}

      {/* No Products State */}
      {!loading && products.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h6" sx={{ color: THEME.textSecondary }}>
            No products available
          </Typography>
        </Box>
      )}

      {/* Products Grid */}
      {!loading && products.length > 0 && (
        <>
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <ProductCard
                  product={product}
                  onAdded={handleAddToCart}
                />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <Stack alignItems="center" sx={{ mt: 6 }}>
              <Box sx={{
                background: 'rgba(20, 20, 20, 0.8)',
                backdropFilter: 'blur(16px)',
                border: `1px solid ${THEME.glassBorder}`,
                borderRadius: '50px',
                p: 2
              }}>
                <Pagination
                  count={pagination.pages}
                  page={pagination.page}
                  onChange={handlePageChange}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: THEME.textSecondary,
                      border: `1px solid ${THEME.glassBorder}`,
                      borderRadius: '10px',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 215, 0, 0.1)',
                        borderColor: THEME.primary,
                        color: THEME.primary,
                      },
                      '&.Mui-selected': {
                        background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.secondary} 100%)`,
                        color: '#000000',
                        fontWeight: 'bold',
                        border: 'none',
                        boxShadow: `0 0 15px rgba(255, 215, 0, 0.2)`,
                        '&:hover': { opacity: 0.9, backgroundColor: '#e6c200' }
                      }
                    }
                  }}
                />
              </Box>
              <Typography variant="caption" sx={{ color: THEME.textSecondary, mt: 2 }}>
                Page {pagination.page} of {pagination.pages} • {pagination.total} products
              </Typography>
            </Stack>
          )}
        </>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
    </>
  );
}