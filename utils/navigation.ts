import { router } from 'expo-router';
import { User } from '@/types';

/**
 * Redirects users to the appropriate dashboard based on their role
 * @param user The authenticated user
 */
export const redirectToRoleDashboard = (user: User | null) => {
  if (!user) {
    return;
  }
  
  // Add a small timeout to ensure state updates are processed
  setTimeout(() => {
    try {
      switch (user.role) {
        case 'seller':
          router.replace('/farmer/dashboard' as any);
          break;
        case 'admin':
          // Try absolute path notation
          router.replace('/admin/dashboard/index' as any);
          break;
        case 'customer':
        default:
          router.replace('/(tabs)');
          break;
      }
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to a simpler path if there's an error
      if (user.role === 'admin') {
        router.replace('/admin' as any);
      }
    }
  }, 100);
}; 