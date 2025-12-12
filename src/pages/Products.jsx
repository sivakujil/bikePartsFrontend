import React, { useEffect, useState } from "react";
import {
  Grid, CircularProgress, Typography, Box, Container,
  Button, Breadcrumbs, Link, Pagination, useMediaQuery,
  useTheme, Drawer, Stack, IconButton, Fade, Select, MenuItem, FormControl,
  TextField
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled, keyframes, alpha } from '@mui/system';

// Icons
import HomeIcon from "@mui/icons-material/Home";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CloseIcon from '@mui/icons-material/Close';
import SortIcon from '@mui/icons-material/Sort';
import GridViewIcon from '@mui/icons-material/GridView';
import TuneIcon from '@mui/icons-material/Tune';

// Components
import ProductCard from "../components/ProductCard";
import ProductFilter from "../components/ProductFilter";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { submitProductRequest } from "../services/productRequestService";

// === 1. THEME CONSTANTS (Sleek Yellow & Black) ===
const THEME = {
  bg: '#000000', // True Black
  glass: 'rgba(20, 20, 20, 0.8)', // Darker Glass
  glassBorder: 'rgba(255, 215, 0, 0.15)', // Yellow Border
  primary: '#FFD700', // Bright Yellow
  secondary: '#FDB931', // Gold
  text: '#FFFFFF',
  textMuted: '#9ca3af',
};

// === 2. ANIMATIONS ===
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// === 3. STYLED COMPONENTS ===

const PageWrapper = styled(Box)({
  backgroundColor: THEME.bg,
  // Ambient Yellow Glows
  backgroundImage: `
    radial-gradient(at 0% 0%, hsla(45, 100%, 50%, 0.05) 0, transparent 50%), 
    radial-gradient(at 50% 0%, hsla(0, 0%, 10%, 1) 0, transparent 50%), 
    radial-gradient(at 100% 0%, hsla(45, 100%, 50%, 0.05) 0, transparent 50%)
  `,
  minHeight: '100vh',
  color: THEME.text,
  paddingBottom: '80px',
  backgroundAttachment: 'fixed',
});

const GlassPanel = styled(Box)({
  background: THEME.glass,
  backdropFilter: 'blur(16px)',
  border: `1px solid ${THEME.glassBorder}`,
  borderRadius: '20px',
  padding: '24px',
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
});

// Sticky Sidebar
const StickySidebar = styled(Box)({
  position: 'sticky',
  top: '100px', 
  height: 'fit-content',
  maxHeight: 'calc(100vh - 120px)',
  overflowY: 'auto',
  '&::-webkit-scrollbar': { width: '4px' },
  '&::-webkit-scrollbar-thumb': { backgroundColor: THEME.primary, borderRadius: '4px' }
});

// The Top "Control Deck"
const ControlBar = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '32px',
  padding: '16px 24px',
  background: 'rgba(20, 20, 20, 0.6)',
  backdropFilter: 'blur(12px)',
  borderRadius: '16px',
  border: `1px solid ${THEME.glassBorder}`,
  flexWrap: 'wrap',
  gap: '16px'
});

// Custom Sort Select
const SortSelect = styled(Select)({
  color: THEME.text,
  height: 40,
  borderRadius: '10px',
  '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: THEME.primary },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: THEME.primary },
  '.MuiSvgIcon-root': { color: THEME.primary }, // Yellow Icon
});

