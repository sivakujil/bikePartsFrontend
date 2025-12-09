// import React, { useState } from "react";
// import { TextField, Button, Box, Typography, Paper } from "@mui/material";
// import api from "../../services/api";

// export default function ProductForm({ onSuccess, editProduct }) {
//   const [form, setForm] = useState(
//     editProduct || {
//       name: "",
//       brand: "",
//       category: "",
//       price: "",
//       oldPrice: "",
//       stock: "",
//       image: "",
//       description: "",
//     }
//   );

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editProduct) {
//         await api.put(`/products/${editProduct._id}`, form);
//       } else {
//         await api.post("/products", form);
//       }
//       alert("Product saved!");
//       setForm({
//         name: "", brand: "", category: "", price: "", oldPrice: "",
//         stock: "", image: "", description: ""
//       });
//       onSuccess?.();
//     } catch (err) {
//       console.error("Save failed:", err);
//       alert("Error saving product");
//     }
//   };

//   return (
//     <Paper sx={{ p: 3 }}>
//       <Typography variant="h6" gutterBottom>
//         {editProduct ? "Edit Product" : "Add New Product"}
//       </Typography>
//       <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
//         <TextField label="Name" name="name" value={form.name} onChange={handleChange} required />
//         <TextField label="Brand" name="brand" value={form.brand} onChange={handleChange} required />
//         <TextField label="Category" name="category" value={form.category} onChange={handleChange} required />
//         <TextField label="Price" name="price" value={form.price} onChange={handleChange} required />
//         <TextField label="Old Price" name="oldPrice" value={form.oldPrice} onChange={handleChange} />
//         <TextField label="Stock" name="stock" value={form.stock} onChange={handleChange} required />
//         <TextField label="Image URL" name="image" value={form.image} onChange={handleChange} />
//         <TextField label="Description" name="description" value={form.description} onChange={handleChange} multiline rows={3} />
//         <Button type="submit" variant="contained" color="primary">
//           {editProduct ? "Update" : "Add Product"}
//         </Button>
//       </Box>
//     </Paper>
//   );
// }



import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const ProductForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const editProduct = location.state?.product;

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    model: "",
    price: "",
    cost: "",
    quantity: "",
    image: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [fetchLoading, setFetchLoading] = useState(false);

  // Load product details into form
  useEffect(() => {
    const loadProduct = async () => {
      // If we have product from location state (modal edit), use it
      if (editProduct) {
        setFormData({
          name: editProduct.name || "",
          category: editProduct.category || "",
          brand: editProduct.brand || "",
          model: editProduct.model || "",
          price: editProduct.price || "",
          cost: editProduct.cost || "",
          quantity: editProduct.quantity || "",
          image: editProduct.images && editProduct.images.length > 0 ? editProduct.images[0] : "",
          description: editProduct.description || "",
        });
        return;
      }

      // If we have ID from URL params, fetch the product
      if (id) {
        setFetchLoading(true);
        try {
          const response = await api.get(`/products/${id}`);
          const product = response.data;
          setFormData({
            name: product.name || "",
            category: product.category || "",
            brand: product.brand || "",
            model: product.model || "",
            price: product.price || "",
            cost: product.cost || "",
            quantity: product.quantity || "",
            image: product.images && product.images.length > 0 ? product.images[0] : "",
            description: product.description || "",
          });
        } catch (error) {
          console.error("Error fetching product:", error);
          setMessage("Error loading product data");
          setMessageType("error");
        } finally {
          setFetchLoading(false);
        }
      }
    };

    loadProduct();
  }, [editProduct, id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
        quantity: parseInt(formData.quantity),
      };

      let response;

      if (id || (editProduct && editProduct._id)) {
        const productId = id || editProduct._id;
        response = await api.put(`/products/${productId}`, {
          ...productData,
          images: productData.image ? [productData.image] : [],
          image: undefined // remove the single image field
        });
        setMessage("Product updated successfully!");
      } else {
        response = await api.post("/products", {
          name: productData.name,
          category: productData.category,
          brand: productData.brand,
          model: productData.model,
          price: productData.price,
          cost: productData.cost,
          quantity: productData.quantity,
          description: productData.description,
          images: productData.image ? [productData.image] : [],
        });
        setMessage("Product created successfully!");
      }

      setMessageType("success");

      if (!editProduct) {
        setFormData({
          name: "",
          category: "",
          brand: "",
          model: "",
          price: "",
          cost: "",
          quantity: "",
          image: "",
          description: "",
        });
      }

      setTimeout(() => {
        navigate("/admin/products");
      }, 1500);
    } catch (error) {
      console.error("Error saving product:", error);
      setMessage(error.response?.data?.message || "Error saving product");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        {editProduct ? "Edit Product" : "Add New Product"}
      </Typography>

      {message && (
        <Alert severity={messageType} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>Product Name</td>
              <td style={{ padding: '8px' }}>
                <TextField
                  fullWidth
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>Category</td>
              <td style={{ padding: '8px' }}>
                <TextField
                  fullWidth
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>Brand</td>
              <td style={{ padding: '8px' }}>
                <TextField
                  fullWidth
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>Model</td>
              <td style={{ padding: '8px' }}>
                <TextField
                  fullWidth
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>Price</td>
              <td style={{ padding: '8px' }}>
                <TextField
                  fullWidth
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>Cost</td>
              <td style={{ padding: '8px' }}>
                <TextField
                  fullWidth
                  name="cost"
                  type="number"
                  value={formData.cost}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>Quantity</td>
              <td style={{ padding: '8px' }}>
                <TextField
                  fullWidth
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>Image URL</td>
              <td style={{ padding: '8px' }}>
                <TextField
                  fullWidth
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>Description</td>
              <td style={{ padding: '8px' }}>
                <TextField
                  fullWidth
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading
              ? "Saving..."
              : editProduct
              ? "Update Product"
              : "Create Product"}
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate("/admin/products")}
            disabled={loading}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ProductForm;





