import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

interface ChatMessageProps {
  message: string;
  timestamp: string;
  isOwn: boolean;
}

export function ChatMessage({ message, timestamp, isOwn }: ChatMessageProps) {
  return (
    <View style={[styles.container, isOwn && styles.ownContainer]}>
      <View style={[styles.bubble, isOwn && styles.ownBubble]}>
        <Text style={[styles.message, isOwn && styles.ownMessage]}>{message}</Text>
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
  message: {
    fontSize: 14,
    color: Colors.text.primary,
    fontFamily: 'Nunito-Regular',
  },
  ownMessage: {
    color: Colors.white,
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
});