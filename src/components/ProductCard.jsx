import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Rating,
  IconButton,
  Tooltip,
} from "@mui/material";
import { styled } from '@mui/material/styles';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

// Theme colors (matching the app theme)
const THEME = {
  primary: '#FFD700', // Yellow
  secondary: '#FDB931', // Gold
  bgCard: '#1c1c1e',
  textMain: '#FFFFFF',
  textSecondary: '#9ca3af',
  border: 'rgba(255, 255, 255, 0.1)',
  accent: '#FF4B2B' // Red accent
};

// Styled Card with glass effect
const StyledCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${THEME.bgCard} 0%, rgba(28, 28, 30, 0.9) 100%)`,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${THEME.border}`,
  borderRadius: '16px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 20px 40px rgba(255, 215, 0, 0.15)`,
    borderColor: THEME.primary,
  },
}));

const ProductCard = ({ product, onAdded }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent card click
    if (onAdded) {
      onAdded(product);
    }
  };

  const handleViewDetails = (e) => {
    e.stopPropagation(); // Prevent card click
    navigate(`/product/${product._id}`);
  };

  // Fallback image
  const imageUrl = product.images?.[0] && !imageError
    ? product.images[0]
    : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMWMxYzFlIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjIwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNGRkQ3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4=';

  return (
    <StyledCard onClick={handleCardClick}>
      {/* Product Image */}
      <Box sx={{ position: 'relative', paddingTop: '100%' }}>
        <CardMedia
          component="img"
          image={imageUrl}
          alt={product.name}
          onError={() => setImageError(true)}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '16px 16px 0 0',
          }}
        />

        {/* Stock Status Badge */}
        <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
          <Chip
            label={product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
            size="small"
            sx={{
              bgcolor: product.quantity > 0
                ? 'rgba(255, 215, 0, 0.9)'
                : 'rgba(244, 67, 54, 0.9)',
              color: product.quantity > 0 ? '#000' : '#fff',
              fontWeight: 'bold',
              fontSize: '0.7rem',
            }}
          />
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
        {/* Product Name */}
        <Typography
          variant="h6"
          component="h2"
          sx={{
            color: THEME.textMain,
            fontWeight: 600,
            fontSize: '1rem',
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.3,
          }}
        >
          {product.name}
        </Typography>

        {/* Rating */}
        {product.rating && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating
              value={product.rating}
              readOnly
              precision={0.5}
              size="small"
              sx={{
                '& .MuiRating-iconFilled': { color: THEME.primary },
                '& .MuiRating-iconEmpty': { color: 'rgba(255,255,255,0.2)' }
              }}
            />
            <Typography variant="caption" sx={{ color: THEME.textSecondary, ml: 0.5 }}>
              ({product.reviews || 0})
            </Typography>
          </Box>
        )}

        {/* Price */}
        <Typography
          variant="h6"
          sx={{
            color: THEME.primary,
            fontWeight: 700,
            fontSize: '1.1rem',
            mb: 2,
          }}
        >
          Rs {product.price?.toLocaleString()}
        </Typography>

        {/* Category/Brand */}
        {(product.category || product.brand) && (
          <Box sx={{ mb: 2 }}>
            {product.category && (
              <Typography variant="caption" sx={{ color: THEME.textSecondary, display: 'block' }}>
                {product.category}
              </Typography>
            )}
            {product.brand && (
              <Typography variant="caption" sx={{ color: THEME.textSecondary, display: 'block' }}>
                {product.brand}
              </Typography>
            )}
          </Box>
        )}

        {/* Action Buttons */}
        <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<VisibilityIcon />}
            onClick={handleViewDetails}
            sx={{
              flex: 1,
              borderColor: THEME.border,
              color: THEME.textMain,
              '&:hover': {
                borderColor: THEME.primary,
                bgcolor: 'rgba(255, 215, 0, 0.1)',
              }
            }}
          >
            View
          </Button>

          <Button
            variant="contained"
            size="small"
            startIcon={<ShoppingCartIcon />}
            onClick={handleAddToCart}
            disabled={product.quantity <= 0}
            sx={{
              flex: 1,
              bgcolor: THEME.primary,
              color: '#000',
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: THEME.secondary,
              },
              '&:disabled': {
                bgcolor: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.3)',
              }
            }}
          >
            Add
          </Button>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default ProductCard;