import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

interface BargainDetails {
  productId: string;
  originalPrice: number;
  offeredPrice: number;
  status: 'pending' | 'accepted' | 'rejected';
}

interface ChatMessageProps {
  message: string;
  timestamp: string;
  isOwn: boolean;
  isBargain?: boolean;
  bargainDetails?: BargainDetails;
  onAcceptBargain?: () => void;
  onRejectBargain?: () => void;
  isAI?: boolean;
}

export function ChatMessage({ 
  message, 
  timestamp, 
  isOwn, 
  isBargain = false,
  bargainDetails,
  onAcceptBargain,
  onRejectBargain,
  isAI = false
}: ChatMessageProps) {
  
  // Render bargain specific message
  const renderBargainMessage = () => {
    if (!bargainDetails) return null;
    
    const { originalPrice, offeredPrice, status } = bargainDetails;
    const discount = ((originalPrice - offeredPrice) / originalPrice * 100).toFixed(0);
    
    if (status === 'pending') {
      return (
        <View style={styles.bargainContainer}>
          <Text style={styles.bargainTitle}>
            {isOwn ? 'Your Offer' : 'Bargain Offer'}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Original Price:</Text>
            <Text style={styles.priceValue}>${originalPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Offered Price:</Text>
            <Text style={styles.priceValue}>${offeredPrice.toFixed(2)} ({discount}% off)</Text>
          </View>
          
          {!isOwn && (
            <View style={styles.bargainActions}>
              <TouchableOpacity 
                style={[styles.bargainButton, styles.acceptButton]}
                onPress={onAcceptBargain}
              >
                <Text style={styles.bargainButtonText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.bargainButton, styles.rejectButton]}
                onPress={onRejectBargain}
              >
                <Text style={styles.bargainButtonText}>Decline</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
    } else {
      // Show status for accepted/rejected offers
      return (
        <View style={styles.bargainStatus}>
          <Text style={styles.bargainStatusText}>
            Offer {status === 'accepted' ? 'Accepted' : 'Declined'}
          </Text>
        </View>
      );
    }
  };

  return (
    <View style={[
      styles.container, 
      isOwn && styles.ownContainer,
      isAI && styles.aiContainer
    ]}>
      <View style={[
        styles.bubble, 
        isOwn && styles.ownBubble,
        isAI && styles.aiBubble,
        isBargain && styles.bargainBubble
      ]}>
        {isBargain ? renderBargainMessage() : (
          <Text style={[
            styles.message, 
            isOwn && styles.ownMessage,
            isAI && styles.aiMessage
          ]}>
            {message}
          </Text>
        )}
      </View>
      <Text style={[styles.timestamp, isOwn && styles.ownTimestamp]}>
        {timestamp}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Layout.spacing.xs,
    marginHorizontal: Layout.spacing.m,
    alignItems: 'flex-start',
  },
  ownContainer: {
    alignItems: 'flex-end',
  },
  aiContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    backgroundColor: Colors.background.light,
    borderRadius: Layout.borderRadius.m,
    paddingHorizontal: Layout.spacing.m,
    paddingVertical: Layout.spacing.s,
    maxWidth: '80%',
  },
  ownBubble: {
    backgroundColor: Colors.primary.main,
  },
  aiBubble: {
    backgroundColor: Colors.primary.light,
  },
  bargainBubble: {
    padding: 0,
    overflow: 'hidden',
  },
  message: {
    fontSize: 14,
    color: Colors.text.primary,
    fontFamily: 'Nunito-Regular',
  },
  ownMessage: {
    color: Colors.white,
  },
  aiMessage: {
    color: Colors.text.primary,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.text.light,
    marginTop: 4,
    fontFamily: 'Nunito-Regular',
  },
  ownTimestamp: {
    textAlign: 'right',
  },
  bargainContainer: {
    padding: Layout.spacing.s,
    width: '100%',
  },
  bargainTitle: {
    fontSize: 15,
    fontFamily: 'Nunito-Bold',
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.xs,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontFamily: 'Nunito-Regular',
  },
  priceValue: {
    fontSize: 14,
    color: Colors.text.primary,
    fontFamily: 'Nunito-SemiBold',
  },
  bargainActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Layout.spacing.s,
  },
  bargainButton: {
    paddingVertical: Layout.spacing.xs,
    paddingHorizontal: Layout.spacing.m,
    borderRadius: Layout.borderRadius.s,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: Colors.success.main,
  },
  rejectButton: {
    backgroundColor: Colors.error.main,
  },
  bargainButtonText: {
    color: Colors.white,
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
  },
  bargainStatus: {
    padding: Layout.spacing.s,
    alignItems: 'center',
  },
  bargainStatusText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: Colors.text.primary,
  },
});