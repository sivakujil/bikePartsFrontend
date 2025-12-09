import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Stack
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';

const ProductFilter = ({ onFilterChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    search: '',
    minPrice: 1000,
    maxPrice: 50000,
    category: '',
    brand: '',
    minRating: 0,
    inStock: false,
    sort: 'newest',
    ...initialFilters
  });

  const [priceRange, setPriceRange] = useState([1000, 50000]);
  const [categories] = useState([
    'Engine Parts',
    'Brake System',
    'Suspension',
    'Transmission',
    'Electrical',
    'Body Parts',
    'Wheels & Tires',
    'Exhaust System',
    'Cooling System',
    'Accessories'
  ]);

  const [brands] = useState([
    'Bajaj',
    'Yamaha',
    'Honda',
    'KTM',
    'TVS'
  ]);

  const [sortOptions] = useState([
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'name', label: 'Name: A-Z' }
  ]);

  const [ratingOptions] = useState([
    { value: 4, label: '4+ Stars' },
    { value: 3, label: '3+ Stars' },
    { value: 2, label: '2+ Stars' },
    { value: 1, label: '1+ Stars' }
  ]);

  // Update price range when min/max price changes
  useEffect(() => {
    setPriceRange([filters.minPrice, filters.maxPrice]);
  }, [filters.minPrice, filters.maxPrice]);

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
    handleFilterChange('minPrice', newValue[0]);
    handleFilterChange('maxPrice', newValue[1]);
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      minPrice: 1000,
      maxPrice: 50000,
      category: '',
      brand: '',
      minRating: 0,
      inStock: false,
      sort: 'newest'
    };
    setFilters(resetFilters);
    setPriceRange([1000, 50000]);
    onFilterChange(resetFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.minPrice > 1000 || filters.maxPrice < 50000) count++;
    if (filters.category) count++;
    if (filters.brand) count++;
    if (filters.minRating > 0) count++;
    if (filters.inStock) count++;
    return count;
  };

  // Add Product Funnction 

  return (
    <Card sx={{ position: 'sticky', top: 20 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <FilterListIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" fontWeight="bold">
            Filters
            {getActiveFiltersCount() > 0 && (
              <Chip 
                label={getActiveFiltersCount()} 
                size="small" 
                color="primary" 
                sx={{ ml: 1 }} 
              />
            )}
          </Typography>
        </Box>

        {/* Search */}
        <TextField
          fullWidth
          label="Search Products"
          variant="outlined"
          size="small"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          sx={{ mb: 3 }}
        />

        {/* Price Range */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="medium">
              Price Range
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ px: 1, pt: 2 }}>
              <Slider
                value={priceRange}
                onChange={handlePriceRangeChange}
                valueLabelDisplay="auto"
                min={1000}
                max={50000}
                step={1000}
                marks={[
                  { value: 1000, label: 'Rs 1000' },
                  { value: 10000, label: 'Rs 10,000' },
                  { value: 25000, label: 'Rs 25,000' },
                  { value: 40000, label: 'Rs 40,000' },
                  { value: 50000, label: 'Rs 50,000' }
                ]}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Min: Rs {filters.minPrice}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Max: Rs {filters.maxPrice}
                </Typography>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Category */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="medium">
              Category
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth size="small">
              <Select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                displayEmpty
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </AccordionDetails>
        </Accordion>

        {/* Brand */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="medium">
              Brand
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth size="small">
              <Select
                value={filters.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                displayEmpty
              >
                <MenuItem value="">All Brands</MenuItem>
                {brands.map((brand) => (
                  <MenuItem key={brand} value={brand}>
                    {brand}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </AccordionDetails>
        </Accordion>

        {/* Rating */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="medium">
              Minimum Rating
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth size="small">
              <Select
                value={filters.minRating}
                onChange={(e) => handleFilterChange('minRating', e.target.value)}
                displayEmpty
              >
                <MenuItem value={0}>All Ratings</MenuItem>
                {ratingOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </AccordionDetails>
        </Accordion>

        {/* In Stock */}
        <Box sx={{ mt: 2, mb: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.inStock}
                onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                color="primary"
              />
            }
            label="In Stock Only"
          />
        </Box>

        {/* Sort */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="medium">
              Sort By
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth size="small">
              <Select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </AccordionDetails>
        </Accordion>

        {/* Active Filters Display */}
        {getActiveFiltersCount() > 0 && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Active Filters:
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {filters.search && (
                <Chip 
                  label={`Search: ${filters.search}`} 
                  size="small" 
                  onDelete={() => handleFilterChange('search', '')}
                />
              )}
              {(filters.minPrice > 1000 || filters.maxPrice < 50000) && (
                <Chip
                  label={`Price: Rs ${filters.minPrice} - Rs ${filters.maxPrice}`}
                  size="small"
                  onDelete={() => {
                    handleFilterChange('minPrice', 1000);
                    handleFilterChange('maxPrice', 50000);
                  }}
                />
              )}
              {filters.category && (
                <Chip 
                  label={`Category: ${filters.category}`} 
                  size="small" 
                  onDelete={() => handleFilterChange('category', '')}
                />
              )}
              {filters.brand && (
                <Chip 
                  label={`Brand: ${filters.brand}`} 
                  size="small" 
                  onDelete={() => handleFilterChange('brand', '')}
                />
              )}
              {filters.minRating > 0 && (
                <Chip 
                  label={`Rating: ${filters.minRating}+ stars`} 
                  size="small" 
                  onDelete={() => handleFilterChange('minRating', 0)}
                />
              )}
              {filters.inStock && (
                <Chip 
                  label="In Stock" 
                  size="small" 
                  onDelete={() => handleFilterChange('inStock', false)}
                />
              )}
            </Stack>
          </Box>
        )}

        {/* Reset Button */}
        <Button
          fullWidth
          variant="outlined"
          onClick={handleReset}
          sx={{ mt: 2 }}
        >
          Reset All Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductFilter;
