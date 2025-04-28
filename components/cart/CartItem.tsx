import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Card } from '@/components/ui/Card';
import { CartItem as CartItemType } from '@/types';

interface CartItemProps {
  item: CartItemType;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
}

export function CartItem({ item, onIncrement, onDecrement, onRemove }: CartItemProps) {
  const { product, quantity } = item;
  
  return (
    <Card style={styles.container}>
      <View style={styles.content}>
        <Image source={{ uri: product.image }} style={styles.image} />
        
        <View style={styles.details}>
          <Text style={styles.name}>{product.name}</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.price}>{product.price} Rs./{product.unit}</Text>
            <Text style={styles.originalPrice}>{product.originalPrice} Rs./{product.unit}</Text>
          </View>
          
          <Text style={styles.discount}>{product.discountPercentage}% Off</Text>
          
          <View style={styles.sellerInfo}>
            <Text style={styles.seller}>Seller: {product.sellerName}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.removeButton} 
          onPress={() => onRemove(item.id)}
        >
          <Trash2 size={18} color={Colors.error.main} />
        </TouchableOpacity>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityButton} 
            onPress={() => onDecrement(item.id)}
            disabled={quantity <= 1}
          >
            <Minus size={16} color={quantity <= 1 ? Colors.grey[400] : Colors.text.secondary} />
          </TouchableOpacity>
          
          <Text style={styles.quantity}>{quantity}</Text>
          
          <TouchableOpacity 
            style={styles.quantityButton} 
            onPress={() => onIncrement(item.id)}
          >
            <Plus size={16} color={Colors.text.secondary} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Layout.spacing.m,
    padding: Layout.spacing.m,
  },
  content: {
    flexDirection: 'row',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: Layout.borderRadius.s,
  },
  details: {
    flex: 1,
    marginLeft: Layout.spacing.m,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  priceRow: {
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
    marginBottom: Layout.spacing.xs,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seller: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Layout.spacing.m,
    paddingTop: Layout.spacing.s,
    borderTopWidth: 1,
    borderTopColor: Colors.grey[200],
  },
  removeButton: {
    padding: Layout.spacing.xs,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.grey[300],
    borderRadius: Layout.borderRadius.s,
  },
  quantityButton: {
    padding: Layout.spacing.s,
  },
  quantity: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    paddingHorizontal: Layout.spacing.s,
    minWidth: 30,
    textAlign: 'center',
  },
});