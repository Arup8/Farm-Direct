import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Settings, ShoppingBag, Heart, MapPin, LogOut, ChevronRight } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Card } from '@/components/ui/Card';

export default function ProfileScreen() {
  const router = useRouter();
  
  // Mock user data
  const user = {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    address: 'Kolkata, West Bengal',
  };

  const menuItems = [
    {
      id: 'orders',
      title: 'My Orders',
      icon: <ShoppingBag size={20} color={Colors.primary.main} />,
      onPress: () => router.push('/orders'),
    },
    {
      id: 'wishlist',
      title: 'My Wishlist',
      icon: <Heart size={20} color={Colors.primary.main} />,
      onPress: () => router.push('/wishlist'),
    },
    {
      id: 'addresses',
      title: 'Saved Addresses',
      icon: <MapPin size={20} color={Colors.primary.main} />,
      onPress: () => router.push('/addresses'),
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: <Settings size={20} color={Colors.primary.main} />,
      onPress: () => router.push('/settings'),
    },
    {
      id: 'logout',
      title: 'Logout',
      icon: <LogOut size={20} color={Colors.error.main} />,
      onPress: () => console.log('Logout pressed'),
      danger: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>My Profile</Text>
        </View>

        <Card style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <Image source={{ uri: user.image }} style={styles.profileImage} />
            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
              <View style={styles.addressContainer}>
                <MapPin size={14} color={Colors.text.light} />
                <Text style={styles.profileAddress}>{user.address}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => router.push('/profile/edit')}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </Card>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                {item.icon}
                <Text 
                  style={[
                    styles.menuItemText, 
                    item.danger && styles.menuItemTextDanger
                  ]}
                >
                  {item.title}
                </Text>
              </View>
              <ChevronRight size={20} color={Colors.grey[400]} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
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
  profileCard: {
    marginHorizontal: Layout.spacing.m,
    marginTop: Layout.spacing.m,
    padding: Layout.spacing.m,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: Layout.spacing.m,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAddress: {
    fontSize: 12,
    color: Colors.text.light,
    marginLeft: 4,
  },
  editButton: {
    alignSelf: 'flex-start',
    marginTop: Layout.spacing.m,
    paddingVertical: Layout.spacing.xs,
    paddingHorizontal: Layout.spacing.m,
    backgroundColor: Colors.background.light,
    borderRadius: Layout.borderRadius.m,
    borderWidth: 1,
    borderColor: Colors.primary.main,
  },
  editButtonText: {
    fontSize: 14,
    color: Colors.primary.main,
    fontFamily: 'Nunito-SemiBold',
  },
  menuContainer: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.m,
    marginHorizontal: Layout.spacing.m,
    marginTop: Layout.spacing.l,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Layout.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200],
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: Colors.text.primary,
    marginLeft: Layout.spacing.m,
    fontFamily: 'Nunito-Medium',
  },
  menuItemTextDanger: {
    color: Colors.error.main,
  },
  versionContainer: {
    alignItems: 'center',
    marginVertical: Layout.spacing.xl,
  },
  versionText: {
    fontSize: 12,
    color: Colors.text.light,
  },
});