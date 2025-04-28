import React, { useState } from 'react';
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
  Package,
  TrendingUp,
  Users,
  MessageCircle,
  Star,
  ChevronRight,
  Plus,
} from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function FarmerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('today');

  // Mock data
  const stats = {
    today: {
      orders: 12,
      revenue: 2500,
      visitors: 45,
      rating: 4.5,
    },
    week: {
      orders: 85,
      revenue: 15000,
      visitors: 320,
      rating: 4.3,
    },
    month: {
      orders: 350,
      revenue: 62000,
      visitors: 1200,
      rating: 4.4,
    },
  };

  const recentOrders = [
    {
      id: '1',
      customer: 'John Doe',
      items: ['Tomatoes', 'Potatoes'],
      total: 250,
      status: 'pending',
    },
    {
      id: '2',
      customer: 'Jane Smith',
      items: ['Cauliflower', 'Carrots'],
      total: 180,
      status: 'confirmed',
    },
  ];

  const recentMessages = [
    {
      id: '1',
      customer: 'Alice Johnson',
      message: 'Are the tomatoes organic?',
      time: '10 min ago',
    },
    {
      id: '2',
      customer: 'Bob Wilson',
      message: 'When will you have fresh carrots?',
      time: '1 hour ago',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Farmer Dashboard</Text>
        <TouchableOpacity onPress={() => router.push('/farmer/dashboard/settings')}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg' }}
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
            <Package size={24} color={Colors.primary.main} />
            <Text style={styles.statsValue}>{stats[activeTab].orders}</Text>
            <Text style={styles.statsLabel}>Orders</Text>
          </Card>

          <Card style={styles.statsCard}>
            <TrendingUp size={24} color={Colors.success.main} />
            <Text style={styles.statsValue}>₹{stats[activeTab].revenue}</Text>
            <Text style={styles.statsLabel}>Revenue</Text>
          </Card>

          <Card style={styles.statsCard}>
            <Users size={24} color={Colors.info.main} />
            <Text style={styles.statsValue}>{stats[activeTab].visitors}</Text>
            <Text style={styles.statsLabel}>Visitors</Text>
          </Card>

          <Card style={styles.statsCard}>
            <Star size={24} color={Colors.warning.main} />
            <Text style={styles.statsValue}>{stats[activeTab].rating}</Text>
            <Text style={styles.statsLabel}>Rating</Text>
          </Card>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={() => router.push('/farmer/dashboard/orders')}
            >
              <Text style={styles.seeAllText}>See All</Text>
              <ChevronRight size={16} color={Colors.primary.main} />
            </TouchableOpacity>
          </View>

          {recentOrders.map(order => (
            <Card key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderCustomer}>{order.customer}</Text>
                <Text
                  style={[
                    styles.orderStatus,
                    order.status === 'confirmed' && styles.orderStatusConfirmed,
                  ]}
                >
                  {order.status}
                </Text>
              </View>
              <Text style={styles.orderItems}>{order.items.join(', ')}</Text>
              <Text style={styles.orderTotal}>₹{order.total}</Text>
            </Card>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Messages</Text>
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={() => router.push('/farmer/dashboard/messages')}
            >
              <Text style={styles.seeAllText}>See All</Text>
              <ChevronRight size={16} color={Colors.primary.main} />
            </TouchableOpacity>
          </View>

          {recentMessages.map(message => (
            <Card key={message.id} style={styles.messageCard}>
              <View style={styles.messageHeader}>
                <Text style={styles.messageCustomer}>{message.customer}</Text>
                <Text style={styles.messageTime}>{message.time}</Text>
              </View>
              <Text style={styles.messageText} numberOfLines={1}>
                {message.message}
              </Text>
            </Card>
          ))}
        </View>

        <View style={styles.actionButtons}>
          <Button
            title="Add New Product"
            onPress={() => router.push('/farmer/dashboard/products/new')}
            style={styles.actionButton}
            icon={<Plus size={20} color={Colors.white} />}
          />
          <Button
            title="View Products"
            variant="outline"
            onPress={() => router.push('/farmer/dashboard/products')}
            style={styles.actionButton}
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
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: Colors.text.primary,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: Colors.primary.main,
  },
  orderCard: {
    marginBottom: Layout.spacing.s,
    padding: Layout.spacing.m,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.xs,
  },
  orderCustomer: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: Colors.text.primary,
  },
  orderStatus: {
    fontSize: 12,
    fontFamily: 'Nunito-Medium',
    color: Colors.warning.main,
    backgroundColor: Colors.warning.light,
    paddingHorizontal: Layout.spacing.s,
    paddingVertical: 2,
    borderRadius: Layout.borderRadius.s,
  },
  orderStatusConfirmed: {
    color: Colors.success.main,
    backgroundColor: Colors.success.light,
  },
  orderItems: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.xs,
  },
  orderTotal: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: Colors.primary.main,
  },
  messageCard: {
    marginBottom: Layout.spacing.s,
    padding: Layout.spacing.m,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.xs,
  },
  messageCustomer: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: Colors.text.primary,
  },
  messageTime: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: Colors.text.light,
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: Colors.text.secondary,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: Layout.spacing.m,
    marginBottom: Layout.spacing.xl,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: Layout.spacing.xs,
  },
});