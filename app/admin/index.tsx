import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function AdminFallback() {
  useEffect(() => {
    console.log('Admin fallback route - redirecting to dashboard');
    router.replace('/admin/dashboard' as any);
  }, []);
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background.main }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>Redirecting to Admin Dashboard...</Text>
      <ActivityIndicator size="large" color={Colors.primary.main} />
    </View>
  );
} 