import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const RiderAuthContext = createContext();

export const RiderAuthProvider = ({ children }) => {
  const [rider, setRider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('riderToken');
    if (token) {
      // Verify token
      api.get('/rider/profile')
        .then(res => setRider(res.data.rider))
        .catch(() => localStorage.removeItem('riderToken'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/rider/auth/login', { email, password });
    localStorage.setItem('riderToken', res.data.token);
    setRider(res.data.rider);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('riderToken');
    setRider(null);
  };

  const getOrders = async () => {
    try {
      const res = await api.get('/rider/orders');
      return res.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  };

  const deliverOrder = async (orderId, data) => {
    try {
      const res = await api.post(`/rider/orders/${orderId}/deliver`, data);
      return res.data;
    } catch (error) {
      console.error('Error delivering order:', error);
      throw error;
    }
  };

  const uploadProof = async (orderId, file) => {
    try {
      const formData = new FormData();
      formData.append('proof', file);
      formData.append('orderId', orderId);

      const res = await api.post('/rider/order/upload-proof', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (error) {
      console.error('Error uploading proof:', error);
      throw error;
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await api.put(`/rider/order/status/${orderId}`, { status });
      return res.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };

  return (
    <RiderAuthContext.Provider value={{
      rider,
      login,
      logout,
      loading,
      getOrders,
      deliverOrder,
      uploadProof,
      updateOrderStatus
    }}>
      {children}
    </RiderAuthContext.Provider>
  );
};

export const useRiderAuth = () => {
  const context = React.useContext(RiderAuthContext);
  if (!context) {
    throw new Error('useRiderAuth must be used within a RiderAuthProvider');
  }
  return context;
};