import { AUTH_ENDPOINTS } from '@/constants/Config';
import { User } from '@/types';
import { setAuthToken } from '@/utils/api';  // Import from utils/api.ts

// Interface for authentication responses
interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

// Register a new user
export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'customer' | 'seller' | 'admin';
}): Promise<AuthResponse> => {
  try {
    const response = await fetch(AUTH_ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    // Set auth token if login successful
    if (data.success && data.token) {
      setAuthToken(data.token);
    }
    
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: 'Network error occurred. Please try again.',
    };
  }
};

// Login user
export const loginUser = async (userData: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  try {
    const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    // Set auth token if login successful
    if (data.success && data.token) {
      setAuthToken(data.token);
    }
    
    return data;
  } catch (error) {
    console.error('Login error details:', JSON.stringify(error));
    
    // Check network connectivity errors
    if (error instanceof TypeError && error.message.includes('Network request failed')) {
      console.error('Network connectivity issue detected. Please check server connection.');
      return {
        success: false,
        message: 'Unable to connect to server. Please check your internet connection and ensure the server is running.',
      };
    }
    
    return {
      success: false,
      message: `Network error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
    };
  }
};

// Logout user
export const logoutUser = async (token: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(AUTH_ENDPOINTS.LOGOUT, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      message: 'Network error occurred during logout.',
    };
  }
};

// Get current user's profile
export const getCurrentUser = async (token: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(AUTH_ENDPOINTS.ME, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return {
      success: data.success,
      user: data.data, // The actual user data is in data.data from the backend
      message: data.message,
    };
  } catch (error) {
    console.error('Get user error:', error);
    return {
      success: false,
      message: 'Network error occurred while fetching user data.',
    };
  }
};

// Update user details
export const updateUserDetails = async (
  token: string,
  updates: { name?: string; email?: string; phone?: string }
): Promise<AuthResponse> => {
  try {
    const response = await fetch(AUTH_ENDPOINTS.UPDATE_DETAILS, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();
    return {
      success: data.success,
      user: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Update user error:', error);
    return {
      success: false,
      message: 'Network error occurred while updating user data.',
    };
  }
};

// Update password
export const updatePassword = async (
  token: string,
  passwords: { currentPassword: string; newPassword: string }
): Promise<AuthResponse> => {
  try {
    const response = await fetch(AUTH_ENDPOINTS.UPDATE_PASSWORD, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(passwords),
    });

    return await response.json();
  } catch (error) {
    console.error('Update password error:', error);
    return {
      success: false,
      message: 'Network error occurred while updating password.',
    };
  }
};

// Update user role
export const updateUserRole = async (
  token: string,
  role: 'customer' | 'seller' | 'admin'
): Promise<AuthResponse> => {
  try {
    // Use the same endpoint as updateUserDetails
    const response = await fetch(AUTH_ENDPOINTS.UPDATE_DETAILS, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    });

    const data = await response.json();
    return {
      success: data.success,
      user: data.data,
      message: data.message,
    };
  } catch (error) {
    console.error('Update role error:', error);
    return {
      success: false,
      message: 'Network error occurred while updating user role.',
    };
  }
};

// Export setAuthToken to avoid circular dependencies
export { setAuthToken }; 