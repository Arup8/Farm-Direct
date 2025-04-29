import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera, Plus } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function NewProductScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    unit: '',
    quantity: '',
    category: '',
  });

  const handleAddProduct = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.back();
    } catch (error) {
      console.error('Failed to add product:', error);
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
        <Text style={styles.title}>Add New Product</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.imageSection}>
          <TouchableOpacity style={styles.uploadButton}>
            <Camera size={32} color={Colors.text.light} />
            <Text style={styles.uploadText}>Add Product Images</Text>
            <Text style={styles.uploadSubtext}>Upload up to 5 images</Text>
          </TouchableOpacity>
        </Card>

        <Card style={styles.formSection}>
          <TextInput
            style={styles.input}
            placeholder="Product Name"
            value={product.name}
            onChangeText={(text) => setProduct({ ...product, name: text })}
          />

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Price"
              value={product.price}
              onChangeText={(text) => setProduct({ ...product, price: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Unit (kg, pcs, etc.)"
              value={product.unit}
              onChangeText={(text) => setProduct({ ...product, unit: text })}
            />
          </View>

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Product Description"
            value={product.description}
            onChangeText={(text) => setProduct({ ...product, description: text })}
            multiline
            numberOfLines={4}
          />

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Quantity Available"
              value={product.quantity}
              onChangeText={(text) => setProduct({ ...product, quantity: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Category"
              value={product.category}
              onChangeText={(text) => setProduct({ ...product, category: text })}
            />
          </View>
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Add Product"
          onPress={handleAddProduct}
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
  imageSection: {
    marginBottom: Layout.spacing.m,
    padding: Layout.spacing.m,
  },
  uploadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.grey[300],
    borderRadius: Layout.borderRadius.m,
    padding: Layout.spacing.xl,
  },
  uploadText: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: Colors.text.primary,
    marginTop: Layout.spacing.s,
  },
  uploadSubtext: {
    fontSize: 14,
    color: Colors.text.light,
    marginTop: 4,
  },
  formSection: {
    padding: Layout.spacing.m,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  footer: {
    padding: Layout.spacing.m,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.grey[200],
  },
});