import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Product } from '@/types';
import { Star as StarIcon, User } from 'lucide-react-native';

interface ProductCardProps {
  product: Product;
  variant?: 'horizontal' | 'vertical' | 'compact';
  onAddToCart?: (productId: string) => void;
}

export function ProductCard({ 
  product, 
  variant = 'vertical', 
  onAddToCart 
}: ProductCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/product/${product.id}`);
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product.id);
    }
  };

  if (variant === 'compact') {
    return (
      <TouchableOpacity onPress={handlePress}>
        <Card style={styles.compactCard}>
          <Image source={{ uri: product.image }} style={styles.compactImage} />
          <Text style={styles.compactTitle} numberOfLines={1}>{product.name}</Text>
          <Text style={styles.compactPrice}>{product.price} Rs./{product.unit}</Text>
        </Card>
      </TouchableOpacity>
    );
  }

  if (variant === 'horizontal') {
    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
        <Card style={styles.horizontalCard}>
          <Image source={{ uri: product.image }} style={styles.horizontalImage} />
          <View style={styles.horizontalContent}>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {product.rating}</Text>
            </View>
            <Text style={styles.productName}>{product.name}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{product.price} Rs./{product.unit}</Text>
              <Text style={styles.originalPrice}>{product.originalPrice} Rs./{product.unit}</Text>
              <Text style={styles.discount}>{product.discountPercentage}% Off</Text>
            </View>
            <View style={styles.sellerContainer}>
              <View style={styles.sellerImageContainer}>
                {product.sellerImage ? (
                  <Image source={{ uri: product.sellerImage }} style={styles.sellerImage} />
                ) : (
                  <User size={16} color={Colors.grey[500]} />
                )}
              </View>
              <Text style={styles.sellerName}>{product.sellerName}</Text>
              <Text style={styles.distance}>{product.distance} km</Text>
            </View>
            <Button 
              title="Add" 
              onPress={handleAddToCart} 
              size="small" 
              style={styles.addButton}
            />
          </View>
        </Card>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9}>
      <Card style={styles.card}>
        <Image source={{ uri: product.image }} style={styles.image} />
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {product.rating}</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.productName}>{product.name}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{product.price} Rs./{product.unit}</Text>
            <Text style={styles.originalPrice}>{product.originalPrice} Rs./{product.unit}</Text>
          </View>
          <Text style={styles.discount}>{product.discountPercentage}% Off</Text>
          <View style={styles.footer}>
            <View style={styles.sellerContainer}>
              <View style={styles.sellerImageContainer}>
                {product.sellerImage ? (
                  <Image source={{ uri: product.sellerImage }} style={styles.sellerImage} />
                ) : (
                  <User size={16} color={Colors.grey[500]} />
                )}
              </View>
              <View>
                <Text style={styles.sellerName}>{product.sellerName}</Text>
                <Text style={styles.distance}>{product.distance} km</Text>
              </View>
            </View>
            <Button 
              title="Add" 
              onPress={handleAddToCart} 
              size="small" 
              style={styles.addButton}
            />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    borderRadius: Layout.borderRadius.m,
    marginBottom: Layout.spacing.m,
  },
  image: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: Layout.borderRadius.m,
    borderTopRightRadius: Layout.borderRadius.m,
  },
  content: {
    padding: Layout.spacing.s,
  },
  ratingContainer: {
    position: 'absolute',
    top: Layout.spacing.s,
    left: Layout.spacing.s,
    backgroundColor: Colors.background.main,
    borderRadius: Layout.borderRadius.s,
    paddingHorizontal: Layout.spacing.s,
    paddingVertical: 2,
    zIndex: 1,
  },
  rating: {
    fontSize: 12,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Layout.spacing.xs,
    color: Colors.text.primary,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.error.main,
    marginRight: Layout.spacing.xs,
  },
  originalPrice: {
    fontSize: 12,
    color: Colors.text.light,
    textDecorationLine: 'line-through',
  },
  discount: {
    fontSize: 12,
    color: Colors.success.main,
    fontWeight: '500',
    marginBottom: Layout.spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Layout.spacing.xs,
  },
  sellerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerImageContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.grey[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.xs,
    overflow: 'hidden',
  },
  sellerImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  sellerName: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  distance: {
    fontSize: 10,
    color: Colors.text.light,
  },
  addButton: {
    paddingVertical: 4,
    paddingHorizontal: Layout.spacing.s,
    minHeight: 28,
  },
  
  // Horizontal Card Styles
  horizontalCard: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: Layout.spacing.m,
  },
  horizontalImage: {
    width: 120,
    height: 120,
    borderTopLeftRadius: Layout.borderRadius.m,
    borderBottomLeftRadius: Layout.borderRadius.m,
  },
  horizontalContent: {
    flex: 1,
    padding: Layout.spacing.m,
    justifyContent: 'space-between',
  },
  
  // Compact Card Styles
  compactCard: {
    width: 80,
    padding: 0,
  },
  compactImage: {
    width: 80,
    height: 80,
    borderTopLeftRadius: Layout.borderRadius.m,
    borderTopRightRadius: Layout.borderRadius.m,
  },
  compactTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.primary,
    textAlign: 'center',
    padding: Layout.spacing.xs,
  },
  compactPrice: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.error.main,
    textAlign: 'center',
    paddingBottom: Layout.spacing.xs,
  },
});