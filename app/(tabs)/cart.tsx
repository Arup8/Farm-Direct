import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ShoppingBag } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Button } from '@/components/ui/Button';
import { CartItem } from '@/components/cart/CartItem';
import { OrderSummary } from '@/components/cart/OrderSummary';
import { products } from '@/data/mockData';
import { CartItem as CartItemType } from '@/types';

// Mock cart data for demonstration
const initialCartItems: CartItemType[] = [
  { id: '1', productId: '1', quantity: 2, product: products[0] },
  { id: '2', productId: '2', quantity: 1, product: products[1] },
];

export default function CartScreen() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItemType[]>(initialCartItems);

  const handleIncrement = (id: string) => {
    setCartItems(
      cartItems.map(item => 
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrement = (id: string) => {
    setCartItems(
      cartItems.map(item => 
        item.id === id && item.quantity > 1 
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      )
    );
  };

  const handleRemove = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Shopping Cart</Text>
        <View style={{ width: 24 }} />
      </View>

      {cartItems.length > 0 ? (
        <>
          <FlatList
            data={cartItems}
            renderItem={({ item }) => (
              <CartItem
                item={item}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
                onRemove={handleRemove}
              />
            )}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.cartList}
          />

          <View style={styles.footer}>
            <OrderSummary items={cartItems} />
            <Button
              title="Proceed to Checkout"
              onPress={handleCheckout}
              fullWidth
              size="large"
            />
          </View>
        </>
      ) : (
        <View style={styles.emptyCart}>
          <ShoppingBag size={64} color={Colors.grey[400]} />
          <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
          <Text style={styles.emptyCartText}>
            Looks like you haven't added any products to your cart yet.
          </Text>
          <Button
            title="Start Shopping"
            onPress={() => router.push('/')}
            style={styles.shopButton}
          />
        </View>
      )}
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
  title: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: Colors.text.primary,
  },
  cartList: {
    padding: Layout.spacing.m,
  },
  footer: {
    backgroundColor: Colors.white,
    padding: Layout.spacing.m,
    borderTopWidth: 1,
    borderTopColor: Colors.grey[200],
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.xl,
  },
  emptyCartTitle: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    color: Colors.text.primary,
    marginTop: Layout.spacing.m,
    marginBottom: Layout.spacing.s,
  },
  emptyCartText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Layout.spacing.xl,
  },
  shopButton: {
    minWidth: 150,
  },
});