import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Clock, X } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

interface RecentSearchesProps {
  searches: string[];
  onSearchPress: (search: string) => void;
  onClearPress: (search: string) => void;
  onClearAll?: () => void;
  maxItems?: number;
}

export function RecentSearches({
  searches,
  onSearchPress,
  onClearPress,
  onClearAll,
  maxItems = 5,
}: RecentSearchesProps) {
  const displaySearches = searches.slice(0, maxItems);

  if (displaySearches.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Clock size={16} color={Colors.text.secondary} />
          <Text style={styles.title}>Recent Searches</Text>
        </View>
        {onClearAll && (
          <TouchableOpacity onPress={onClearAll}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {displaySearches.map((search, index) => (
          <TouchableOpacity
            key={index}
            style={styles.searchItem}
            onPress={() => onSearchPress(search)}
          >
            <Text style={styles.searchText}>{search}</Text>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => onClearPress(search)}
            >
              <X size={14} color={Colors.grey[500]} />
            </TouchableOpacity>
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
  clearAllText: {
    fontSize: 14,
    color: Colors.primary.main,
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.light,
    borderRadius: Layout.borderRadius.m,
    paddingVertical: Layout.spacing.xs,
    paddingHorizontal: Layout.spacing.s,
    marginRight: Layout.spacing.s,
    borderWidth: 1,
    borderColor: Colors.grey[200],
  },
  searchText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  clearButton: {
    marginLeft: Layout.spacing.xs,
    padding: 2,
  },
});