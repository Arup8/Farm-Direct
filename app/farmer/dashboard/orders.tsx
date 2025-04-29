import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Package, Clock, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Card } from '@/components/ui/Card';

// Mock orders data
const orders = [
  {
    id: '1',
    customer: 'John Doe',
    items: ['Tomatoes', 'Potatoes'],
    total: 250,
    status: 'pending',
    date: '2024-02-20',
  },
  {
    id: '2',
    customer: 'Jane Smith',
    items: ['Cauliflower', 'Carrots'],
    total: 180,
    status: 'confirmed',
    date: '2024-02-19',
  },
];

export default function FarmerOrdersScreen() {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return Colors.warning.main;
      case 'confirmed':
        return Colors.success.main;
      case 'cancelled':
        return Colors.error.main;
      default:
        return Colors.text.secondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return Clock;
      case 'confirmed':
        return CheckCircle;
      case 'cancelled':
        return XCircle;
      default:
        return Package;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Orders</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => {
          const StatusIcon = getStatusIcon(item.status);
          return (
            <Card style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View style={styles.orderInfo}>
                  <Text style={styles.customerName}>{item.customer}</Text>
                  <Text style={styles.orderDate}>{item.date}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                  <StatusIcon size={16} color={getStatusColor(item.status)} />
                  <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.items}>{item.items.join(', ')}</Text>
              <Text style={styles.total}>₹{item.total}</Text>
              
              <View style={styles.actions}>
                {item.status === 'pending' && (
                  <>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.acceptButton]}
                      onPress={() => console.log('Accept order:', item.id)}
                    >
                      <Text style={styles.actionButtonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.rejectButton]}
                      onPress={() => console.log('Reject order:', item.id)}
                    >
                      <Text style={[styles.actionButtonText, styles.rejectButtonText]}>Reject</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </Card>
          );
        }}
      />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.m,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: Layout.spacing.m,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200],
  },
  backButton: {
    padding: Layout.spacing.xs,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    color: Colors.text.primary,
  },
  content: {
    padding: Layout.spacing.m,
  },
  orderCard: {
    marginBottom: Layout.spacing.m,
    padding: Layout.spacing.m,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.s,
  },
  orderInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 12,
    color: Colors.text.light,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.s,
    paddingVertical: 4,
    borderRadius: Layout.borderRadius.m,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Nunito-Medium',
    marginLeft: 4,
  },
  items: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.xs,
  },
  total: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: Colors.primary.main,
  },
  actions: {
    flexDirection: 'row',
    marginTop: Layout.spacing.m,
  },
  actionButton: {
    flex: 1,
    paddingVertical: Layout.spacing.s,
    paddingHorizontal: Layout.spacing.m,
    borderRadius: Layout.borderRadius.m,
    alignItems: 'center',
    marginHorizontal: Layout.spacing.xs,
  },
  acceptButton: {
    backgroundColor: Colors.primary.main,
  },
  rejectButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.error.main,
  },
  actionButtonText: {
    color: Colors.white,
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
  },
  rejectButtonText: {
    color: Colors.error.main,
  },
});