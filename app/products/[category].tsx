import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Filter } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { ProductList } from '@/components/product/ProductList';
import { FilterModal } from '@/components/search/FilterModal';
import { products } from '@/data/mockData';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Product } from '@/types';

export default function CategoryProductsScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: 'price_asc',
    priceRange: [0, 1000],
    rating: 0,
    availability: false,
    organic: false,
  });

  // Filter and sort products based on category and filters
  const filteredProducts = products.filter(product => {
    if (filters.rating > 0 && product.rating < filters.rating) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const handleAddToCart = (productId: string) => {
    // Implement cart logic
    console.log('Add to cart:', productId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Filter size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ProductList
        title={category as string}
        products={filteredProducts}
        horizontal={false}
        onAddToCart={handleAddToCart}
      />

      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={setFilters}
        initialFilters={filters}
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
  filterButton: {
    padding: Layout.spacing.xs,
  },
});