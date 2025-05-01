import { Stack } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { router } from 'expo-router';

export default function FarmerLayout() {
  const { user, isAuthenticated } = useAuth();

  // Protect farmer routes - redirect if not seller
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth/login' as any);
    } else if (user && user.role !== 'seller') {
      // Redirect non-seller users
      if (user.role === 'admin') {
        router.replace('/admin/dashboard' as any);
      } else {
        router.replace('/(tabs)');
      }
    }
  }, [isAuthenticated, user]);

  // Don't render anything while checking authentication
  if (!isAuthenticated || (user && user.role !== 'seller')) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="dashboard" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ headerShown: true }} />
    </Stack>
  );
} 