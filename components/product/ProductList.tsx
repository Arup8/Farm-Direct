import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { ProductCard } from './ProductCard';
import { Product } from '@/types';

interface ProductListProps {
  title: string;
  products: Product[];
  seeAllLink?: string;
  onSeeAllPress?: () => void;
  horizontal?: boolean;
  onAddToCart?: (productId: string) => void;
}

export function ProductList({
  title,
  products,
  seeAllLink,
  onSeeAllPress,
  horizontal = true,
  onAddToCart,
}: ProductListProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {(seeAllLink || onSeeAllPress) && (
          <TouchableOpacity onPress={onSeeAllPress} style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>See All</Text>
            <ChevronRight size={16} color={Colors.primary.main} />
          </TouchableOpacity>
        )}
      </View>
      
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={horizontal ? styles.horizontalList : styles.gridList}
        renderItem={({ item }) => (
          <View style={horizontal ? styles.horizontalItem : styles.gridItem}>
            <ProductCard
              product={item}
              variant={horizontal ? "vertical" : "horizontal"}
              onAddToCart={onAddToCart}
            />
          </View>
        )}
        numColumns={horizontal ? 1 : 1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Layout.spacing.m,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.m,
    marginBottom: Layout.spacing.s,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary.main,
    fontWeight: '500',
  },
  horizontalList: {
    paddingHorizontal: Layout.spacing.m,
  },
  gridList: {
    paddingHorizontal: Layout.spacing.m,
  },
  horizontalItem: {
    marginRight: Layout.spacing.m,
  },
  gridItem: {
    marginBottom: Layout.spacing.m,
    width: '100%',
  },
});