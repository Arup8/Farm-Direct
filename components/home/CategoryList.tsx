import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

interface Category {
  id: string;
  name: string;
  image: string;
  route: string;
}

interface CategoryListProps {
  title: string;
  categories: Category[];
}

// Sample categories data
const defaultCategories: Category[] = [
  {
    id: '1',
    name: 'Vegetables',
    image: 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg',
    route: '/products/vegetables',
  },
  {
    id: '2',
    name: 'Fruits',
    image: 'https://images.pexels.com/photos/1093038/pexels-photo-1093038.jpeg',
    route: '/products/fruits',
  },
  {
    id: '3',
    name: 'Dairy',
    image: 'https://images.pexels.com/photos/2531189/pexels-photo-2531189.jpeg',
    route: '/products/dairy',
  },
  {
    id: '4',
    name: 'Grains',
    image: 'https://images.pexels.com/photos/1537169/pexels-photo-1537169.jpeg',
    route: '/products/grains',
  },
  {
    id: '5',
    name: 'Herbs',
    image: 'https://images.pexels.com/photos/1002746/pexels-photo-1002746.jpeg',
    route: '/products/herbs',
  },
];

export function CategoryList({ title, categories = defaultCategories }: CategoryListProps) {
  const router = useRouter();

  const handleCategoryPress = (category: Category) => {
    router.push(category.route);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryItem}
            onPress={() => handleCategoryPress(category)}
          >
            <View style={styles.imageContainer}>
              <Image source={{ uri: category.image }} style={styles.categoryImage} />
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Layout.spacing.m,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Layout.spacing.s,
    paddingHorizontal: Layout.spacing.m,
  },
  scrollViewContent: {
    paddingHorizontal: Layout.spacing.m,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: Layout.spacing.l,
    width: 80,
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    backgroundColor: Colors.background.main,
    marginBottom: Layout.spacing.xs,
    borderWidth: 2,
    borderColor: Colors.primary.light,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
    textAlign: 'center',
  },
});