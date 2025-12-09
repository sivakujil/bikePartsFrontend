import api from './api.js';

export const paymentService = {
  // Create payment session
  createPayment: async (paymentData) => {
    try {
      const response = await api.post('/payments', paymentData);
      return response.data;
    } catch (error) {
      console.error('Payment creation error:', error);
      throw error.response?.data || { message: 'Payment creation failed' };
    }
  },

  // Get payment by order ID
  getPaymentByOrder: async (orderId) => {
    try {
      const response = await api.get(`/payments/order/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Get payment error:', error);
      throw error.response?.data || { message: 'Failed to fetch payment' };
    }
  },

  // Get all payments (admin only)
  getAllPayments: async () => {
    try {
      const response = await api.get('/payments');
      return response.data;
    } catch (error) {
      console.error('Get payments error:', error);
      throw error.response?.data || { message: 'Failed to fetch payments' };
    }
  },

  // Process payment for order
  processOrderPayment: async (orderId, items) => {
    try {
      const paymentData = {
        orderId,
        items: items.map(item => ({
          name: item.product_id?.name || item.name,
          price: item.price,
          quantity: item.quantity,
          description: item.product_id?.description || `Bike part: ${item.name}`
        }))
      };

      const response = await api.post('/payments', paymentData);
      return response.data;
    } catch (error) {
      console.error('Order payment processing error:', error);
      throw error.response?.data || { message: 'Payment processing failed' };
    }
  },

  // Get payment by session ID
  getPaymentBySessionId: async (sessionId) => {
    try {
      const response = await api.get(`/payments/session/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Get payment by session error:', error);
      throw error.response?.data || { message: 'Failed to fetch payment' };
    }
  }
};

export default paymentService;
