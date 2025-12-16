import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Slider,
  FormControl,
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

  const categories = [
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
  ];

  const brands = ['Bajaj', 'Yamaha', 'Honda', 'KTM', 'TVS'];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'name', label: 'Name: A-Z' }
  ];

  const ratingOptions = [
    { value: 4, label: '4+ Stars' },
    { value: 3, label: '3+ Stars' },
    { value: 2, label: '2+ Stars' },
    { value: 1, label: '1+ Stars' }
  ];

  useEffect(() => {
    setPriceRange([filters.minPrice, filters.maxPrice]);
  }, [filters.minPrice, filters.maxPrice]);

  const handleFilterChange = (field, value) => {
    const updated = { ...filters, [field]: value };
    setFilters(updated);
    onFilterChange(updated);
  };

  const handlePriceChange = (_, newValue) => {
    setPriceRange(newValue);
    handleFilterChange('minPrice', newValue[0]);
    handleFilterChange('maxPrice', newValue[1]);
  };

  const handleReset = () => {
    const reset = {
      search: '',
      minPrice: 1000,
      maxPrice: 50000,
      category: '',
      brand: '',
      minRating: 0,
      inStock: false,
      sort: 'newest'
    };
    setFilters(reset);
    setPriceRange([1000, 50000]);
    onFilterChange(reset);
  };

  const activeCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.minPrice > 1000 || filters.maxPrice < 50000) count++;
    if (filters.category) count++;
    if (filters.brand) count++;
    if (filters.minRating) count++;
    if (filters.inStock) count++;
    return count;
  };

  return (
    <Card sx={{ position: 'sticky', top: 20 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FilterListIcon sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight="bold">
            Filters
            {activeCount() > 0 && (
              <Chip label={activeCount()} size="small" sx={{ ml: 1 }} />
            )}
          </Typography>
        </Box>

        {/* Search */}
        <TextField
          fullWidth
          size="small"
          label="Search Products"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Price Range */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="medium">Price Range</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              min={1000}
              max={50000}
              step={1000}
              valueLabelDisplay="auto"
              valueLabelFormat={(v) => `Rs ${v.toLocaleString()}`}
            />

            {/* Clean Min / Max Display */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 1
              }}
            >
              <Typography variant="caption">
                Rs {priceRange[0].toLocaleString()}
              </Typography>
              <Typography variant="caption">
                Rs {priceRange[1].toLocaleString()}
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Category */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="medium">Category</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth size="small">
              <Select
                value={filters.category}
                onChange={(e) =>
                  handleFilterChange('category', e.target.value)
                }
                displayEmpty
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </AccordionDetails>
        </Accordion>

        {/* Brand */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="medium">Brand</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth size="small">
              <Select
                value={filters.brand}
                onChange={(e) =>
                  handleFilterChange('brand', e.target.value)
                }
                displayEmpty
              >
                <MenuItem value="">All Brands</MenuItem>
                {brands.map((b) => (
                  <MenuItem key={b} value={b}>
                    {b}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </AccordionDetails>
        </Accordion>

        {/* Rating */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="medium">Minimum Rating</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth size="small">
              <Select
                value={filters.minRating}
                onChange={(e) =>
                  handleFilterChange('minRating', e.target.value)
                }
              >
                <MenuItem value={0}>All Ratings</MenuItem>
                {ratingOptions.map((r) => (
                  <MenuItem key={r.value} value={r.value}>
                    {r.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </AccordionDetails>
        </Accordion>

        {/* In Stock */}
        <FormControlLabel
          sx={{ mt: 1 }}
          control={
            <Checkbox
              checked={filters.inStock}
              onChange={(e) =>
                handleFilterChange('inStock', e.target.checked)
              }
            />
          }
          label="In Stock Only"
        />

        {/* Sort */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="medium">Sort By</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth size="small">
              <Select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
              >
                {sortOptions.map((s) => (
                  <MenuItem key={s.value} value={s.value}>
                    {s.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </AccordionDetails>
        </Accordion>

        {/* Reset */}
        <Button fullWidth variant="outlined" sx={{ mt: 2 }} onClick={handleReset}>
          Reset All Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductFilter;
