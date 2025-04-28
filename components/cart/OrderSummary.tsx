import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Card } from '@/components/ui/Card';
import { CartItem } from '@/types';

interface OrderSummaryProps {
  items: CartItem[];
  deliveryFee?: number;
  discount?: number;
}

export function OrderSummary({ 
  items, 
  deliveryFee = 40, 
  discount = 0 
}: OrderSummaryProps) {
  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity);
  }, 0);

  // Calculate savings
  const savings = items.reduce((sum, item) => {
    const savedPerItem = (item.product.originalPrice - item.product.price) * item.quantity;
    return sum + savedPerItem;
  }, 0);

  // Calculate final total
  const total = subtotal + deliveryFee - discount;

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Order Summary</Text>
      
      <View style={styles.row}>
        <Text style={styles.label}>Items ({items.length})</Text>
        <Text style={styles.value}>{subtotal} Rs.</Text>
      </View>
      
      <View style={styles.row}>
        <Text style={styles.label}>Delivery Fee</Text>
        <Text style={styles.value}>{deliveryFee} Rs.</Text>
      </View>
      
      {discount > 0 && (
        <View style={styles.row}>
          <Text style={styles.label}>Discount</Text>
          <Text style={[styles.value, styles.discount]}>-{discount} Rs.</Text>
        </View>
      )}
      
      <View style={styles.divider} />
      
      <View style={styles.row}>
        <Text style={styles.totalLabel}>Order Total</Text>
        <Text style={styles.totalValue}>{total} Rs.</Text>
      </View>
      
      <View style={styles.savingsContainer}>
        <Text style={styles.savingsText}>You saved {savings} Rs. on this order!</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Layout.spacing.m,
    marginBottom: Layout.spacing.m,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Layout.spacing.m,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.s,
  },
  label: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  discount: {
    color: Colors.success.main,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.grey[200],
    marginVertical: Layout.spacing.s,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary.dark,
  },
  savingsContainer: {
    backgroundColor: Colors.success.light,
    padding: Layout.spacing.s,
    borderRadius: Layout.borderRadius.s,
    marginTop: Layout.spacing.m,
  },
  savingsText: {
    fontSize: 14,
    color: Colors.success.main,
    fontWeight: '600',
    textAlign: 'center',
  },
});