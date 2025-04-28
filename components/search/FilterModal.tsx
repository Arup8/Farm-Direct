import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Button } from '@/components/ui/Button';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

interface FilterState {
  sortBy: string;
  priceRange: [number, number];
  rating: number;
  availability: boolean;
  organic: boolean;
}

const sortOptions = [
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Rating', value: 'rating' },
  { label: 'Distance', value: 'distance' },
];

const ratingOptions = [5, 4, 3, 2, 1];

export function FilterModal({ visible, onClose, onApply, initialFilters }: FilterModalProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters || {
    sortBy: 'price_asc',
    priceRange: [0, 1000],
    rating: 0,
    availability: false,
    organic: false,
  });

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      sortBy: 'price_asc',
      priceRange: [0, 1000],
      rating: 0,
      availability: false,
      organic: false,
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sort By</Text>
              <View style={styles.optionsGrid}>
                {sortOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      filters.sortBy === option.value && styles.optionButtonActive,
                    ]}
                    onPress={() => setFilters({ ...filters, sortBy: option.value })}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        filters.sortBy === option.value && styles.optionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Rating</Text>
              <View style={styles.optionsGrid}>
                {ratingOptions.map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.optionButton,
                      filters.rating === rating && styles.optionButtonActive,
                    ]}
                    onPress={() => setFilters({ ...filters, rating })}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        filters.rating === rating && styles.optionTextActive,
                      ]}
                    >
                      {rating}⭐ & up
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Filters</Text>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  filters.availability && styles.toggleButtonActive,
                ]}
                onPress={() =>
                  setFilters({ ...filters, availability: !filters.availability })
                }
              >
                <Text
                  style={[
                    styles.toggleText,
                    filters.availability && styles.toggleTextActive,
                  ]}
                >
                  In Stock Only
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  filters.organic && styles.toggleButtonActive,
                ]}
                onPress={() => setFilters({ ...filters, organic: !filters.organic })}
              >
                <Text
                  style={[
                    styles.toggleText,
                    filters.organic && styles.toggleTextActive,
                  ]}
                >
                  Organic Only
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button
              title="Reset"
              variant="outline"
              onPress={handleReset}
              style={styles.resetButton}
            />
            <Button
              title="Apply Filters"
              onPress={handleApply}
              style={styles.applyButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Layout.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200],
  },
  title: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: Colors.text.primary,
  },
  closeButton: {
    padding: Layout.spacing.xs,
  },
  content: {
    padding: Layout.spacing.m,
  },
  section: {
    marginBottom: Layout.spacing.l,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: Colors.text.primary,
    marginBottom: Layout.spacing.s,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Layout.spacing.xs,
  },
  optionButton: {
    backgroundColor: Colors.background.light,
    borderRadius: Layout.borderRadius.m,
    paddingVertical: Layout.spacing.s,
    paddingHorizontal: Layout.spacing.m,
    margin: Layout.spacing.xs,
    borderWidth: 1,
    borderColor: Colors.grey[200],
  },
  optionButtonActive: {
    backgroundColor: Colors.primary.main,
    borderColor: Colors.primary.main,
  },
  optionText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: 'Nunito-Medium',
  },
  optionTextActive: {
    color: Colors.white,
  },
  toggleButton: {
    backgroundColor: Colors.background.light,
    borderRadius: Layout.borderRadius.m,
    paddingVertical: Layout.spacing.m,
    paddingHorizontal: Layout.spacing.m,
    marginBottom: Layout.spacing.s,
    borderWidth: 1,
    borderColor: Colors.grey[200],
  },
  toggleButtonActive: {
    backgroundColor: Colors.primary.main,
    borderColor: Colors.primary.main,
  },
  toggleText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: 'Nunito-Medium',
  },
  toggleTextActive: {
    color: Colors.white,
  },
  footer: {
    flexDirection: 'row',
    padding: Layout.spacing.m,
    borderTopWidth: 1,
    borderTopColor: Colors.grey[200],
  },
  resetButton: {
    flex: 1,
    marginRight: Layout.spacing.s,
  },
  applyButton: {
    flex: 1,
    marginLeft: Layout.spacing.s,
  },
});