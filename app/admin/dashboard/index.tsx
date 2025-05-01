import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Users,
  ShoppingBag,
  BarChart,
  AlertCircle,
  Settings,
  ChevronRight,
  Store,
} from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'today' | 'week' | 'month'>('today');

  // Add debug logging
  useEffect(() => {
    console.log('Admin dashboard loaded');
    console.log('Current user:', user);
  }, []);

  // Mock data with proper typing
  const stats: {
    [key: string]: { 
      users: number; 
      orders: number; 
      revenue: number; 
      complaints: number; 
    }
  } = {
    today: {
      users: 8,
      orders: 45,
      revenue: 9500,
      complaints: 2,
    },
    week: {
      users: 25,
      orders: 245,
      revenue: 45000,
      complaints: 7,
    },
    month: {
      users: 120,
      orders: 850,
      revenue: 175000,
      complaints: 22,
    },
  };

  const recentUsers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'customer',
      joined: '2 days ago',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'seller',
      joined: '5 days ago',
    },
  ];

  const pendingComplaints = [
    {
      id: '1',
      user: 'Alice Johnson',
      type: 'product-quality',
      time: '1 day ago',
    },
    {
      id: '2',
      user: 'Bob Wilson',
      type: 'delivery-issue',
      time: '2 days ago',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <TouchableOpacity onPress={() => router.push('/admin/dashboard/settings' as any)}>
          <Image
            source={user?.image ? { uri: user.image } : { uri: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.statsHeader}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'today' && styles.activeTab]}
              onPress={() => setActiveTab('today')}
            >
              <Text
                style={[styles.tabText, activeTab === 'today' && styles.activeTabText]}
              >
                Today
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'week' && styles.activeTab]}
              onPress={() => setActiveTab('week')}
            >
              <Text
                style={[styles.tabText, activeTab === 'week' && styles.activeTabText]}
              >
                This Week
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'month' && styles.activeTab]}
              onPress={() => setActiveTab('month')}
            >
              <Text
                style={[styles.tabText, activeTab === 'month' && styles.activeTabText]}
              >
                This Month
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <Card style={styles.statsCard}>
            <Users size={24} color={Colors.primary.main} />
            <Text style={styles.statsValue}>{stats[activeTab].users}</Text>
            <Text style={styles.statsLabel}>New Users</Text>
          </Card>

          <Card style={styles.statsCard}>
            <ShoppingBag size={24} color={Colors.success.main} />
            <Text style={styles.statsValue}>{stats[activeTab].orders}</Text>
            <Text style={styles.statsLabel}>Orders</Text>
          </Card>

          <Card style={styles.statsCard}>
            <BarChart size={24} color={Colors.info.main} />
            <Text style={styles.statsValue}>₹{stats[activeTab].revenue}</Text>
            <Text style={styles.statsLabel}>Revenue</Text>
          </Card>

          <Card style={styles.statsCard}>
            <AlertCircle size={24} color={Colors.error.main} />
            <Text style={styles.statsValue}>{stats[activeTab].complaints}</Text>
            <Text style={styles.statsLabel}>Complaints</Text>
          </Card>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Management</Text>
          </View>
          
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/admin/dashboard/users' as any)}
            >
              <Users size={24} color={Colors.primary.main} />
              <Text style={styles.actionText}>User Management</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/admin/dashboard/sellers' as any)}
            >
              <Store size={24} color={Colors.primary.main} />
              <Text style={styles.actionText}>Seller Management</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/admin/dashboard/orders' as any)}
            >
              <ShoppingBag size={24} color={Colors.primary.main} />
              <Text style={styles.actionText}>Order Management</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/admin/dashboard/complaints' as any)}
            >
              <AlertCircle size={24} color={Colors.primary.main} />
              <Text style={styles.actionText}>Complaints</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New Users</Text>
            <TouchableOpacity onPress={() => router.push('/admin/dashboard/users' as any)}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {recentUsers.map((user) => (
            <TouchableOpacity 
              key={user.id}
              style={styles.listItem}
              onPress={() => router.push(`/admin/dashboard/users/${user.id}` as any)}
            >
              <View style={styles.listItemContent}>
                <Text style={styles.listItemTitle}>{user.name}</Text>
                <Text style={styles.listItemSubtitle}>{user.email} • {user.role}</Text>
                <Text style={styles.listItemDate}>Joined {user.joined}</Text>
              </View>
              <ChevronRight size={20} color={Colors.grey[400]} />
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pending Complaints</Text>
            <TouchableOpacity onPress={() => router.push('/admin/dashboard/complaints' as any)}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {pendingComplaints.map((complaint) => (
            <TouchableOpacity 
              key={complaint.id}
              style={styles.listItem}
              onPress={() => router.push(`/admin/dashboard/complaints/${complaint.id}` as any)}
            >
              <View style={styles.listItemContent}>
                <Text style={styles.listItemTitle}>From: {complaint.user}</Text>
                <Text style={styles.listItemSubtitle}>Type: {complaint.type}</Text>
                <Text style={styles.listItemDate}>Submitted: {complaint.time}</Text>
              </View>
              <ChevronRight size={20} color={Colors.grey[400]} />
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.footer}>
          <Button 
            variant="primary"
            title="Admin Settings"
            onPress={() => router.push('/admin/dashboard/settings' as any)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.main,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.m,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: Layout.spacing.m,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200],
  },
  title: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    color: Colors.text.primary,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  statsHeader: {
    padding: Layout.spacing.m,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background.light,
    borderRadius: Layout.borderRadius.m,
    padding: Layout.spacing.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: Layout.spacing.s,
    alignItems: 'center',
    borderRadius: Layout.borderRadius.s,
  },
  activeTab: {
    backgroundColor: Colors.white,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
    color: Colors.text.secondary,
  },
  activeTabText: {
    color: Colors.primary.main,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: Layout.spacing.m,
  },
  statsCard: {
    width: '48%',
    marginBottom: Layout.spacing.m,
    marginHorizontal: '1%',
    padding: Layout.spacing.m,
    alignItems: 'center',
  },
  statsValue: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    color: Colors.text.primary,
    marginVertical: Layout.spacing.s,
  },
  statsLabel: {
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
    color: Colors.text.secondary,
  },
  section: {
    marginBottom: Layout.spacing.m,
    paddingHorizontal: Layout.spacing.m,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.s,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: Colors.text.primary,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: Colors.primary.main,
  },
  actionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Layout.spacing.m,
  },
  actionCard: {
    width: '48%',
    backgroundColor: Colors.white,
    padding: Layout.spacing.m,
    borderRadius: Layout.borderRadius.m,
    marginBottom: Layout.spacing.s,
    marginHorizontal: '1%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionText: {
    marginTop: Layout.spacing.s,
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: Layout.spacing.m,
    borderRadius: Layout.borderRadius.m,
    marginBottom: Layout.spacing.s,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: Colors.text.primary,
  },
  listItemSubtitle: {
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
    color: Colors.text.secondary,
    marginTop: 2,
  },
  listItemDate: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: Colors.grey[500],
    marginTop: 2,
  },
  footer: {
    padding: Layout.spacing.m,
    marginBottom: Layout.spacing.xl,
  },
}); 