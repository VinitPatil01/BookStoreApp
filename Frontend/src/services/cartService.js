import axios from 'axios';
import { getToken } from './userService';

const API_BASE_URL = 'http://localhost:9090/api';
const token = getToken();
const getAuthHeaders = () => {
  const token = getToken();
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const addToCart = async (book) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/cart`,
      { bookId:book.bookId,
        book,
        quantity:1
     },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const getCart =  () => {
  try {
     
    return axios.get(`${API_BASE_URL}/cart`, getAuthHeaders());
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};


export const updateCartItem = async (bookId, quantity) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/cart/book/${bookId}`,
      {}, 
      {
        ...getAuthHeaders(), 
        params: { quantity } 
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

export const removeFromCart = async (cartItemId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/cart/book/${cartItemId}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

export const clearCart = async () => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/cart`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

export const getUserCartAdmin = async (userId) => {
  const response = await axios.get(`${API_BASE}/admin/user/${userId}`);
  return response.data;
};

export const clearUserCartAdmin = async (userId) => {
  const response = await axios.delete(`${API_BASE}/admin/user/${userId}`);
  return response.data;
};