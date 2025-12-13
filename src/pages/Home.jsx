import React, { useEffect, useState } from "react";
import {
  Grid, CircularProgress, Typography, Box, Container,
  Button, Pagination, Stack, useMediaQuery, useTheme, Chip, IconButton, Badge, Fade
} from "@mui/material";
import { styled, keyframes } from '@mui/system';

// Icons
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import TuneIcon from '@mui/icons-material/Tune';
import GridViewIcon from '@mui/icons-material/GridView';
import BoltIcon from '@mui/icons-material/Bolt';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import api from "../services/api";

// Components
import HeroBanner from "../components/HeroBanner";
import CategoryNav from "../components/CategoryNav";
import ProductCard from "../components/ProductCard";
import ProductFilter from "../components/ProductFilter";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

// === 1. ANIMATIONS ===
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
  100% { transform: translateY(0px); }
`;


// === 2. COLOR PALETTE (Sleek Yellow & Black Theme) ===
const THEME = {
  bg: '#000000', // True Black for high contrast
  glass: 'rgba(20, 20, 20, 0.8)', // Darker glass
  glassBorder: 'rgba(255, 215, 0, 0.15)', // Subtle Yellow Border
  primaryGradient: 'linear-gradient(135deg, #FFD700 0%, #FDB931 100%)', // Yellow/Gold Gradient
  textMain: '#FFFFFF', // Pure White
  textMuted: '#9ca3af', // Cool Grey
  accent: '#FFD700' // Bright Yellow
};

// === 3. STYLED COMPONENTS ===

// Background with "Mesh Gradient" effect
const PageWrapper = styled(Box)({
  backgroundColor: THEME.bg,
  minHeight: '100vh',
  color: THEME.textMain,
  paddingBottom: '100px',
  position: 'relative',
  overflow: 'hidden',
  // Ambient background glow blobs (Yellow/Gold)
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-10%', left: '-10%',
    width: '50%', height: '50%',
    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.08) 0%, transparent 70%)',
    filter: 'blur(60px)',
    zIndex: 0
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '10%', right: '-5%',
    width: '40%', height: '40%',
    background: 'radial-gradient(circle, rgba(253, 185, 49, 0.08) 0%, transparent 70%)',
    filter: 'blur(60px)',
    zIndex: 0
  }
});

// The "Glass" Card Style
const GlassPanel = styled(Box)(({ theme }) => ({
  background: THEME.glass,
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: `1px solid ${THEME.glassBorder}`,
  borderRadius: '24px', // Very rounded corners
  padding: theme.spacing(3),
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
  transition: 'transform 0.3s ease',
}));

// Gradient Text
const GradientText = styled(Typography)({
  background: 'linear-gradient(to right, #FFD700, #FDB931)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 800,
  letterSpacing: '-0.5px',
});

// Sidebar Container
const SidebarWrapper = styled(Box)({
  position: 'sticky',
  top: '100px',
  height: 'fit-content',
});

// Product Card Container with Hover Effect
const ProductWrapper = styled(Box)({
  height: '100%',
  position: 'relative',
  transition: 'all 0.3s ease',
  borderRadius: '20px',
  '&:hover': {
    transform: 'translateY(-10px)',
    zIndex: 10,
    // Yellow glow on hover
    boxShadow: '0 20px 40px -10px rgba(255, 215, 0, 0.15)', 
  }
});

// Modern Pagination Buttons
const StyledPagination = styled(Pagination)({
  '& .MuiPaginationItem-root': {
    color: THEME.textMuted,
    borderRadius: '12px',
    border: `1px solid ${THEME.glassBorder}`,
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: 'rgba(255, 215, 0, 0.1)',
      borderColor: THEME.accent,
      color: THEME.accent,
    },
    '&.Mui-selected': {
      background: THEME.primaryGradient,
      color: '#000000', // Black text on Yellow button
      fontWeight: 'bold',
      border: 'none',
      boxShadow: '0 4px 14px rgba(255, 215, 0, 0.3)',
      '&:hover': { opacity: 0.9, backgroundColor: '#FFD700' }
    }
  }
});

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { } = useAuth();
  const { addItem } = useCart();

  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);


  const [filters, setFilters] = useState({
    search: '',
    minPrice: 1000,
    maxPrice: 50000,
    category: '',
    brand: '',
    minRating: 0,
    inStock: false,
    sort: 'newest'
  });

  const [pagination, setPagination] = useState({
    page: 1, limit: 12, total: 0, pages: 0
  });


  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.minPrice > 1000) queryParams.append('minPrice', filters.minPrice);
        if (filters.maxPrice < 50000) queryParams.append('maxPrice', filters.maxPrice);
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.brand) queryParams.append('brand', filters.brand);
        if (filters.minRating > 0) queryParams.append('minRating', filters.minRating);
        if (filters.inStock) queryParams.append('inStock', 'true');
        if (filters.sort) queryParams.append('sort', filters.sort);
        queryParams.append('page', pagination.page);
        queryParams.append('limit', pagination.limit);

        const res = await api.get(`/products?${queryParams.toString()}`);
        if (res.data.products) {
          setFiltered(res.data.products);
          setPagination(res.data.pagination);
        } else {
          const productData = Array.isArray(res.data) ? res.data : [];
          setFiltered(productData);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [filters, pagination.page]);

  const handleFilterChange = (newFilters) => { setFilters(newFilters); setPagination(prev => ({ ...prev, page: 1 })); };
  const handleCategorySelect = (category) => { handleFilterChange({ ...filters, category: category === "All Parts" ? '' : category }); };
  const handlePageChange = (event, newPage) => { setPagination(prev => ({ ...prev, page: newPage })); window.scrollTo({ top: 600, behavior: 'smooth' }); };
  const handleAdded = (product) => { addItem(product._id, 1); };


  return (
    <PageWrapper>

      {/* 1. HERO (Z-Index ensures it stays above background blobs) */}
      <Box sx={{ position: 'relative', zIndex: 2, mb: 6 }}>
        <HeroBanner />
      </Box>

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 3 }}>

        {/* 2. FLOATING CATEGORY NAV */}
        <Box sx={{
          mt: -8, mb: 8,
          display: 'flex', justifyContent: 'center',
          animation: `${float} 6s ease-in-out infinite`
        }}>
          <Box sx={{
            background: 'rgba(10, 10, 10, 0.9)', // Darker pill
            backdropFilter: 'blur(16px)',
            borderRadius: '100px',
            border: `1px solid ${THEME.glassBorder}`,
            p: 1,
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
          }}>
            <CategoryNav onSelect={handleCategorySelect} />
          </Box>
        </Box>


        {/* PRODUCT CATALOG */}
        <Grid container spacing={4}>
          
          {/* 3. SIDEBAR FILTERS (Modern Glass Panel) */}
          <Grid item xs={12} md={3} lg={2.5}>
            {isMobile && (
              <Button 
                fullWidth 
                variant="contained" 
                startIcon={<TuneIcon />}
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                sx={{ 
                  mb: 3, 
                  background: THEME.primaryGradient,
                  color: '#000', // Black Text
                  borderRadius: '12px', py: 1.5, fontWeight: 'bold'
                }}
              >
                {showMobileFilters ? "Hide Filters" : "Refine Search"}
              </Button>
            )}

            <Box sx={{ display: (isMobile && !showMobileFilters) ? 'none' : 'block' }}>
              <SidebarWrapper>
                <GlassPanel>
                  <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                    <TuneIcon sx={{ color: THEME.accent }} />
                    <Typography variant="subtitle1" fontWeight={700} sx={{ letterSpacing: 1, color: '#fff' }}>
                      CONFIGURATION
                    </Typography>
                  </Stack>
                  <ProductFilter onFilterChange={handleFilterChange} initialFilters={filters} />
                </GlassPanel>
              </SidebarWrapper>
            </Box>
          </Grid>

          {/* 4. MAIN GRID */}
          <Grid item xs={12} md={9} lg={9.5}>
            
            {/* Header Row */}
            <GlassPanel sx={{ mb: 4, py: 2, px: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '16px' }}>
              <Box>
                 <Stack direction="row" alignItems="center" spacing={1}>
                   <RocketLaunchIcon sx={{ color: THEME.accent, fontSize: 20 }} />
                   <Typography variant="caption" fontWeight={700} color={THEME.accent} letterSpacing={1}>
                     READY TO SHIP
                   </Typography>
                 </Stack>
                 <GradientText variant="h4">
                    High Performance
                 </GradientText>
              </Box>
              <Chip 
                icon={<BoltIcon sx={{ color: '#000 !important' }} />} // Black Icon
                label={`${pagination.total} RESULTS`} 
                sx={{ 
                  background: THEME.primaryGradient, 
                  color: '#000', // Black Text
                  fontWeight: '800', 
                  border: 'none' 
                }} 
              />
            </GlassPanel>

            {/* Loading */}
            {loading && (
              <Box sx={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress size={60} thickness={4} sx={{ color: THEME.accent }} />
                <Typography sx={{ mt: 2, color: THEME.textMuted, letterSpacing: 2, fontWeight: 700 }}>
                  SCANNING DATABASE...
                </Typography>
              </Box>
            )}

            {/* No Results */}
            {!loading && filtered.length === 0 && (
              <GlassPanel sx={{ textAlign: 'center', py: 8, borderStyle: 'dashed' }}>
                <SearchOffIcon sx={{ fontSize: 60, color: THEME.textMuted, mb: 2, opacity: 0.5 }} />
                <Typography variant="h5" fontWeight={600}>No parts matched your criteria.</Typography>
                <Button 
                  variant="text" 
                  onClick={() => handleFilterChange({ ...filters, search: '', category: '' })}
                  sx={{ mt: 2, color: THEME.accent }}
                >
                  Reset All Filters
                </Button>
              </GlassPanel>
            )}

            {/* Grid */}
            {!loading && filtered.length > 0 && (
              <>
                <Grid container spacing={3}>
                  {filtered.map((p, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={p._id}>
                      <Fade in={true} timeout={500 + (index * 100)}>
                        <ProductWrapper>
                           {/* ProductCard needs to handle transparent backgrounds if possible, 
                               otherwise it sits inside this wrapper nicely */}
                           <ProductCard product={p} onAdded={handleAdded} />
                        </ProductWrapper>
                      </Fade>
                    </Grid>
                  ))}
                </Grid>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                    <GlassPanel sx={{ py: 1, px: 3, borderRadius: '50px !important' }}>
                        <StyledPagination
                          count={pagination.pages}
                          page={pagination.page}
                          onChange={handlePageChange}
                        />
                    </GlassPanel>
                    <Typography variant="caption" color={THEME.textMuted} sx={{ mt: 2, textAlign: 'center' }}>
                      Page {pagination.page} of {pagination.pages}
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    </PageWrapper>
  );
}