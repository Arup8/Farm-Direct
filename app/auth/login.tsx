import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert
} from 'react-native';
import { Stack, Link, router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import { Feather } from '@expo/vector-icons';
import { redirectToRoleDashboard } from '@/utils/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants/Config';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const { login, isLoading, user } = useAuth();

  // Validate email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Validate password
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  // Handle login
  const handleLogin = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (isEmailValid && isPasswordValid) {
      try {
        const success = await login(email, password);
        
        if (success) {
          // Login successful - but user state might not be updated yet
          // Get the user data directly from AsyncStorage instead of relying on state
          try {
            const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
            if (userData) {
              const parsedUser = JSON.parse(userData);
              
              if (parsedUser.role) {
                // Use the parsed user data instead of the state
                switch (parsedUser.role) {
                  case 'admin':
                    router.replace('/admin/dashboard' as any);
                    break;
                  case 'seller':
                    router.replace('/farmer/dashboard' as any);
                    break;
                  case 'customer':
                    router.replace('/(tabs)');
                    break;
                  default:
                    // Default to customer view if role is not recognized
                    router.replace('/(tabs)');
                    break;
                }
              } else {
                // Default to customer view if no role
                router.replace('/(tabs)');
              }
            } else {
              Alert.alert('Error', 'Unable to retrieve user data. Please login again.');
            }
          } catch (storageError) {
            console.error('Error retrieving user data from storage:', storageError);
            Alert.alert('Error', 'An error occurred while retrieving user data. Please try again.');
          }
        }
      } catch (error) {
        console.error('Error during login process:', error);
      }
    }
  };

  // Navigate to register
  const goToRegister = () => {
    router.push('./register');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Login',
          headerStyle: {
            backgroundColor: Colors.background.light,
          },
          headerShadowVisible: false,
        }} 
      />
      
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/3746517/pexels-photo-3746517.jpeg' }}
            style={styles.logo}
            resizeMode="cover"
          />
          <Text style={styles.logoText}>Farm Direct</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.greeting}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to continue shopping fresh produce</Text>
          
          <View style={styles.inputContainer}>
            <Feather name="mail" size={20} color={Colors.grey[400]} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              onBlur={() => validateEmail(email)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          
          <View style={styles.inputContainer}>
            <Feather name="lock" size={20} color={Colors.grey[400]} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              onBlur={() => validatePassword(password)}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIcon} 
              onPress={() => setShowPassword(!showPassword)}
            >
              <Feather 
                name={showPassword ? "eye-off" : "eye"} 
                size={20} 
                color={Colors.grey[400]} 
              />
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={goToRegister}>
              <Text style={styles.registerLink}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: Colors.primary.dark,
  },
  formContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingTop: 30,
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.primary.dark,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.grey[500],
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.grey[300],
    borderRadius: 8,
    marginBottom: 15,
    height: 50,
  },
  inputIcon: {
    marginHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  errorText: {
    color: Colors.error.main,
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 5,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginVertical: 15,
  },
  forgotPasswordText: {
    color: Colors.primary.main,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: Colors.primary.main,
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  registerText: {
    color: Colors.grey[600],
    fontSize: 14,
  },
  registerLink: {
    color: Colors.primary.main,
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 