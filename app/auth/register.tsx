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
  Image
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { redirectToRoleDashboard } from '@/utils/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants/Config';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [selectedRole, setSelectedRole] = useState<'customer' | 'seller' | 'admin'>('customer');
  
  const { register, isLoading, user } = useAuth();

  // Validate name
  const validateName = (name: string) => {
    if (!name.trim()) {
      setNameError('Name is required');
      return false;
    } else if (name.trim().length < 3) {
      setNameError('Name must be at least 3 characters');
      return false;
    }
    setNameError('');
    return true;
  };

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

  // Validate phone
  const validatePhone = (phone: string) => {
    // Optional field, but if provided, should be valid
    if (phone && !phone.match(/^(\+\d{1,3}[- ]?)?\d{10}$/)) {
      setPhoneError('Please enter a valid phone number');
      return false;
    }
    setPhoneError('');
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

  // Validate confirm password
  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  // Handle registration
  const handleRegister = async () => {
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePhone(phone);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(password, confirmPassword);
    
    if (isNameValid && isEmailValid && isPhoneValid && isPasswordValid && isConfirmPasswordValid) {
      try {
        const success = await register(name, email, password, phone || undefined, selectedRole);
        
        if (success) {
          // Registration successful - redirect to appropriate dashboard based on role
          switch (selectedRole) {
            case 'admin':
              router.replace('/admin/dashboard' as any);
              break;
            case 'seller':
              router.replace('/farmer/dashboard' as any);
              break;
            case 'customer':
            default:
              router.replace('/(tabs)');
              break;
          }
        }
      } catch (error) {
        console.error('Error during registration process:', error);
      }
    } else {
      // Validation failed
    }
  };

  // Navigate to login
  const goToLogin = () => {
    router.push('./login');
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
          title: 'Register',
          headerStyle: {
            backgroundColor: Colors.background.light,
          },
          headerShadowVisible: false,
        }} 
      />
      
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/5529599/pexels-photo-5529599.jpeg' }}
            style={styles.logo}
            resizeMode="cover"
          />
          <Text style={styles.logoText}>Farm Direct</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.greeting}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to start shopping fresh produce</Text>
          
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Feather name="user" size={20} color={Colors.grey[400]} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              onBlur={() => validateName(name)}
              autoCapitalize="words"
            />
          </View>
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
          
          {/* Email Input */}
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
          
          {/* Phone Input */}
          <View style={styles.inputContainer}>
            <Feather name="phone" size={20} color={Colors.grey[400]} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number (Optional)"
              value={phone}
              onChangeText={setPhone}
              onBlur={() => validatePhone(phone)}
              keyboardType="phone-pad"
            />
          </View>
          {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
          
          {/* Password Input */}
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
          
          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Feather name="lock" size={20} color={Colors.grey[400]} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onBlur={() => validateConfirmPassword(password, confirmPassword)}
              secureTextEntry={!showPassword}
            />
          </View>
          {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
          
          {/* Role Selection */}
          <Text style={styles.sectionLabel}>Choose Your Role</Text>
          <View style={styles.roleContainer}>
            {/* Customer Role Option */}
            <TouchableOpacity 
              style={[
                styles.roleCard, 
                selectedRole === 'customer' && styles.selectedRoleCard
              ]}
              onPress={() => setSelectedRole('customer')}
            >
              <View style={styles.roleIconContainer}>
                <FontAwesome name="user" size={22} color={Colors.primary.main} />
              </View>
              <View style={styles.roleTextContainer}>
                <Text style={styles.roleName}>Customer</Text>
                <Text style={styles.roleDescription}>Shop for fresh produce</Text>
              </View>
            </TouchableOpacity>
            
            {/* Seller Role Option */}
            <TouchableOpacity 
              style={[
                styles.roleCard, 
                selectedRole === 'seller' && styles.selectedRoleCard
              ]}
              onPress={() => setSelectedRole('seller')}
            >
              <View style={styles.roleIconContainer}>
                <FontAwesome name="leaf" size={22} color={Colors.success.main} />
              </View>
              <View style={styles.roleTextContainer}>
                <Text style={styles.roleName}>Farmer/Seller</Text>
                <Text style={styles.roleDescription}>Sell your produce</Text>
              </View>
            </TouchableOpacity>
            
            {/* Admin Role Option */}
            <TouchableOpacity 
              style={[
                styles.roleCard, 
                selectedRole === 'admin' && styles.selectedRoleCard
              ]}
              onPress={() => setSelectedRole('admin')}
            >
              <View style={styles.roleIconContainer}>
                <FontAwesome name="shield" size={22} color={Colors.warning.main} />
              </View>
              <View style={styles.roleTextContainer}>
                <Text style={styles.roleName}>Admin</Text>
                <Text style={styles.roleDescription}>Manage the marketplace</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.registerButton} 
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.registerButtonText}>Register</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={goToLogin}>
              <Text style={styles.loginLink}>Login</Text>
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
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 15,
    color: Colors.primary.dark,
  },
  roleContainer: {
    marginBottom: 15,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.grey[200],
  },
  selectedRoleCard: {
    borderColor: Colors.primary.main,
    backgroundColor: Colors.primary.light,
  },
  roleIconContainer: {
    width: 40, 
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  roleTextContainer: {
    flex: 1,
  },
  roleName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  roleDescription: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  registerButton: {
    backgroundColor: Colors.primary.main,
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  loginText: {
    color: Colors.grey[600],
    fontSize: 14,
  },
  loginLink: {
    color: Colors.primary.main,
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 