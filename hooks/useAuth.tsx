import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';
import { STORAGE_KEYS } from '@/constants/Config';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getCurrentUser,
  updateUserDetails,
  updatePassword
} from '@/data/api';

// Define the shape of the auth context
interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string, role?: 'customer' | 'seller' | 'admin') => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (updates: { name?: string; email?: string; phone?: string }) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load user data from storage when the app starts
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const storedUserData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
        
        if (storedToken && storedUserData) {
          setToken(storedToken);
          setUser(JSON.parse(storedUserData));
          setIsAuthenticated(true);
          
          // Also verify with the backend that the token is still valid
          const response = await getCurrentUser(storedToken);
          if (!response.success) {
            // If token is invalid, log the user out
            await clearStorageAndReset();
          } else if (response.user) {
            // Update user data if it has changed
            setUser(response.user);
            await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
          }
        }
      } catch (error) {
        console.error('Error loading authentication state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  // Helper to clear storage and reset auth state
  const clearStorageAndReset = async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Register a new user
  const register = async (name: string, email: string, password: string, phone?: string, role?: 'customer' | 'seller' | 'admin') => {
    try {
      setIsLoading(true);
      const response = await registerUser({ name, email, password, phone, role });
      
      if (response.success && response.token && response.user) {
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
        
        setToken(response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        return true;
      } else {
        Alert.alert('Registration Failed', response.message || 'Could not create account. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'An unexpected error occurred during registration.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Login an existing user
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await loginUser({ email, password });
      
      if (response.success && response.token && response.user) {
        // Store data in AsyncStorage
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
        
        // Update state
        setToken(response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        
        return true;
      } else {
        Alert.alert('Login Failed', response.message || 'Invalid credentials');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An unexpected error occurred during login.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout the current user
  const logout = async () => {
    try {
      setIsLoading(true);
      if (token) {
        await logoutUser(token);
      }
      await clearStorageAndReset();
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'An error occurred during logout, but you were signed out anyway.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update user details
  const updateUser = async (updates: { name?: string; email?: string; phone?: string }) => {
    try {
      setIsLoading(true);
      if (!token) {
        Alert.alert('Error', 'You must be logged in to update your profile.');
        return false;
      }
      
      const response = await updateUserDetails(token, updates);
      
      if (response.success && response.user) {
        setUser(response.user);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.user));
        return true;
      } else {
        Alert.alert('Update Failed', response.message || 'Could not update profile');
        return false;
      }
    } catch (error) {
      console.error('Update user error:', error);
      Alert.alert('Error', 'An unexpected error occurred while updating your profile.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Change password
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setIsLoading(true);
      if (!token) {
        Alert.alert('Error', 'You must be logged in to change your password.');
        return false;
      }
      
      const response = await updatePassword(token, { currentPassword, newPassword });
      
      if (response.success) {
        Alert.alert('Success', 'Your password has been updated successfully');
        // If the backend sends a new token, update it
        if (response.token) {
          setToken(response.token);
          await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
        }
        return true;
      } else {
        Alert.alert('Password Update Failed', response.message || 'Could not update password');
        return false;
      }
    } catch (error) {
      console.error('Change password error:', error);
      Alert.alert('Error', 'An unexpected error occurred while changing your password.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        user,
        token,
        login,
        register,
        logout,
        updateUser,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export the context for access in other parts of the app if needed
export { AuthContext }; 