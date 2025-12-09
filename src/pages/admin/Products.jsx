import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Box,
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Container,
  MenuItem,
  Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productService";

// -------- Product Form Modal --------
function ProductFormModal({ open, onClose, onSaved, initialProduct = null }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    brand: "",
    price: "",
    cost: "",
    quantity: "",
    description: "",
    images: [],
    specifications: {},
    isFeatured: false,
    reorderLevel: 50,
    reorderThreshold: 10,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (initialProduct) {
      setForm({
        name: initialProduct.name || "",
        category: initialProduct.category || "",
        brand: initialProduct.brand || "",
        price: initialProduct.price || "",
        cost: initialProduct.cost || "",
        quantity: initialProduct.quantity || "",
        description: initialProduct.description || "",
        images: initialProduct.images || [],
        specifications: initialProduct.specifications || {},
        isFeatured: initialProduct.isFeatured || false,
        reorderLevel: initialProduct.reorderLevel || 50,
        reorderThreshold: initialProduct.reorderThreshold || 10,
      });
      setImageUrl("");
    } else {
      setForm({
        name: "",
        category: "",
        brand: "",
        price: "",
        cost: "",
        quantity: "",
        description: "",
        images: [],
        specifications: {},
        isFeatured: false,
        reorderLevel: 50,
        reorderThreshold: 10,
      });
      setImageUrl("");
    }
    setError("");
  }, [initialProduct, open]);

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, imageUrl],
      }));
      setImageUrl("");
    }
  };

  const handleRemoveImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      setError("");

      // Validation
      if (!form.name.trim()) {
        setError("Product name is required");
        return;
      }
      if (!form.category.trim()) {
        setError("Category is required");
        return;
      }
      if (!form.price || parseFloat(form.price) <= 0) {
        setError("Valid price is required");
        return;
      }
      if (!form.cost || parseFloat(form.cost) <= 0) {
        setError("Valid cost is required");
        return;
      }

      setLoading(true);

      const productData = {
        name: form.name,
        category: form.category,
        brand: form.brand,
        price: parseFloat(form.price),
        cost: parseFloat(form.cost),
        quantity: parseInt(form.quantity) || 0,
        description: form.description,
        images: form.images && form.images.length > 0 ? form.images : [],
        specifications: form.specifications,
        isFeatured: form.isFeatured,
        reorderLevel: parseInt(form.reorderLevel) || 50,
        reorderThreshold: parseInt(form.reorderThreshold) || 10,
      };

      if (initialProduct && initialProduct._id) {
        await updateProduct(initialProduct._id, productData);
      } else {
        await createProduct(productData);
      }

      onSaved();
      onClose();
    } catch (err) {
      console.error("Save error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {initialProduct ? "Edit Product" : "Add New Product"}
      </DialogTitle>
      <DialogContent sx={{ display: "grid", gap: 2, pt: 2 }}>
        {error && <Alert severity="error">{error}</Alert>}

        <Grid container spacing={2}>
          {/* Basic Info */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold">
              Basic Information
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Product Name"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Brand"
              name="brand"
              value={form.brand}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Category"
              name="category"
              value={form.category}
              onChange={handleInputChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={form.description}
              onChange={handleInputChange}
              multiline
              rows={3}
            />
          </Grid>

          {/* Pricing */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold">
              Pricing & Inventory
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Price (Rs)"
              name="price"
              type="number"
              value={form.price}
              onChange={handleInputChange}
              required
              inputProps={{ step: "0.01" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Cost (Rs)"
              name="cost"
              type="number"
              value={form.cost}
              onChange={handleInputChange}
              required
              inputProps={{ step: "0.01" }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Quantity"
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Reorder Level"
              name="reorderLevel"
              type="number"
              value={form.reorderLevel}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Reorder Threshold"
              name="reorderThreshold"
              type="number"
              value={form.reorderThreshold}
              onChange={handleInputChange}
            />
          </Grid>

          {/* Images */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold">
              Product Images
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                label="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              <Button
                variant="outlined"
                onClick={handleAddImage}
                sx={{ whiteSpace: "nowrap" }}
              >
                Add Image
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {form.images.map((img, idx) => (
                <Box
                  key={idx}
                  sx={{
                    position: "relative",
                    width: 100,
                    height: 100,
                    mb: 1,
                  }}
                >
                  <img
                    src={img}
                    alt={`Product ${idx}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveImage(idx)}
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bgcolor: "rgba(255, 0, 0, 0.7)",
                      color: "white",
                      "&:hover": { bgcolor: "rgba(255, 0, 0, 1)" },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Featured */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 1 }}>
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={handleInputChange}
                />
                <Typography>Mark as Featured Product</Typography>
              </label>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : undefined}
        >
          {loading ? "Saving..." : initialProduct ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// -------- Product Card --------
function ProductCardView({ product, onEdit, onDelete }) {
  return (
    <Card sx={{ maxWidth: 280 }}>
      <CardMedia
        component="img"
        height="180"
        image={
          product.images && product.images[0]
            ? product.images[0]
            : "https://picsum.photos/300/180?random=" + product._id
        }
        alt={product.name}
        sx={{ objectFit: "cover" }}
      />
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold" noWrap>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {product.brand} - {product.category}
        </Typography>
        <Box sx={{ my: 1 }}>
          <Typography variant="h6" color="primary">
            Rs {product.price}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cost: Rs {product.cost}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          color={product.quantity > 0 ? "success.main" : "error.main"}
          fontWeight="bold"
        >
          {product.quantity} in stock
        </Typography>
        {product.isFeatured && (
          <Chip
            label="Featured"
            size="small"
            color="primary"
            sx={{ mt: 1, mr: 0.5 }}
          />
        )}
        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => onEdit(product)}
            startIcon={<EditIcon />}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => onDelete(product._id)}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

// -------- Product Table View --------
function ProductTableView({ products, onEdit, onDelete }) {
  return (
    <Paper sx={{ overflow: "auto" }}>
      <Table>
        <TableHead sx={{ bgcolor: "#f5f5f5" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Image</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Brand</TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Price
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Cost
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Quantity
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product._id} hover>
              <TableCell>
                <img
                  src={
                    product.images && product.images[0]
                      ? product.images[0]
                      : "https://picsum.photos/50/50?random=" + product._id
                  }
                  alt={product.name}
                  style={{
                    width: 50,
                    height: 50,
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {product.name}
                </Typography>
              </TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.brand}</TableCell>
              <TableCell align="right">
                <Typography variant="body2" fontWeight="medium">
                  Rs {product.price.toFixed(2)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" color="text.secondary">
                  Rs {product.cost.toFixed(2)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Chip
                  label={product.quantity}
                  color={product.quantity > 0 ? "success" : "error"}
                  variant="outlined"
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                  {product.isFeatured && (
                    <Chip label="Featured" size="small" color="primary" />
                  )}
                  {product.quantity <= product.reorderThreshold && (
                    <Chip
                      label="Low Stock"
                      size="small"
                      color="warning"
                      variant="outlined"
                    />
                  )}
                </Box>
              </TableCell>
              <TableCell align="center">
                <IconButton
                  size="small"
                  onClick={() => onEdit(product)}
                  color="primary"
                  title="Edit Product"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete(product._id)}
                  title="Delete Product"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

// -------- Main Admin Products Component --------
export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("all"); // all, instock, lowstock, outofstock
  const [sortBy, setSortBy] = useState("name"); // name, price, quantity, created

  // Enhanced load products with filtering and sorting
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllProducts();
      const productList = data.products || data || [];
      setProducts(productList);
      applyFiltersAndSort(productList);
    } catch (err) {
      console.error("Error loading products:", err);
      setError(err.response?.data?.message || "Failed to load products");
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Apply filters and sorting
  const applyFiltersAndSort = (productList) => {
    let filtered = [...productList];

    // Search filter
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term) ||
          (p.brand && p.brand.toLowerCase().includes(term)) ||
          (p.description && p.description.toLowerCase().includes(term))
      );
    }

    // Category filter
    if (categoryFilter !== "") {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    // Stock filter
    if (stockFilter !== "all") {
      filtered = filtered.filter(p => {
        if (stockFilter === "instock") return p.quantity > p.reorderThreshold;
        if (stockFilter === "lowstock") return p.quantity > 0 && p.quantity <= p.reorderThreshold;
        if (stockFilter === "outofstock") return p.quantity === 0;
        return true;
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return a.price - b.price;
        case "quantity":
          return a.quantity - b.quantity;
        case "created":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    applyFiltersAndSort(products);
  }, [searchTerm, categoryFilter, stockFilter, sortBy, products]);

  // Enhanced product functions
  const handleAddNew = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleEdit = (product) => {
    console.log("Editing product:", product);
    if (!product || !product._id) {
      setError("Invalid product selected for editing");
      return;
    }
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDuplicate = async (product) => {
    try {
      setError("");
      const duplicatedProduct = {
        ...product,
        name: `${product.name} (Copy)`,
        _id: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      };
      await createProduct(duplicatedProduct);
      await loadProducts();
    } catch (err) {
      console.error("Duplicate error:", err);
      setError(err.response?.data?.message || "Failed to duplicate product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }
    try {
      setError("");
      await deleteProduct(id);
      await loadProducts();
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.response?.data?.message || "Failed to delete product");
    }
  };

  const handleBulkDelete = async (ids) => {
    if (!window.confirm(`Are you sure you want to delete ${ids.length} products? This action cannot be undone.`)) {
      return;
    }
    try {
      setError("");
      await Promise.all(ids.map(id => deleteProduct(id)));
      await loadProducts();
    } catch (err) {
      console.error("Bulk delete error:", err);
      setError(err.response?.data?.message || "Failed to delete products");
    }
  };

  const handleToggleFeatured = async (product) => {
    try {
      setError("");
      await updateProduct(product._id, { ...product, isFeatured: !product.isFeatured });
      await loadProducts();
    } catch (err) {
      console.error("Toggle featured error:", err);
      setError(err.response?.data?.message || "Failed to update product");
    }
  };

  const handleBulkUpdateStock = async (updates) => {
    try {
      setError("");
      await Promise.all(updates.map(({ id, quantity }) => 
        updateProduct(id, { quantity: parseInt(quantity) })
      ));
      await loadProducts();
    } catch (err) {
      console.error("Bulk update error:", err);
      setError(err.response?.data?.message || "Failed to update stock");
    }
  };

  const handleExportProducts = () => {
    const csvContent = [
      ["Name", "Category", "Brand", "Price", "Cost", "Quantity", "Featured", "Description"],
      ...filteredProducts.map(p => [
        p.name,
        p.category,
        p.brand || "",
        p.price,
        p.cost,
        p.quantity,
        p.isFeatured ? "Yes" : "No",
        p.description || ""
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImportProducts = async (file) => {
    try {
      setError("");
      const text = await file.text();
      const lines = text.split("\n");
      const headers = lines[0].split(",");
      
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === "") continue;
        const values = lines[i].split(",");
        const product = {
          name: values[0]?.trim() || "",
          category: values[1]?.trim() || "",
          brand: values[2]?.trim() || "",
          price: parseFloat(values[3]) || 0,
          cost: parseFloat(values[4]) || 0,
          quantity: parseInt(values[5]) || 0,
          isFeatured: values[6]?.trim()?.toLowerCase() === "yes",
          description: values[7]?.trim() || "",
          images: [],
        };
        await createProduct(product);
      }
      await loadProducts();
    } catch (err) {
      console.error("Import error:", err);
      setError(err.response?.data?.message || "Failed to import products");
    }
  };

  const handleSaved = () => {
    loadProducts();
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  // Get unique categories for filter
  const getCategories = () => {
    return [...new Set(products.map(p => p.category))].filter(Boolean);
  };

  // Get selected products for bulk operations
  const [selectedProducts, setSelectedProducts] = useState([]);
  const handleSelectProduct = (id) => {
    setSelectedProducts(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };
  const handleSelectAll = () => {
    setSelectedProducts(
      selectedProducts.length === filteredProducts.length 
        ? []
        : filteredProducts.map(p => p._id)
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Product Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
          size="large"
        >
          Add Product
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Total Products
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {products.length}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Low Stock
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="warning.main">
              {products.filter((p) => p.quantity <= p.reorderThreshold).length}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Out of Stock
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="error.main">
              {products.filter((p) => p.quantity === 0).length}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Featured
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="primary">
              {products.filter((p) => p.isFeatured).length}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Enhanced Search and Filter Controls */}
      <Box sx={{ mb: 3 }}>
        {/* Search */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search products by name, category, brand, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
            }}
          />
        </Box>

        {/* Second Row - Filters and Actions */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
          {/* Category Filter */}
          <TextField
            select
            label="Category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            sx={{ minWidth: 150 }}
            size="small"
          >
            <MenuItem value="">All Categories</MenuItem>
            {getCategories().map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>

          {/* Stock Filter */}
          <TextField
            select
            label="Stock Status"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            sx={{ minWidth: 120 }}
            size="small"
          >
            <MenuItem value="all">All Stock</MenuItem>
            <MenuItem value="instock">In Stock</MenuItem>
            <MenuItem value="lowstock">Low Stock</MenuItem>
            <MenuItem value="outofstock">Out of Stock</MenuItem>
          </TextField>

          {/* Sort By */}
          <TextField
            select
            label="Sort By"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            sx={{ minWidth: 120 }}
            size="small"
          >
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="price">Price</MenuItem>
            <MenuItem value="quantity">Quantity</MenuItem>
            <MenuItem value="created">Date Created</MenuItem>
          </TextField>

          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <>
              <Chip
                label={`${selectedProducts.length} selected`}
                color="primary"
                onDelete={() => setSelectedProducts([])}
              />
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => handleBulkDelete(selectedProducts)}
              >
                Delete Selected
              </Button>
            </>
          )}

          {/* Import/Export */}
          <Button
            variant="outlined"
            size="small"
            onClick={handleExportProducts}
          >
            Export CSV
          </Button>
          <Button
            variant="outlined"
            size="small"
            component="label"
          >
            Import CSV
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={(e) => e.target.files[0] && handleImportProducts(e.target.files[0])}
            />
          </Button>

          {/* Quick Actions */}
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              const lowStockProducts = products.filter(p => p.quantity <= p.reorderThreshold);
              if (lowStockProducts.length > 0) {
                alert(`${lowStockProducts.length} products need restocking!`);
              } else {
                alert("All products have sufficient stock!");
              }
            }}
          >
            Check Stock
          </Button>
        </Box>
      </Box>

      {/* Loading */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredProducts.length === 0 ? (
        <Alert severity="info">
          {searchTerm ? "No products match your search" : "No products found"}
        </Alert>
      ) : (
        <ProductTableView
          products={filteredProducts}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Product Form Modal */}
      <ProductFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSaved={handleSaved}
        initialProduct={editingProduct}
      />
    </Container>
  );
}




// import React, { useEffect, useState } from "react";
// import {
//   Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton,
//   Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
//   TextField, Alert
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import api from "../../services/api"; // axios instance

// // -------- Product Form Modal --------
// function ProductForm({ open, onClose, onSaved, initial = null }) {
//   const [form, setForm] = useState({
//     name: "", category: "", brand: "", price: "", quantity: "", image: "", description: ""
//   });
//   const [error, setError] = useState("");

//   useEffect(() => {
//     setForm(initial || { name: "", category: "", brand: "", price: "", quantity: "", image: "", description: "" });
//     setError("");
//   }, [initial]);

//   const handleSave = async () => {
//     try {
//       const productData = {
//         ...form,
//         price: parseFloat(form.price || 0),
//         quantity: parseInt(form.quantity || 0),
//       };

//       if (initial && initial._id) {
//         await api.put(`/products/${initial._id}`, productData);
//       } else {
//         await api.post("/products", productData);
//       }

//       onSaved(); // refresh list
//       onClose();
//     } catch (err) {
//       console.error("Save failed:", err);
//       setError(err.response?.data?.message || "Failed to save product");
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
//       <DialogTitle>{initial ? "Edit Product" : "Add Product"}</DialogTitle>
//       <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
//         {error && <Alert severity="error">{error}</Alert>}

//         <TextField label="Name" value={form.name || ""} onChange={e => setForm({ ...form, name: e.target.value })} />
//         <TextField label="Brand" value={form.brand || ""} onChange={e => setForm({ ...form, brand: e.target.value })} />
//         <TextField label="Category" value={form.category || ""} onChange={e => setForm({ ...form, category: e.target.value })} />
//         <TextField label="Price" type="number" value={form.price || ""} onChange={e => setForm({ ...form, price: e.target.value })} />
//         <TextField label="Quantity" type="number" value={form.quantity || ""} onChange={e => setForm({ ...form, quantity: e.target.value })} />
//         <TextField label="Image URL" value={form.image || ""} onChange={e => setForm({ ...form, image: e.target.value })} />
//         <TextField label="Description" multiline rows={3} value={form.description || ""} onChange={e => setForm({ ...form, description: e.target.value })} />
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button variant="contained" onClick={handleSave}>{initial ? "Update" : "Create"}</Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// // -------- Main Products Component --------
// export default function Products() {
//   const [products, setProducts] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editing, setEditing] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const loadProducts = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const res = await api.get("/products");
//       setProducts(res.data.products || res.data || []);
//     } catch (err) {
//       console.error("Load failed:", err);
//       setError(err.response?.data?.message || "Failed to load products");
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadProducts();
//   }, []);

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this product?")) return;
//     try {
//       await api.delete(`/products/${id}`);
//       loadProducts();
//     } catch (err) {
//       console.error("Delete failed:", err);
//       setError(err.response?.data?.message || "Failed to delete product");
//     }
//   };

//   return (
//     <>
//       <Typography variant="h5" mb={2}>Products</Typography>
//       <Button variant="contained" sx={{ mb: 2 }} onClick={() => { setEditing(null); setModalOpen(true); }}>
//         Add Product
//       </Button>

//       {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

//       <Paper>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Name</TableCell>
//               <TableCell>Brand</TableCell>
//               <TableCell>Category</TableCell>
//               <TableCell>Price</TableCell>
//               <TableCell>Quantity</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {products.map(p => (
//               <TableRow key={p._id}>
//                 <TableCell>{p.name}</TableCell>
//                 <TableCell>{p.brand}</TableCell>
//                 <TableCell>{p.category}</TableCell>
//                 <TableCell>₹{p.price}</TableCell>
//                 <TableCell>{p.quantity || 0}</TableCell>
//                 <TableCell>
//                   <IconButton onClick={() => { setEditing(p); setModalOpen(true); }}>
//                     <EditIcon />
//                   </IconButton>
//                   <IconButton color="error" onClick={() => handleDelete(p._id)}>
//                     <DeleteIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </Paper>

//       <ProductForm
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onSaved={loadProducts}
//         initial={editing}
//       />
//     </>
//   );
// }
