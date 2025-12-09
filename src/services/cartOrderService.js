import api from "./api";

// Get user's cart
export const getCart = async () => {
  try {
    const response = await api.get("/cart-order");
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

// Add item to cart
export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await api.post("/cart-order/add", {
      productId,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

// Update cart item quantity
export const updateCartItem = async (productId, quantity) => {
  try {
    const response = await api.put("/cart-order/update", {
      productId,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
};

// Remove item from cart
export const removeFromCart = async (productId) => {
  try {
    const response = await api.delete("/cart-order/remove", {
      data: { productId },
    });
    return response.data;
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
};

// Clear entire cart
export const clearCart = async () => {
  try {
    const response = await api.delete("/cart-order/clear");
    return response.data;
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};

// ============ ORDER OPERATIONS ============

// Get current pending order
export const getCurrentOrder = async () => {
  try {
    const response = await api.get("/cart-order/order/current");
    return response.data;
  } catch (error) {
    console.error("Error fetching current order:", error);
    throw error;
  }
};

// Create order from cart
export const createOrderFromCart = async (shippingAddress = {}, paymentMethod = "ONLINE") => {
  try {
    const response = await api.post("/cart-order/order/create", {
      shippingAddress,
      paymentMethod,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Update order totals
export const updateOrderTotals = async (orderId) => {
  try {
    const response = await api.put(`/cart-order/order/${orderId}/totals`);
    return response.data;
  } catch (error) {
    console.error("Error updating order totals:", error);
    throw error;
  }
};

// Get all user's orders
export const getUserOrders = async () => {
  try {
    const response = await api.get("/cart-order/orders");
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

// Get single order
export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/cart-order/order/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

// Cancel order
export const cancelOrder = async (orderId) => {
  try {
    const response = await api.delete(`/cart-order/order/${orderId}/cancel`);
    return response.data;
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw error;
  }
};
