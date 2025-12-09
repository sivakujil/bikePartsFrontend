// import React, { useEffect, useState } from "react";
// import {
//   Table, TableHead, TableRow, TableCell, TableBody,
//   IconButton, Typography, Paper, Box, CircularProgress, Alert
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import { useNavigate } from "react-router-dom";
// import api from "../../services/api";
// import ProductForm from "../admin/ProductForm";

// export default function ProductList() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const loadProducts = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const res = await api.get("/products");
//       // Handle both paginated and non-paginated responses
//       const productsData = res.data.products || res.data || [];
//       setProducts(Array.isArray(productsData) ? productsData : []);
//     } catch (err) {
//       console.error("Failed to load products:", err);
//       setError(err.response?.data?.message || "Failed to load products");
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

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

//   const handleEdit = (product) => {
//     navigate(`/admin/products/add`, { state: { product } });
//   };

//   useEffect(() => {
//     loadProducts();
//   }, []);

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Paper sx={{ mt: 4, p: 2 }}>
//       <div>
//                   <button>Add Product</button>
//                 </div>
//       <Typography variant="h6" gutterBottom>All Products</Typography>
      
//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//       )}

//       {products.length === 0 && !loading && !error && (
//         <Alert severity="info">
//           No products found. Add your first product to get started.
//         </Alert>
//       )}

//       {products.length > 0 && (
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
//             {products.map((p) => (
//               <TableRow key={p._id}>
//                 <TableCell>{p.name}</TableCell>
//                 <TableCell>{p.brand}</TableCell>
//                 <TableCell>{p.category}</TableCell>
//                 <TableCell>₹{p.price}</TableCell>
//                 <TableCell>{p.quantity || 0}</TableCell>
//                 <TableCell>
//                   <IconButton 
//                     color="primary" 
//                     onClick={() => handleEdit(p)}
//                     title="Edit product"
//                   >
//                     <EditIcon />
//                   </IconButton>
//                   <IconButton 
//                     color="error" 
//                     onClick={() => handleDelete(p._id)}
//                     title="Delete product"
//                   >
//                     <DeleteIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       )}
//     </Paper>
//   );
// }



import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { Link } from "react-router-dom";

const AdminProductList = () => {
  const [products, setProducts] = useState([]);

  // Load products
  useEffect(() => {
    API.get("/products").then((res) => {
      setProducts(res.data.products);
    });
  }, []);

  // Delete product
  const deleteProduct = async (id) => {
    if (!confirm("Sure delete this product?")) return;

    await API.delete(`/products/${id}`);
    setProducts(products.filter((p) => p._id !== id));
  };

  return (
    <div className="admin-container">
      <div className="header">
        <h2>Products</h2>
        <Link to="/admin/products/add" className="btn">
          Add Product
        </Link>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Brand</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.brand}</td>
              <td>Rs {p.price}</td>
              <td>{p.quantity}</td>

              <td>
                <Link to={`/admin/products/edit/${p._id}`} className="edit-btn">
                  Edit
                </Link>

                <button
                  onClick={() => deleteProduct(p._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProductList;
