import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Platform, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, CreditCard, Wallet, Truck, BanknoteIcon as Cash } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { OrderSummary } from '@/components/cart/OrderSummary';
import { products } from '@/data/mockData';

const paymentMethods = [
  { id: 'upi', label: 'UPI', icon: Wallet },
  { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
  { id: 'cod', label: 'Cash on Delivery', icon: Cash },
];

// Mock cart items for demonstration
const cartItems = [
  { id: '1', productId: '1', quantity: 2, product: products[0] },
  { id: '2', productId: '2', quantity: 1, product: products[1] },
];

export default function CheckoutScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [selectedPayment, setSelectedPayment] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    setError(null);

    // Validate inputs
    if (!address.street || !address.city || !address.state || !address.pincode) {
      setError('Please fill in all address fields');
      return;
    }

    if (!selectedPayment) {
      setError('Please select a payment method');
      return;
    }

    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to success screen or show confirmation
      router.push('/orders');
    } catch (err) {
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color={Colors.primary.main} />
            <Text style={styles.sectionTitle}>Delivery Address</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Street Address"
            value={address.street}
            onChangeText={(text) => setAddress({ ...address, street: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="City"
            value={address.city}
            onChangeText={(text) => setAddress({ ...address, city: text })}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="State"
              value={address.state}
              onChangeText={(text) => setAddress({ ...address, state: text })}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="PIN Code"
              value={address.pincode}
              onChangeText={(text) => setAddress({ ...address, pincode: text })}
              keyboardType="numeric"
              maxLength={6}
            />
          </View>
        </Card>

        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <CreditCard size={20} color={Colors.primary.main} />
            <Text style={styles.sectionTitle}>Payment Method</Text>
          </View>

          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentOption,
                selectedPayment === method.id && styles.paymentOptionSelected,
              ]}
              onPress={() => setSelectedPayment(method.id)}
            >
              <method.icon
                size={20}
                color={
                  selectedPayment === method.id
                    ? Colors.primary.main
                    : Colors.text.secondary
                }
              />
              <Text
                style={[
                  styles.paymentOptionText,
                  selectedPayment === method.id && styles.paymentOptionTextSelected,
                ]}
              >
                {method.label}
              </Text>
            </TouchableOpacity>
          ))}
        </Card>

        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Truck size={20} color={Colors.primary.main} />
            <Text style={styles.sectionTitle}>Order Summary</Text>
          </View>

          <OrderSummary items={cartItems} />
        </Card>

        {error && <Text style={styles.errorText}>{error}</Text>}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Place Order"
          onPress={handlePlaceOrder}
          loading={loading}
          fullWidth
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
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    color: Colors.text.primary,
  },
  content: {
    flex: 1,
    padding: Layout.spacing.m,
  },
  section: {
    marginBottom: Layout.spacing.m,
    padding: Layout.spacing.m,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.m,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: Colors.text.primary,
    marginLeft: Layout.spacing.s,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.grey[300],
    borderRadius: Layout.borderRadius.m,
    padding: Layout.spacing.m,
    marginBottom: Layout.spacing.s,
    fontSize: 14,
    color: Colors.text.primary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 0.48,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.m,
    borderWidth: 1,
    borderColor: Colors.grey[300],
    borderRadius: Layout.borderRadius.m,
    marginBottom: Layout.spacing.s,
  },
  paymentOptionSelected: {
    borderColor: Colors.primary.main,
    backgroundColor: Colors.primary.light,
  },
  paymentOptionText: {
    marginLeft: Layout.spacing.m,
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: 'Nunito-Medium',
  },
  paymentOptionTextSelected: {
    color: Colors.primary.main,
    fontFamily: 'Nunito-SemiBold',
  },
  errorText: {
    color: Colors.error.main,
    textAlign: 'center',
    marginBottom: Layout.spacing.m,
    fontFamily: 'Nunito-Medium',
  },
  footer: {
    padding: Layout.spacing.m,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.grey[200],
  },
});