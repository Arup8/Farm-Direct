import { Stack } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { router } from 'expo-router';

export default function AdminLayout() {
  const { user, isAuthenticated } = useAuth();

  // Protect admin routes - redirect if not admin
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth/login' as any);
    } else if (user && user.role !== 'admin') {
      // Redirect non-admin users
      if (user.role === 'seller') {
        router.replace('/farmer/dashboard' as any);
      } else {
        router.replace('/(tabs)');
      }
    }
  }, [isAuthenticated, user]);

  // Don't render anything while checking authentication
  if (!isAuthenticated || (user && user.role !== 'admin')) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="dashboard" options={{ headerShown: false }} />
    </Stack>
  );
} 