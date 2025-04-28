import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Platform, Image } from 'react-native';
import { Bell } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { SearchBar } from '@/components/ui/SearchBar';
import { Banner } from '@/components/home/Banner';
import { ProductList } from '@/components/product/ProductList';
import { CategoryList } from '@/components/home/CategoryList';
import { FarmerList } from '@/components/home/FarmerList';
import { banners, products, farmers } from '@/data/mockData';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?query=${searchQuery}`);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleAddToCart = (productId: string) => {
    // Add to cart functionality to be implemented
    console.log('Add to cart:', productId);
  };

  const discountedProducts = products.filter(p => p.discountPercentage > 40);
  const recommendedProducts = products.filter(p => p.rating >= 4.3);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/533360/pexels-photo-533360.jpeg' }} 
              style={styles.logoImage} 
            />
            <Text style={styles.logoText}>Farm Direct</Text>
          </View>
          <Bell size={24} color={Colors.text.primary} />
        </View>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={handleClearSearch}
          onSubmit={handleSearch}
          showLocationIcon={true}
          location="Kolkata, West Bengal"
          style={styles.searchBar}
        />

        <Banner banners={banners} />

        <CategoryList title="Categories" />

        <ProductList
          title="Price Drop Alerts 🔥"
          products={discountedProducts}
          onSeeAllPress={() => router.push('/products?filter=discounted')}
          onAddToCart={handleAddToCart}
        />

        <ProductList
          title="Recommended For You"
          products={recommendedProducts}
          onSeeAllPress={() => router.push('/products?filter=recommended')}
          onAddToCart={handleAddToCart}
        />

        <FarmerList
          title="Farmers in Your Area"
          farmers={farmers}
          onSeeAllPress={() => router.push('/farmers')}
        />
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
    paddingBottom: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: Layout.spacing.xs,
  },
  logoText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    color: Colors.primary.dark,
  },
  searchBar: {
    marginHorizontal: Layout.spacing.m,
    marginBottom: Layout.spacing.m,
  },
});