import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, Users } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

// Mock user data
const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'customer' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'seller' },
  { id: '3', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
  { id: '4', name: 'Bob Johnson', email: 'bob@example.com', role: 'customer' },
  { id: '5', name: 'Alice Williams', email: 'alice@example.com', role: 'seller' },
];

export default function AdminUsersScreen() {
  const router = useRouter();

  const renderUserItem = ({ item }: { item: typeof mockUsers[0] }) => (
    <TouchableOpacity 
      style={styles.userCard}
      onPress={() => router.push(`/admin/dashboard/users/${item.id}` as any)}
    >
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <View style={[
          styles.roleBadge, 
          item.role === 'admin' 
            ? styles.adminBadge 
            : item.role === 'seller' 
              ? styles.sellerBadge 
              : styles.customerBadge
        ]}>
          <Text style={styles.roleText}>{item.role}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          headerTitle: 'User Management',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ChevronLeft size={24} color={Colors.primary.main} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <View style={styles.header}>
        <Users size={24} color={Colors.primary.main} />
        <Text style={styles.title}>All Users</Text>
      </View>
      
      <FlatList
        data={mockUsers}
        renderItem={renderUserItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.main,
  },
  backButton: {
    marginLeft: Layout.spacing.s,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.m,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200],
  },
  title: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: Colors.text.primary,
    marginLeft: Layout.spacing.s,
  },
  listContainer: {
    padding: Layout.spacing.m,
  },
  userCard: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.m,
    padding: Layout.spacing.m,
    marginBottom: Layout.spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'column',
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: Colors.text.primary,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
    color: Colors.text.secondary,
    marginTop: 4,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: Layout.borderRadius.s,
    marginTop: 8,
  },
  adminBadge: {
    backgroundColor: Colors.error.light,
  },
  sellerBadge: {
    backgroundColor: Colors.warning.light,
  },
  customerBadge: {
    backgroundColor: Colors.success.light,
  },
  roleText: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: Colors.text.primary,
  },
}); 