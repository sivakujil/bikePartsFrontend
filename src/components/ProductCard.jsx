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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

const THEME = {
  primary: "#FFD700",
  secondary: "#FDB931",
  bgCard: "#1c1c1e",
  textMain: "#FFFFFF",
  textSecondary: "#9ca3af",
  border: "rgba(255, 255, 255, 0.1)",
  accent: "#FF4B2B",
};

const StyledCard = styled(Card)(() => ({
  background: `linear-gradient(135deg, ${THEME.bgCard} 0%, rgba(28,28,30,0.9) 100%)`,
  border: `1px solid ${THEME.border}`,
  borderRadius: "16px",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "0.3s",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-6px)",
    borderColor: THEME.primary,
  },
}));

const ProductCard = ({ product, onAdded }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const imageUrl =
    product.images?.[0] && !imageError
      ? product.images[0]
      : "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzFjMWMxZSI+PHRleHQgeD0iMTUwIiB5PSIxNjAiIGZpbGw9IiNGRkQ3MDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";

  return (
    <StyledCard onClick={() => navigate(`/product/${product._id}`)}>
      {/* SMALLER IMAGE AREA */}
      <Box
        sx={{
          position: "relative",
          height: 180,           // 🔹 Reduced image height
          p: 2,                  // 🔹 Inner spacing
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CardMedia
          component="img"
          image={imageUrl}
          alt={product.name}
          onError={() => setImageError(true)}
          sx={{
            maxHeight: "100%",
            maxWidth: "100%",
            objectFit: "contain", // 🔹 Makes image smaller & neat
          }}
        />

        <Chip
          label={product.quantity > 0 ? "In Stock" : "Out of Stock"}
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            bgcolor:
              product.quantity > 0
                ? "rgba(255,215,0,0.9)"
                : "rgba(244,67,54,0.9)",
            color: product.quantity > 0 ? "#000" : "#fff",
            fontWeight: "bold",
            fontSize: "0.7rem",
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          sx={{
            color: THEME.textMain,
            fontWeight: 600,
            fontSize: "0.95rem",
            mb: 1,
          }}
        >
          {product.name}
        </Typography>

        {product.rating && (
          <Rating
            value={product.rating}
            readOnly
            size="small"
            sx={{
              mb: 1,
              "& .MuiRating-iconFilled": { color: THEME.primary },
            }}
          />
        )}

        <Typography
          sx={{
            color: THEME.primary,
            fontWeight: 700,
            fontSize: "1rem",
            mb: 1,
          }}
        >
          Rs {product.discountPrice || product.price}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, mt: "auto" }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<VisibilityIcon />}
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product._id}`);
            }}
            sx={{ flex: 1, color: THEME.textMain }}
          >
            View
          </Button>

          <Button
            variant="contained"
            size="small"
            startIcon={<ShoppingCartIcon />}
            disabled={product.quantity <= 0}
            onClick={(e) => {
              e.stopPropagation();
              onAdded(product);
            }}
            sx={{
              flex: 1,
              bgcolor: THEME.primary,
              color: "#000",
              fontWeight: "bold",
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
