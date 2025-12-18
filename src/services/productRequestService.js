import api from './api.js';

/**
 * Submit a product request
 * @param {Object} requestData - The product request data
 * @param {string} requestData.productId - ID of the product
 * @param {string} requestData.messageFromUser - Message from user (optional)
 * @returns {Promise<Object>} Response from the server
 */
export const submitProductRequest = async (requestData) => {
  try {
    console.log('Frontend request payload:', requestData);
    const response = await api.post('/product-requests', requestData);
    console.log('Create request response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating product request:', error);
    console.error('Error response:', error.response?.data || error);
    throw error;
  }
};

/**
 * Get user product requests
 * @returns {Promise<Object>} Response with requests array
 */
export const getUserProductRequests = async () => {
  try {
    const response = await api.get('/product-requests/mine');
    return response.data;
  } catch (error) {
    console.error('Error fetching user product requests:', error);
    throw error;
  }
};

/**
 * Get all product requests (admin)
 * @returns {Promise<Object>} Response with requests array
 */
export const getAllProductRequests = async () => {
  try {
    const response = await api.get('/product-requests');
    return response.data;
  } catch (error) {
    console.error('Error fetching all product requests:', error);
    throw error;
  }
};

/**
 * Reply to product request (admin)
 * @param {string} requestId - ID of the request
 * @param {string} adminReply - Admin reply message (optional)
 * @param {string} estimatedDate - Estimated availability date (optional)
 * @returns {Promise<Object>} Response from the server
 */
export const replyToProductRequest = async (requestId, adminReply, estimatedDate) => {
  try {
    const response = await api.patch(`/product-requests/${requestId}/reply`, { adminReply, estimatedDate });
    return response.data;
  } catch (error) {
    console.error('Error replying to product request:', error);
    throw error;
  }
};

export default {
  submitProductRequest,
  getUserProductRequests,
  getAllProductRequests,
  replyToProductRequest
};