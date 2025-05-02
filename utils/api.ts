import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/Config';
import { STORAGE_KEYS } from '@/constants/Config';

// Token cache to avoid multiple AsyncStorage reads
let cachedToken: string | null = null;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to update token in cache
export const setAuthToken = (token: string | null) => {
  cachedToken = token;
  // Also update in AsyncStorage
  if (token) {
    AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } else {
    AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }
};

// Add a request interceptor to add auth token to all requests
api.interceptors.request.use(
  async (config) => {
    try {
      // Try to use the cached token first
      let token = cachedToken;
      
      // If no cached token, try to get from AsyncStorage
      if (!token) {
        token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        // Update cache if found
        if (token) {
          cachedToken = token;
        }
      }
      
      // Log token availability (debug only)
      console.log(`Request to ${config.url}, token available: ${!!token}`);
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If 401 Unauthorized, clear token
    if (error.response?.status === 401) {
      console.log('Token expired or invalid, clearing token');
      cachedToken = null;
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    // Save token from successful login
    if (response.data?.token) {
      setAuthToken(response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const registerUser = async (userData: any) => {
  try {
    const response = await api.post('/auth/register', userData);
    // Save token from successful registration
    if (response.data?.token) {
      setAuthToken(response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// New methods for chat functionality
export const getAllSellers = async () => {
  const response = await api.get('/auth/sellers');
  return response.data;
};

export const getUserChats = async () => {
  const response = await api.get('/chats');
  return response.data;
};

export const getChatById = async (chatId: string) => {
  const response = await api.get(`/chats/${chatId}`);
  return response.data;
};

export const createOrGetChat = async (userId: string) => {
  try {
    // Make sure userId is a string
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    console.log('Creating/getting chat with user:', userId);
    
    // Check token before making request
    const token = cachedToken || await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    console.log('Token available for chat creation:', !!token);
    
    const response = await api.post('/chats', { userId });
    console.log('Chat creation response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error creating chat:', error.response?.data || error.message);
    throw error;
  }
};

export const sendMessage = async (chatId: string, content: string, isBargain = false, productId?: string, offeredPrice?: number) => {
  try {
    const payload: any = { content };
    
    console.log('Sending message API call:');
    console.log('Chat ID:', chatId);
    console.log('Content:', content);
    
    if (isBargain && productId && offeredPrice) {
      payload.isBargain = true;
      payload.productId = productId;
      payload.offeredPrice = offeredPrice;
      console.log('Including bargain details:', { productId, offeredPrice });
    }
    
    // Check token before making request
    const token = cachedToken || await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    console.log('Token available for sending message:', !!token);
    
    const response = await api.post(`/chats/${chatId}/messages`, payload);
    console.log('Message send API response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error sending message API call:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};

// Products APIs
export const getAllProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export default api; 