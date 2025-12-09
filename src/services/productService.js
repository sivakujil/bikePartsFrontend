import api from "./api";

// Get all products (public)
export const getPublicProducts = async (params = {}) => {
  try {
    const response = await api.get("/products", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Get all products (admin)
export const getAllProducts = async (params = {}) => {
  try {
    const response = await api.get("/admin/products", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Get single product
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/admin/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// Create product (admin only)
export const createProduct = async (productData) => {
  try {
    const response = await api.post("/admin/products", productData);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Update product (admin only)
export const updateProduct = async (id, productData) => {
  try {
    console.log("Updating product with ID:", id);
    console.log("Product data:", productData);

    if (!id) {
      throw new Error("Product ID is required for update");
    }

    const response = await api.put(`/admin/products/${id}`, productData);
    console.log("Update response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    console.error("Error status:", error.response?.status);
    console.error("Error data:", error.response?.data);

    // Better error handling
    if (error.response?.status === 404) {
      throw new Error(`Product with ID ${id} not found`);
    } else if (error.response?.status === 401) {
      throw new Error("You are not authorized to update products");
    } else if (error.response?.status === 403) {
      throw new Error("You don't have admin privileges to update products");
    } else {
      throw error;
    }
  }
};

// Delete product (admin only)
export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
