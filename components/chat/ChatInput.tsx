import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Platform, Text, Modal } from 'react-native';
import { Send, Camera, Image as ImageIcon, DollarSign, X } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

interface ChatInputProps {
  onSend: (message: string, isBargain?: boolean, offeredPrice?: number) => void;
  onImagePress?: () => void;
  onCameraPress?: () => void;
  currentProduct?: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
}

export function ChatInput({ onSend, onImagePress, onCameraPress, currentProduct }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [showBargainModal, setShowBargainModal] = useState(false);
  const [offeredPrice, setOfferedPrice] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleBargainPress = () => {
    if (currentProduct) {
      setOfferedPrice(String(currentProduct.price * 0.9)); // Default to 10% off
      setShowBargainModal(true);
    }
  };

  const handleSubmitBargain = () => {
    if (currentProduct && offeredPrice) {
      const priceValue = parseFloat(offeredPrice);
      if (!isNaN(priceValue) && priceValue > 0) {
        onSend(
          `I'd like to offer $${priceValue.toFixed(2)} for this product.`,
          true,
          priceValue
        );
        setShowBargainModal(false);
        setOfferedPrice('');
      }
    }
  };

  return (
    <>
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
            {currentProduct && (
              <TouchableOpacity style={styles.actionButton} onPress={handleBargainPress}>
                <DollarSign size={24} color={Colors.primary.main} />
              </TouchableOpacity>
            )}
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

      {/* Bargain Modal */}
      <Modal
        visible={showBargainModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBargainModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Make an Offer</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowBargainModal(false)}
              >
                <X size={24} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            {currentProduct && (
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{currentProduct.name}</Text>
                <Text style={styles.productPrice}>Original price: ${currentProduct.price.toFixed(2)}</Text>
              </View>
            )}
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Your Offer ($)</Text>
              <TextInput
                style={styles.priceInput}
                value={offeredPrice}
                onChangeText={setOfferedPrice}
                placeholder="Enter amount"
                keyboardType="decimal-pad"
                placeholderTextColor={Colors.text.light}
              />
            </View>
            
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmitBargain}
            >
              <Text style={styles.submitButtonText}>Send Offer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Layout.spacing.m,
    minHeight: 300,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.m,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: Colors.text.primary,
  },
  closeButton: {
    padding: Layout.spacing.xs,
  },
  productInfo: {
    marginBottom: Layout.spacing.m,
    padding: Layout.spacing.m,
    backgroundColor: Colors.background.light,
    borderRadius: Layout.borderRadius.m,
  },
  productName: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: Colors.text.secondary,
  },
  inputGroup: {
    marginBottom: Layout.spacing.m,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  priceInput: {
    borderWidth: 1,
    borderColor: Colors.grey[300],
    borderRadius: Layout.borderRadius.s,
    padding: Layout.spacing.m,
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: Colors.text.primary,
  },
  submitButton: {
    backgroundColor: Colors.primary.main,
    padding: Layout.spacing.m,
    borderRadius: Layout.borderRadius.m,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: Colors.white,
  },
});