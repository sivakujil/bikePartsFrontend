import api from './api.js';

/**
 * Submit a product request
 * @param {Object} requestData - The product request data
 * @param {string} requestData.productName - Name of the requested product
 * @param {string} requestData.description - Description of the request
 * @param {string} requestData.userId - ID of the user making the request (optional)
 * @returns {Promise<Object>} Response from the server
 */
export const submitProductRequest = async (requestData) => {
  try {
    const response = await api.post('/product-requests', requestData);
    return response.data;
  } catch (error) {
    console.error('Error submitting product request:', error);
    throw error;
  }
};

export default {
  submitProductRequest
};