import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Banner as BannerType } from '@/types';

interface BannerProps {
  banners: BannerType[];
  autoScroll?: boolean;
  autoScrollInterval?: number;
}

const { width } = Dimensions.get('window');

export function Banner({ 
  banners, 
  autoScroll = true, 
  autoScrollInterval = 5000 
}: BannerProps) {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  };

  const handleBannerPress = (banner: BannerType) => {
    if (banner.url) {
      router.push(banner.url);
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (autoScroll && banners.length > 1) {
      intervalId = setInterval(() => {
        if (scrollViewRef.current) {
          const nextIndex = (activeIndex + 1) % banners.length;
          scrollViewRef.current.scrollTo({ x: nextIndex * width, animated: true });
          setActiveIndex(nextIndex);
        }
      }, autoScrollInterval);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [activeIndex, autoScroll, autoScrollInterval, banners.length]);

  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {banners.map((banner, index) => (
          <TouchableOpacity 
            key={banner.id} 
            activeOpacity={0.9}
            onPress={() => handleBannerPress(banner)}
            style={styles.bannerItem}
          >
            <Image source={{ uri: banner.image }} style={styles.bannerImage} />
            <View style={styles.bannerOverlay}>
              <View style={styles.bannerContent}>
                <Text style={styles.bannerTitle}>{banner.title}</Text>
                {banner.subtitle && (
                  <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {banners.length > 1 && (
        <View style={styles.pagination}>
          {banners.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === activeIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Layout.spacing.m,
  },
  bannerItem: {
    width,
    height: 180,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'flex-end',
  },
  bannerContent: {
    padding: Layout.spacing.m,
  },
  bannerTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  bannerSubtitle: {
    color: Colors.white,
    fontSize: 14,
    marginTop: Layout.spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: Layout.spacing.s,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.grey[300],
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: Colors.white,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});