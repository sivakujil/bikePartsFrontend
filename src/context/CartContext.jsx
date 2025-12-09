import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  createOrderFromCart
} from "../services/cartOrderService";

// Create context
export const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

// CartProvider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Calculate totals from cart items
  const calculateTotals = (items) => {
    const calculatedSubtotal = items.reduce(
      (acc, item) => acc + ((item.product?.price || item.price || 0) * (item.quantity || 1)),
      0
    );
    const calculatedTax = calculatedSubtotal * 0.18; // 18% GST
    const calculatedShipping = calculatedSubtotal >= 1000 ? 0 : 50;
    const calculatedTotal = calculatedSubtotal + calculatedTax + calculatedShipping;

    setSubtotal(calculatedSubtotal);
    setTax(calculatedTax);
    setShipping(calculatedShipping);
    setTotalPrice(calculatedTotal);
  };

  // Load cart from backend
  const loadCart = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        // If no token, use empty cart
        setCartItems([]);
        setCartCount(0);
        calculateTotals([]);
        return;
      }

      const data = await getCart();
      const items = data.items || [];

      setCartItems(items);
      setCartCount(items.reduce((acc, item) => acc + (item.quantity || 1), 0));
      calculateTotals(items);

    } catch (err) {
      console.error("Failed to load cart:", err);
      if (err.response?.status === 401) {
        setError("Please login to access your cart");
      } else {
        setError(err.response?.data?.message || "Failed to load cart.");
      }
      // Set empty cart on error
      setCartItems([]);
      setCartCount(0);
      calculateTotals([]);
    } finally {
      setLoading(false);
    }
  };

  // Add product to cart
  const addItem = async (productId, quantity = 1) => {
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        // If logged in, use backend API
        await addToCart(productId, quantity);
        await loadCart();
      } else {
        // If not logged in, use local state (fallback)
        // This would need product details, for now just show error
        setError("Please login to add items to cart");
      }
    } catch (err) {
      console.error("Failed to add item:", err);
      setError(err.response?.data?.message || "Failed to add item to cart.");
    } finally {
      setLoading(false);
    }
  };

  // Remove product from cart
  const removeItem = async (productId) => {
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        await removeFromCart(productId);
        await loadCart();
      } else {
        // Local fallback
        setCartItems(prev => prev.filter(item =>
          (item.product?._id || item._id) !== productId
        ));
        const newItems = cartItems.filter(item =>
          (item.product?._id || item._id) !== productId
        );
        setCartCount(newItems.reduce((acc, item) => acc + (item.quantity || 1), 0));
        calculateTotals(newItems);
      }
    } catch (err) {
      console.error("Failed to remove item:", err);
      setError(err.response?.data?.message || "Failed to remove item from cart.");
    } finally {
      setLoading(false);
    }
  };

  // Update item quantity
  const updateItem = async (productId, quantity) => {
    if (quantity < 1) return;

    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        await updateCartItem(productId, quantity);
        await loadCart();
      } else {
        // Local fallback
        setCartItems(prev => prev.map(item =>
          (item.product?._id || item._id) === productId
            ? { ...item, quantity }
            : item
        ));
        const newItems = cartItems.map(item =>
          (item.product?._id || item._id) === productId
            ? { ...item, quantity }
            : item
        );
        setCartCount(newItems.reduce((acc, item) => acc + (item.quantity || 1), 0));
        calculateTotals(newItems);
      }
    } catch (err) {
      console.error("Failed to update item:", err);
      setError(err.response?.data?.message || "Failed to update cart item.");
    } finally {
      setLoading(false);
    }
  };

  // Clear the cart
  const clearCart = async () => {
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        await clearCart();
        await loadCart();
      } else {
        // Local fallback
        setCartItems([]);
        setCartCount(0);
        calculateTotals([]);
      }
    } catch (err) {
      console.error("Failed to clear cart:", err);
      setError(err.response?.data?.message || "Failed to clear cart.");
    } finally {
      setLoading(false);
    }
  };

  // Create order from cart
  const createOrder = async (shippingAddress = {}, paymentMethod = "ONLINE") => {
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Please login to create an order");
      }

      const data = await createOrderFromCart(shippingAddress, paymentMethod);
      setCurrentOrder(data);
      await loadCart(); // Refresh cart after order creation
      return data;
    } catch (err) {
      console.error("Failed to create order:", err);
      setError(err.response?.data?.message || "Failed to create order.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refresh cart (alias for loadCart)
  const refreshCart = loadCart;

  // Load cart on mount and when auth changes
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      loadCart();
    } else {
      // Set empty cart for non-logged in users
      setCartItems([]);
      setCartCount(0);
      calculateTotals([]);
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        totalPrice,
        subtotal,
        tax,
        shipping,
        currentOrder,
        loading,
        error,
        addItem,
        removeItem,
        updateItem,
        clearCart,
        createOrder,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
