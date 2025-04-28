import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { TrendingUp } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { ProductCard } from '@/components/product/ProductCard';
import { Product } from '@/types';

interface PopularSearchesProps {
  items: string[] | Product[];
  isProducts?: boolean;
  onItemPress: (item: string | Product) => void;
  title?: string;
}

export function PopularSearches({
  items,
  isProducts = false,
  onItemPress,
  title = 'Popular Searches',
}: PopularSearchesProps) {
  if (items.length === 0) {
    return null;
  }

  if (isProducts) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <TrendingUp size={16} color={Colors.text.secondary} />
            <Text style={styles.title}>{title}</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(items as Product[]).map((product) => (
            <View key={product.id} style={styles.productItem}>
              <ProductCard 
                product={product} 
                variant="compact" 
                onAddToCart={() => onItemPress(product)}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <TrendingUp size={16} color={Colors.text.secondary} />
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {(items as string[]).map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.searchItem}
            onPress={() => onItemPress(item)}
          >
            <Text style={styles.searchText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Layout.spacing.m,
    paddingHorizontal: Layout.spacing.m,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.s,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginLeft: Layout.spacing.xs,
  },
  searchItem: {
    backgroundColor: Colors.background.light,
    borderRadius: Layout.borderRadius.m,
    paddingVertical: Layout.spacing.s,
    paddingHorizontal: Layout.spacing.m,
    marginRight: Layout.spacing.s,
    borderWidth: 1,
    borderColor: Colors.grey[200],
  },
  searchText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  productItem: {
    marginRight: Layout.spacing.s,
  },
});