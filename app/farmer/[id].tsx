import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Heart, MessageCircle, ChevronRight, Star, Phone } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { ProductList } from '@/components/product/ProductList';
import { farmers, products } from '@/data/mockData';

export default function FarmerDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Find the farmer by ID
  const farmer = farmers.find(f => f.id === id) || farmers[0];
  
  // Get farmer's products
  const farmerProducts = products.filter(p => p.sellerId === farmer.id);

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleChat = () => {
    router.push(`/chat/${farmer.id}`);
  };

  const handleCall = () => {
    // Call functionality would be implemented here
    console.log('Call farmer:', farmer.id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Farmer Profile</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <Image source={{ uri: farmer.image }} style={styles.farmerImage} />
          
          <View style={styles.profileInfo}>
            <Text style={styles.farmerName}>{farmer.name}</Text>
            
            <View style={styles.ratingContainer}>
              <Star size={16} color={Colors.warning.main} fill={Colors.warning.main} />
              <Text style={styles.rating}>{farmer.rating}</Text>
            </View>
            
            <Text style={styles.location}>{farmer.location}</Text>
            <Text style={styles.stats}>{farmer.products} products • {farmer.distance} km away</Text>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleChat}>
            <MessageCircle size={20} color={Colors.primary.main} />
            <Text style={styles.actionButtonText}>Chat</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
            <Phone size={20} color={Colors.primary.main} />
            <Text style={styles.actionButtonText}>Call</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              isFollowing ? styles.followingButton : styles.followButton
            ]} 
            onPress={toggleFollow}
          >
            <Heart 
              size={20} 
              color={isFollowing ? Colors.white : Colors.primary.main}
              fill={isFollowing ? Colors.white : 'transparent'}
            />
            <Text 
              style={[
                styles.actionButtonText,
                isFollowing ? styles.followingButtonText : styles.followButtonText
              ]}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.bioSection}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bioText}>{farmer.bio}</Text>
        </View>
        
        <View style={styles.productsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Products</Text>
            <TouchableOpacity 
              style={styles.seeAllButton}
              onPress={() => router.push(`/products?farmer=${farmer.id}`)}
            >
              <Text style={styles.seeAllText}>See All</Text>
              <ChevronRight size={16} color={Colors.primary.main} />
            </TouchableOpacity>
          </View>
          
          <ProductList
            title=""
            products={farmerProducts}
            onAddToCart={(productId) => console.log('Add to cart:', productId)}
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
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: Colors.text.primary,
  },
  profileHeader: {
    flexDirection: 'row',
    padding: Layout.spacing.m,
    backgroundColor: Colors.white,
  },
  farmerImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: Layout.spacing.m,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  farmerName: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginLeft: 4,
  },
  location: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  stats: {
    fontSize: 14,
    color: Colors.text.light,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: Layout.spacing.m,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.grey[200],
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.spacing.s,
    paddingHorizontal: Layout.spacing.m,
    borderRadius: Layout.borderRadius.m,
    borderWidth: 1,
    borderColor: Colors.primary.main,
    minWidth: 90,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    marginTop: 4,
  },
  followButton: {
    backgroundColor: Colors.white,
  },
  followButtonText: {
    color: Colors.primary.main,
  },
  followingButton: {
    backgroundColor: Colors.primary.main,
    borderColor: Colors.primary.main,
  },
  followingButtonText: {
    color: Colors.white,
  },
  bioSection: {
    padding: Layout.spacing.m,
    backgroundColor: Colors.white,
    marginTop: Layout.spacing.m,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: Colors.text.primary,
    marginBottom: Layout.spacing.s,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.text.secondary,
  },
  productsSection: {
    padding: Layout.spacing.m,
    backgroundColor: Colors.white,
    marginTop: Layout.spacing.m,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.s,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary.main,
    fontFamily: 'Nunito-SemiBold',
  },
});