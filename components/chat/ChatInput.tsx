import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Send, Camera, Image as ImageIcon } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

interface ChatInputProps {
  onSend: (message: string) => void;
  onImagePress?: () => void;
  onCameraPress?: () => void;
}

export function ChatInput({ onSend, onImagePress, onCameraPress }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor={Colors.text.light}
          multiline
          maxLength={500}
        />
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={onCameraPress}>
            <Camera size={24} color={Colors.primary.main} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onImagePress}>
            <ImageIcon size={24} color={Colors.primary.main} />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
        onPress={handleSend}
        disabled={!message.trim()}
      >
        <Send
          size={24}
          color={message.trim() ? Colors.white : Colors.grey[400]}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Layout.spacing.m,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.grey[200],
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.background.light,
    borderRadius: Layout.borderRadius.m,
    marginRight: Layout.spacing.s,
    paddingHorizontal: Layout.spacing.m,
    paddingVertical: Platform.OS === 'ios' ? Layout.spacing.s : 0,
    minHeight: 44,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.text.primary,
    fontFamily: 'Nunito-Regular',
    maxHeight: 100,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: Layout.spacing.xs,
    marginLeft: Layout.spacing.xs,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.grey[200],
  },
});