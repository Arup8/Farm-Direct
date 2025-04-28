import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, Star } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Farmer } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface FarmerListProps {
  title: string;
  farmers: Farmer[];
  seeAllLink?: string;
  onSeeAllPress?: () => void;
}

export function FarmerList({
  title,
  farmers,
  seeAllLink,
  onSeeAllPress,
}: FarmerListProps) {
  const router = useRouter();

  const handleFarmerPress = (farmerId: string) => {
    router.push(`/farmer/${farmerId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {(seeAllLink || onSeeAllPress) && (
          <TouchableOpacity onPress={onSeeAllPress} style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>See All</Text>
            <ChevronRight size={16} color={Colors.primary.main} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={farmers}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.farmersList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.farmerCard}>
            <View style={styles.farmerInfo}>
              <Image source={{ uri: item.image }} style={styles.farmerImage} />
              <View style={styles.farmerDetails}>
                <Text style={styles.farmerName}>{item.name}</Text>
                <View style={styles.ratingContainer}>
                  <Star size={14} color={Colors.warning.main} fill={Colors.warning.main} />
                  <Text style={styles.rating}>{item.rating}</Text>
                </View>
                <Text style={styles.distance}>{item.distance} km away</Text>
              </View>
            </View>
            <Button
              title="View"
              variant="outline"
              size="small"
              onPress={() => handleFarmerPress(item.id)}
              style={styles.viewButton}
            />
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Layout.spacing.m,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.m,
    marginBottom: Layout.spacing.s,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary.main,
    fontWeight: '500',
  },
  farmersList: {
    paddingHorizontal: Layout.spacing.m,
  },
  farmerCard: {
    width: 220,
    marginRight: Layout.spacing.m,
    padding: Layout.spacing.m,
  },
  farmerInfo: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.m,
  },
  farmerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: Layout.spacing.m,
  },
  farmerDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  farmerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  distance: {
    fontSize: 12,
    color: Colors.text.light,
  },
  viewButton: {
    alignSelf: 'center',
  },
});