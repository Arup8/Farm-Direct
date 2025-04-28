import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Search, MapPin, X } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  onSubmit?: () => void;
  placeholder?: string;
  showLocationIcon?: boolean;
  location?: string;
  onLocationPress?: () => void;
  style?: object;
}

export function SearchBar({
  value,
  onChangeText,
  onClear,
  onSubmit,
  placeholder = 'Search Products...',
  showLocationIcon = false,
  location,
  onLocationPress,
  style,
}: SearchBarProps) {
  return (
    <View style={[styles.container, style]}>
      {showLocationIcon && (
        <TouchableOpacity style={styles.locationButton} onPress={onLocationPress}>
          <MapPin size={18} color={Colors.primary.main} />
        </TouchableOpacity>
      )}
      <View style={styles.searchContainer}>
        <Search size={18} color={Colors.grey[500]} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.grey[500]}
          returnKeyType="search"
          onSubmitEditing={onSubmit}
        />
        {value.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={onClear}>
            <X size={16} color={Colors.grey[500]} />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity style={styles.searchButton} onPress={onSubmit}>
        <Search size={20} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.s,
    backgroundColor: Colors.background.light,
  },
  locationButton: {
    marginRight: Layout.spacing.s,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.m,
    paddingHorizontal: Layout.spacing.m,
    paddingVertical: Layout.spacing.xs,
    borderWidth: 1,
    borderColor: Colors.grey[200],
  },
  searchIcon: {
    marginRight: Layout.spacing.s,
  },
  input: {
    flex: 1,
    height: 36,
    fontSize: 14,
    color: Colors.text.primary,
  },
  clearButton: {
    padding: Layout.spacing.xs,
  },
  searchButton: {
    backgroundColor: Colors.primary.main,
    width: 36,
    height: 36,
    borderRadius: Layout.borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Layout.spacing.s,
  },
});