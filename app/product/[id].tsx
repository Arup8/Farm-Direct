import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Heart, MessageCircle, Share2, Star, Truck } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Button } from '@/components/ui/Button';
import { ProductList } from '@/components/product/ProductList';
import { products } from '@/data/mockData';

export default function ProductDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Find the product by ID
  const product = products.find(p => p.id === id) || products[0];
  
  // Get similar products (excluding current product)
  const similarProducts = products
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = () => {
    // Add to cart functionality
    console.log('Add to cart:', product.id);
    router.push('/cart');
  };

  const handleBuyNow = () => {
    // Buy now functionality
    console.log('Buy now:', product.id);
    router.push('/checkout');
  };

  const handleChatWithSeller = () => {
    router.push(`/chat/${product.sellerId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <ArrowLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton} onPress={toggleFavorite}>
            <Heart 
              size={24} 
              color={isFavorite ? Colors.error.main : Colors.text.primary}
              fill={isFavorite ? Colors.error.main : 'transparent'}
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.headerButton}>
            <Share2 size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: product.image }} style={styles.productImage} />
        
        <View style={styles.content}>
          <View style={styles.productHeader}>
            <Text style={styles.productName}>{product.name}</Text>
            
            <View style={styles.ratingContainer}>
              <Star size={16} color={Colors.warning.main} fill={Colors.warning.main} />
              <Text style={styles.rating}>{product.rating}</Text>
              <Text style={styles.reviews}>({product.reviews} reviews)</Text>
            </View>
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{product.price} Rs./{product.unit}</Text>
            <Text style={styles.originalPrice}>{product.originalPrice} Rs./{product.unit}</Text>
            <Text style={styles.discount}>{product.discountPercentage}% Off</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.sellerContainer}
            onPress={() => router.push(`/farmer/${product.sellerId}`)}
          >
            <Image source={{ uri: product.sellerImage }} style={styles.sellerImage} />
            <View style={styles.sellerInfo}>
              <Text style={styles.sellerName}>{product.sellerName}</Text>
              <Text style={styles.sellerDistance}>{product.distance} km away</Text>
            </View>
            <TouchableOpacity 
              style={styles.chatButton}
              onPress={handleChatWithSeller}
            >
              <MessageCircle size={16} color={Colors.white} />
              <Text style={styles.chatButtonText}>Chat</Text>
            </TouchableOpacity>
          </TouchableOpacity>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Highlights</Text>
            {product.highlights.map((highlight, index) => (
              <View key={index} style={styles.bulletPoint}>
                <View style={styles.bullet} />
                <Text style={styles.bulletText}>{highlight}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Packaging</Text>
            {product.packaging.map((item, index) => (
              <View key={index} style={styles.bulletPoint}>
                <View style={styles.bullet} />
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.deliveryInfo}>
            <Truck size={16} color={Colors.success.main} />
            <Text style={styles.deliveryText}>
              Usually delivered in 1-2 days
            </Text>
          </View>
          
          <ProductList
            title="You May Also Like"
            products={similarProducts}
            onAddToCart={(productId) => console.log('Add to cart:', productId)}
          />
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title="Add to Cart"
          variant="outline"
          onPress={handleAddToCart}
          style={styles.cartButton}
        />
        <Button
          title="Buy Now"
          onPress={handleBuyNow}
          style={styles.buyButton}
        />
      </View>
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
    position: 'absolute',
    top: Platform.OS === 'android' ? 40 : 10,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: Layout.spacing.m,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Layout.spacing.s,
  },
  headerRight: {
    flexDirection: 'row',
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    padding: Layout.spacing.m,
  },
  productHeader: {
    marginBottom: Layout.spacing.s,
  },
  productName: {
    fontSize: 22,
    fontFamily: 'Nunito-Bold',
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginLeft: 4,
    marginRight: 4,
  },
  reviews: {
    fontSize: 14,
    color: Colors.text.light,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.m,
  },
  price: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    color: Colors.error.main,
    marginRight: Layout.spacing.s,
  },
  originalPrice: {
    fontSize: 16,
    color: Colors.text.light,
    textDecorationLine: 'line-through',
    marginRight: Layout.spacing.s,
  },
  discount: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: Colors.success.main,
  },
  sellerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.light,
    padding: Layout.spacing.m,
    borderRadius: Layout.borderRadius.m,
    marginBottom: Layout.spacing.m,
  },
  sellerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  sellerInfo: {
    flex: 1,
    marginLeft: Layout.spacing.m,
  },
  sellerName: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  sellerDistance: {
    fontSize: 14,
    color: Colors.text.light,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary.main,
    paddingVertical: Layout.spacing.xs,
    paddingHorizontal: Layout.spacing.m,
    borderRadius: Layout.borderRadius.m,
  },
  chatButtonText: {
    color: Colors.white,
    marginLeft: 4,
    fontFamily: 'Nunito-SemiBold',
  },
  section: {
    marginBottom: Layout.spacing.m,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: Colors.text.primary,
    marginBottom: Layout.spacing.s,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.text.secondary,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.xs,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary.main,
    marginRight: Layout.spacing.s,
  },
  bulletText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.light,
    padding: Layout.spacing.s,
    borderRadius: Layout.borderRadius.s,
    marginBottom: Layout.spacing.m,
  },
  deliveryText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: Layout.spacing.s,
  },
  footer: {
    flexDirection: 'row',
    padding: Layout.spacing.m,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.grey[200],
  },
  cartButton: {
    flex: 1,
    marginRight: Layout.spacing.s,
  },
  buyButton: {
    flex: 1,
    marginLeft: Layout.spacing.s,
  },
});