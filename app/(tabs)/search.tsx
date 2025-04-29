import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text, Platform, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Filter } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { SearchBar } from '@/components/ui/SearchBar';
import { RecentSearches } from '@/components/search/RecentSearches';
import { PopularSearches } from '@/components/search/PopularSearches';
import { ProductList } from '@/components/product/ProductList';
import { FarmerList } from '@/components/home/FarmerList';
import { FilterModal } from '@/components/search/FilterModal';
import { products, farmers, popularSearches } from '@/data/mockData';
import { Product } from '@/types';

interface FilterState {
  sortBy: string;
  priceRange: [number, number];
  rating: number;
  availability: boolean;
  organic: boolean;
}

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    sortBy: 'price_asc',
    priceRange: [0, 1000],
    rating: 0,
    availability: false,
    organic: false,
  });
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  useEffect(() => {
    if (params.query) {
      setSearchQuery(String(params.query));
      performSearch(String(params.query));
    }
  }, [params.query]);

  useEffect(() => {
    applyFilters();
  }, [filters, searchQuery]);

  const applyFilters = () => {
    let filtered = [...products];

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.rating);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'distance':
          return a.distance - b.distance;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const performSearch = (query: string) => {
    if (query.trim() === '') return;
    
    if (!recentSearches.includes(query)) {
      const updatedSearches = [query, ...recentSearches.slice(0, 4)];
      setRecentSearches(updatedSearches);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleSearchItemPress = (search: string) => {
    setSearchQuery(search);
    performSearch(search);
  };

  const handleClearSearchItem = (search: string) => {
    setRecentSearches(recentSearches.filter(item => item !== search));
  };

  const handleClearAllSearches = () => {
    setRecentSearches([]);
  };

  const handleAddToCart = (productId: string) => {
    console.log('Add to cart:', productId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={handleClearSearch}
          onSubmit={handleSearch}
          style={styles.searchBar}
        />
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Filter size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      {!searchQuery ? (
        <View style={styles.content}>
          <RecentSearches
            searches={recentSearches}
            onSearchPress={handleSearchItemPress}
            onClearPress={handleClearSearchItem}
            onClearAll={handleClearAllSearches}
          />
          
          <PopularSearches
            items={popularSearches}
            onItemPress={(item) => handleSearchItemPress(item as string)}
          />
          
          <PopularSearches
            title="Trending Products"
            items={products.slice(0, 4)}
            isProducts={true}
            onItemPress={(item) => router.push(`/product/${(item as any).id}`)}
          />
          
          <FarmerList
            title="Farmers in Your Area"
            farmers={farmers}
            onSeeAllPress={() => router.push('/farmers')}
          />
        </View>
      ) : (
        <View style={styles.searchResults}>
          <View style={styles.filterContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity 
                style={[
                  styles.filterChip,
                  filters.sortBy !== 'price_asc' && styles.filterChipActive,
                ]}
                onPress={() => setShowFilters(true)}
              >
                <Text style={styles.filterChipText}>Sort by</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.filterChip,
                  filters.availability && styles.filterChipActive,
                ]}
                onPress={() => setShowFilters(true)}
              >
                <Text style={styles.filterChipText}>Availability</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.filterChip,
                  filters.organic && styles.filterChipActive,
                ]}
                onPress={() => setShowFilters(true)}
              >
                <Text style={styles.filterChipText}>Organic</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.filterChip,
                  filters.rating > 0 && styles.filterChipActive,
                ]}
                onPress={() => setShowFilters(true)}
              >
                <Text style={styles.filterChipText}>Rating</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          
          <ProductList
            title="Search Results"
            products={filteredProducts}
            horizontal={false}
            onAddToCart={handleAddToCart}
          />
        </View>
      )}

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
    paddingHorizontal: Layout.spacing.m,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 10,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200],
  },
  backButton: {
    padding: Layout.spacing.xs,
    marginRight: Layout.spacing.xs,
  },
  searchBar: {
    flex: 1,
  },
  filterButton: {
    padding: Layout.spacing.xs,
    marginLeft: Layout.spacing.xs,
  },
  content: {
    flex: 1,
  },
  searchResults: {
    flex: 1,
  },
  filterContainer: {
    paddingVertical: Layout.spacing.s,
    paddingHorizontal: Layout.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200],
  },
  filterChip: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.m,
    paddingHorizontal: Layout.spacing.m,
    paddingVertical: Layout.spacing.xs,
    marginRight: Layout.spacing.s,
    borderWidth: 1,
    borderColor: Colors.grey[300],
  },
  filterChipActive: {
    backgroundColor: Colors.primary.light,
    borderColor: Colors.primary.main,
  },
  filterChipText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: 'Nunito-Medium',
  },
});