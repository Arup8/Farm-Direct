import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function TestAdminRedirect() {
  useEffect(() => {
    // Add a short delay to ensure the component mounts before redirecting
    const timer = setTimeout(() => {
      console.log('Attempting direct navigation to admin dashboard');
      router.replace('/admin/dashboard' as any);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background.main }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>Redirecting to Admin Dashboard...</Text>
      <ActivityIndicator size="large" color={Colors.primary.main} />
    </View>
  );
} 