const StyledPagination = styled(Pagination)({
  '& .MuiPaginationItem-root': {
    color: THEME.textMuted,
    border: `1px solid ${THEME.glassBorder}`,
    borderRadius: '10px',
    '&:hover': {
      backgroundColor: 'rgba(255, 215, 0, 0.1)',
      borderColor: THEME.primary,
      color: THEME.primary,
    },
    '&.Mui-selected': {
      background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.secondary} 100%)`,
      color: '#000000', // Black text on Yellow
      fontWeight: 'bold',
      border: 'none',
      boxShadow: `0 0 15px ${alpha(THEME.primary, 0.2)}`,
      '&:hover': { opacity: 0.9, backgroundColor: '#e6c200' }
    }
  }
});

export default function Products() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  const { addItem } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    search: '', minPrice: 1000, maxPrice: 50000,
    category: '', brand: '', minRating: 0,
    inStock: false, sort: 'newest'
  });

  const [pagination, setPagination] = useState({
    page: 1, limit: 12, total: 0, pages: 0
  });

  // Product request form state
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestForm, setRequestForm] = useState({
    productName: '',
    description: ''
  });
  const [submittingRequest, setSubmittingRequest] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        // ... (Same mapping logic as your original code)
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
          setProducts(res.data.products);
          setPagination(res.data.pagination);
        } else {
          setProducts(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) { console.error(err); setProducts([]); } 
      finally { setLoading(false); }
    };
    loadProducts();
  }, [filters, pagination.page]);

  const handleFilterChange = (newFilters) => { setFilters(newFilters); setPagination(prev => ({ ...prev, page: 1 })); };
  const handlePageChange = (e, value) => { setPagination(prev => ({ ...prev, page: value })); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const toggleMobileFilters = () => setMobileOpen(!mobileOpen);

  // Product request handlers
  const handleRequestFormChange = (field, value) => {
    setRequestForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitRequest = async () => {
    if (!requestForm.productName.trim() || !requestForm.description.trim()) {
      return;
    }

    setSubmittingRequest(true);
    try {
      const requestData = {
        productName: requestForm.productName.trim(),
        description: requestForm.description.trim(),
        userId: user?._id || null
      };

      await submitProductRequest(requestData);

      // Reset form and hide
      setRequestForm({ productName: '', description: '' });
      setShowRequestForm(false);

      // Show success message (you might want to add a toast notification here)
      alert('Product request submitted successfully! We\'ll notify you when it becomes available.');

    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setSubmittingRequest(false);
    }
  };

  return (
    <PageWrapper>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        
        {/* 1. BREADCRUMBS & HEADER */}
        <Box mb={4}>
          <Breadcrumbs 
            separator={<NavigateNextIcon fontSize="small" sx={{ color: THEME.textMuted }} />} 
            sx={{ mb: 2 }}
          >
            <Link
              component="button"
              onClick={() => navigate('/')}
              sx={{ display: 'flex', alignItems: 'center', color: THEME.textMuted, textDecoration: 'none', '&:hover': { color: THEME.primary } }}
            >
              <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} /> Home
            </Link>
            <Typography color={THEME.primary} fontWeight={600}>Catalog</Typography>
          </Breadcrumbs>
          
          <Typography variant="h3" fontWeight={800} sx={{ 
            background: `linear-gradient(to right, #fff, ${THEME.textMuted})`, 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-1px'
          }}>
            Performance Parts
          </Typography>
        </Box>

        <Grid container spacing={4}>
          
          {/* 2. SIDEBAR (Desktop Sticky / Mobile Drawer) */}
          {isMobile ? (
            <Drawer
              anchor="left"
              open={mobileOpen}
              onClose={toggleMobileFilters}
              PaperProps={{
                sx: { width: '85%', bgcolor: '#000000', p: 3, borderRight: `1px solid ${THEME.glassBorder}`, color: '#fff' }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                   <TuneIcon sx={{ color: THEME.primary }} />
                   <Typography variant="h6" fontWeight="bold">FILTERS</Typography>
                </Stack>
                <IconButton onClick={toggleMobileFilters} sx={{ color: THEME.textMuted }}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <ProductFilter onFilterChange={handleFilterChange} initialFilters={filters} />
            </Drawer>
          ) : (
            <Grid item md={3} lg={2.5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <StickySidebar>
                <GlassPanel>
                  <Stack direction="row" spacing={1} alignItems="center" mb={3}>
                    <TuneIcon sx={{ color: THEME.primary }} />
                    <Typography variant="subtitle2" color={THEME.text} fontWeight={800} letterSpacing={1}>
                      SYSTEM CONFIG
                    </Typography>
                  </Stack>
                  <ProductFilter onFilterChange={handleFilterChange} initialFilters={filters} />
                </GlassPanel>
              </StickySidebar>
            </Grid>
          )}

          {/* 3. MAIN CONTENT */}
          <Grid item xs={12} md={9} lg={9.5}>
            
            {/* Control Deck (Result Count + Sort) */}
            <ControlBar>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                 {isMobile && (
                   <Button 
                     variant="outlined" 
                     startIcon={<FilterListIcon />}
                     onClick={toggleMobileFilters}
                     sx={{ borderColor: THEME.glassBorder, color: THEME.text, borderRadius: '10px' }}
                   >
                     Filter
                   </Button>
                 )}
                 <Stack direction="row" spacing={1} alignItems="center">
                    <GridViewIcon sx={{ color: THEME.textMuted }} />
                    <Typography variant="body2" color={THEME.textMuted}>
                      Showing <Box component="span" color={THEME.primary} fontWeight="bold">{products.length}</Box> of {pagination.total}
                    </Typography>
                 </Stack>
               </Box>
               
               <FormControl size="small">
                 <SortSelect
                   value={filters.sort}
                   onChange={(e) => handleFilterChange({ ...filters, sort: e.target.value })}
                   displayEmpty
                   startAdornment={<SortIcon sx={{ mr: 1, color: THEME.primary }} />}
                   MenuProps={{ PaperProps: { sx: { bgcolor: '#1c1c1e', color: '#fff', border: `1px solid ${THEME.glassBorder}` } } }}
                 >
                   <MenuItem value="newest">Newest Arrivals</MenuItem>
                   <MenuItem value="price_asc">Price: Low to High</MenuItem>
                   <MenuItem value="price_desc">Price: High to Low</MenuItem>
                   <MenuItem value="rating">Top Rated</MenuItem>
                 </SortSelect>
               </FormControl>
            </ControlBar>

            {/* Loading State */}
            {loading && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10 }}>
                <CircularProgress size={60} sx={{ color: THEME.primary }} thickness={2} />
                <Typography mt={2} color={THEME.textMuted} letterSpacing={2}>LOADING DATABASE...</Typography>
              </Box>
            )}

            {/* No Results State */}
            {!loading && products.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 10, border: `1px dashed ${THEME.glassBorder}`, borderRadius: '20px', bgcolor: 'rgba(255,255,255,0.02)' }}>
                <SearchOffIcon sx={{ fontSize: 60, color: THEME.textMuted, mb: 2, opacity: 0.5 }} />
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>No parts found</Typography>

                {/* Show request form when no products found */}
                {!showRequestForm && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="body1" color={THEME.textMuted} sx={{ mb: 3 }}>
                      Can't find what you're looking for? Let us know!
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => setShowRequestForm(true)}
                      sx={{
                        background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.secondary} 100%)`,
                        color: '#000', // Black Text
                        px: 4,
                        py: 1.5,
                        borderRadius: '12px',
                        fontWeight: 'bold',
                        boxShadow: `0 0 20px ${alpha(THEME.primary, 0.2)}`,
                        '&:hover': {
                          background: '#e6c200',
                          transform: 'translateY(-2px)',
                          boxShadow: `0 0 30px ${alpha(THEME.primary, 0.4)}`
                        }
                      }}
                    >
                      Request This Product
                    </Button>
                  </Box>
                )}

                {/* Product Request Form */}
                {showRequestForm && (
                  <Fade in={showRequestForm}>
                    <GlassPanel sx={{ mt: 4, maxWidth: 500, mx: 'auto', textAlign: 'left' }}>
                      <Typography variant="h6" sx={{ mb: 3, color: THEME.primary, fontWeight: 'bold' }}>
                        Request Product
                      </Typography>

                      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                          label="Product Name"
                          value={requestForm.productName}
                          onChange={(e) => handleRequestFormChange('productName', e.target.value)}
                          required
                          fullWidth
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              bgcolor: 'rgba(20,20,20,0.6)',
                              borderRadius: '10px',
                              color: THEME.text,
                              '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                              '&:hover fieldset': { borderColor: THEME.primary },
                              '&.Mui-focused fieldset': { borderColor: THEME.primary }
                            },
                            '& .MuiInputLabel-root': { color: THEME.textMuted },
                            '& .MuiInputLabel-root.Mui-focused': { color: THEME.primary }
                          }}
                        />

                        <TextField
                          label="Description / Additional Notes"
                          value={requestForm.description}
                          onChange={(e) => handleRequestFormChange('description', e.target.value)}
                          required
                          multiline
                          rows={3}
                          fullWidth
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              bgcolor: 'rgba(20,20,20,0.6)',
                              borderRadius: '10px',
                              color: THEME.text,
                              '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                              '&:hover fieldset': { borderColor: THEME.primary },
                              '&.Mui-focused fieldset': { borderColor: THEME.primary }
                            },
                            '& .MuiInputLabel-root': { color: THEME.textMuted },
                            '& .MuiInputLabel-root.Mui-focused': { color: THEME.primary }
                          }}
                        />

                        {user && (
                          <Typography variant="caption" color={THEME.textMuted}>
                            Request will be associated with your account: {user.name}
                          </Typography>
                        )}

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                          <Button
                            onClick={() => {
                              setShowRequestForm(false);
                              setRequestForm({ productName: '', description: '' });
                            }}
                            sx={{ color: THEME.textMuted }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSubmitRequest}
                            disabled={submittingRequest || !requestForm.productName.trim() || !requestForm.description.trim()}
                            variant="contained"
                            sx={{
                              background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.secondary} 100%)`,
                              color: '#000', // Black Text
                              borderRadius: '10px',
                              fontWeight: 'bold',
                              '&:hover': {
                                background: '#e6c200'
                              },
                              '&:disabled': {
                                background: 'rgba(255,255,255,0.1)',
                                color: '#666'
                              }
                            }}
                          >
                            {submittingRequest ? 'Submitting...' : 'Submit Request'}
                          </Button>
                        </Box>
                      </Box>
                    </GlassPanel>
                  </Fade>
                )}

                {/* Reset Search Button */}
                <Button
                  variant="text"
                  onClick={() => handleFilterChange({ ...filters, search: '', category: '', brand: '' })}
                  sx={{ mt: 3, color: THEME.primary }}
                >
                  Reset Search
                </Button>
              </Box>
            )}

            {/* Product Grid */}
            {!loading && products.length > 0 && (
              <>
                <Grid container spacing={3}>
                  {products.map((product, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                      <Box sx={{ 
                        animation: `${fadeInUp} 0.5s ease-out both`, 
                        animationDelay: `${index * 0.05}s`,
                        height: '100%' 
                      }}>
                        {/* Using a Box wrapper to ensure hover effects work perfectly with glass theme */}
                        <Box sx={{
                          height: '100%',
                          transition: 'transform 0.3s ease',
                          '&:hover': { transform: 'translateY(-8px)', zIndex: 2 }
                        }}>
                           <ProductCard product={product} onAdded={(product) => addItem(product._id, 1)} />
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <Stack alignItems="center" sx={{ mt: 8 }}>
                    <GlassPanel sx={{ py: 1, px: 3, borderRadius: '50px !important' }}>
                      <StyledPagination
                        count={pagination.pages}
                        page={pagination.page}
                        onChange={handlePageChange}
                        variant="outlined"
                        shape="rounded"
                        size="large"
                      />
                    </GlassPanel>
                    <Typography variant="caption" color={THEME.textMuted} sx={{ mt: 2 }}>
                      Page {pagination.page} of {pagination.pages}
                    </Typography>
                  </Stack>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    </PageWrapper>
  );
}