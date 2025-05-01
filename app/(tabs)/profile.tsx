import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';

// Farm logo image URL
const FARM_LOGO_URL = 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg';

export default function ProfileScreen() {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // No need to navigate - the auth system will automatically redirect
  };

  // If not authenticated, show login prompt
  if (!isAuthenticated || !user) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Profile' }} />
        <View style={styles.authContainer}>
          <Image 
            source={{ uri: FARM_LOGO_URL }}
            style={styles.logo}
            resizeMode="cover"
          />
          <Text style={styles.authTitle}>Farm Direct</Text>
          <Text style={styles.authSubtitle}>Please login to access your profile</Text>
          <TouchableOpacity
            style={styles.authButton}
            onPress={() => {
              // Use absolute path type assertion to avoid type errors
              router.push("/auth/login" as any);
            }}
          >
            <Text style={styles.authButtonText}>Login</Text>
          </TouchableOpacity>
          <Text style={styles.authText}>Don't have an account?</Text>
          <TouchableOpacity
            style={[styles.authButton, styles.registerButton]}
            onPress={() => {
              // Use absolute path type assertion to avoid type errors
              router.push("/auth/register" as any);
            }}
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'My Profile',
          headerRight: () => (
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={() => {/* Navigate to edit profile */}}
            >
              <Feather name="edit" size={20} color={Colors.primary.main} />
            </TouchableOpacity>
          ) 
        }}
      />
      
      <ScrollView>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image 
            source={user.image ? { uri: user.image } : { uri: FARM_LOGO_URL }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
          {user.phone && <Text style={styles.profilePhone}>{user.phone}</Text>}
        </View>
        
        {/* User Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Account</Text>
          
          <TouchableOpacity 
            style={styles.option} 
            onPress={() => Alert.alert("Coming Soon", "This feature is currently under development.")}
          >
            <Feather name="shopping-bag" size={22} color={Colors.primary.main} />
            <Text style={styles.optionText}>My Orders</Text>
            <Feather name="chevron-right" size={22} color={Colors.grey[400]} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.option} 
            onPress={() => Alert.alert("Coming Soon", "This feature is currently under development.")}
          >
            <Feather name="heart" size={22} color={Colors.primary.main} />
            <Text style={styles.optionText}>Wishlist</Text>
            <Feather name="chevron-right" size={22} color={Colors.grey[400]} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.option} 
            onPress={() => Alert.alert("Coming Soon", "This feature is currently under development.")}
          >
            <Feather name="map-pin" size={22} color={Colors.primary.main} />
            <Text style={styles.optionText}>Addresses</Text>
            <Feather name="chevron-right" size={22} color={Colors.grey[400]} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.option} 
            onPress={() => Alert.alert("Coming Soon", "This feature is currently under development.")}
          >
            <Feather name="credit-card" size={22} color={Colors.primary.main} />
            <Text style={styles.optionText}>Payment Methods</Text>
            <Feather name="chevron-right" size={22} color={Colors.grey[400]} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <TouchableOpacity 
            style={styles.option} 
            onPress={() => Alert.alert("Coming Soon", "This feature is currently under development.")}
          >
            <Feather name="settings" size={22} color={Colors.primary.main} />
            <Text style={styles.optionText}>Settings</Text>
            <Feather name="chevron-right" size={22} color={Colors.grey[400]} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.option}>
            <Feather name="help-circle" size={22} color={Colors.primary.main} />
            <Text style={styles.optionText}>Help & Support</Text>
            <Feather name="chevron-right" size={22} color={Colors.grey[400]} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.option}>
            <Feather name="info" size={22} color={Colors.primary.main} />
            <Text style={styles.optionText}>About Us</Text>
            <Feather name="chevron-right" size={22} color={Colors.grey[400]} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={22} color={Colors.error.main} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>App Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary.dark,
    marginBottom: 10,
  },
  authSubtitle: {
    fontSize: 16,
    color: Colors.grey[600],
    marginBottom: 30,
    textAlign: 'center',
  },
  authButton: {
    backgroundColor: Colors.primary.main,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
  },
  authButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  authText: {
    fontSize: 14,
    color: Colors.grey[600],
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: Colors.white,
    borderColor: Colors.primary.main,
    borderWidth: 1,
  },
  registerButtonText: {
    color: Colors.primary.main,
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButton: {
    marginRight: 15,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: Colors.grey[400],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primary.dark,
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: Colors.grey[600],
    marginBottom: 3,
  },
  profilePhone: {
    fontSize: 16,
    color: Colors.grey[600],
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginHorizontal: 15,
    marginBottom: 20,
    padding: 15,
    shadowColor: Colors.grey[400],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary.dark,
    marginBottom: 15,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200],
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: Colors.grey[800],
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginHorizontal: 15,
    marginBottom: 20,
    padding: 15,
    shadowColor: Colors.grey[400],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    color: Colors.error.main,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  footerText: {
    fontSize: 14,
    color: Colors.grey[500],
  },
});