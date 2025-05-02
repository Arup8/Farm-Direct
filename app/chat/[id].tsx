import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Phone, MoreVertical, ShoppingCart } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { getChatById, sendMessage, getAllProducts } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  isBargain?: boolean;
  bargainDetails?: {
    productId: string;
    originalPrice: number;
    offeredPrice: number;
    status: 'pending' | 'accepted' | 'rejected';
  };
  isAI?: boolean;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user: currentUser } = useAuth();
  const flatListRef = useRef<FlatList>(null);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sellerData, setSellerData] = useState<{
    id: string;
    name: string;
    image: string;
  } | null>(null);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [sellerActive, setSellerActive] = useState(false);

  // Fetch chat data on mount
  useEffect(() => {
    fetchChatData();
    fetchSellerProducts();
  }, [id]);

  const fetchChatData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching chat with ID:", id);
      const response = await getChatById(id as string);
      
      if (response.success) {
        const chat = response.data;
        
        // Find the other participant (not the current user)
        // Use the currentUser ID from auth context to identify which participant is not you
        const otherParticipant = chat.participants.find(
          (p: any) => p._id !== currentUser?.id
        );
        
        if (!otherParticipant) {
          console.error("Could not identify the other participant in the chat");
          setError("Error identifying chat participant");
          return;
        }
        
        console.log("Current user ID:", currentUser?.id);
        console.log("Other participant ID:", otherParticipant._id);
        
        // Set seller data
        setSellerData({
          id: otherParticipant._id,
          name: otherParticipant.name,
          image: otherParticipant.image,
        });
        
        // Check if seller is active (if field exists in data)
        if (chat.participantStatus && chat.participantStatus[otherParticipant._id]) {
          setSellerActive(chat.participantStatus[otherParticipant._id].isActive || false);
        }
        
        // Convert messages to our format
        const formattedMessages = chat.messages.map((msg: any) => {
          // Message is yours if the sender ID matches your user ID
          const isOwnMessage = msg.sender._id === currentUser?.id;
          
          return {
            id: msg._id,
            text: msg.content,
            timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            isOwn: isOwnMessage,
            isBargain: msg.isBargain || false,
            bargainDetails: msg.bargainDetails || undefined,
            isAI: msg.isAIMessage || false,
          };
        });
        
        setMessages(formattedMessages);
      } else {
        setError('Failed to load chat: ' + (response.message || 'Unknown error'));
      }
    } catch (err: any) {
      console.error('Error fetching chat:', err);
      
      // Handle 403 error specifically
      if (err.response?.status === 403) {
        setError('You are not authorized to access this chat. This may happen if you try to access a chat that does not belong to you.');
        // Try to go back to chat list after 3 seconds
        setTimeout(() => {
          router.push('/chat');
        }, 3000);
      } else {
        setError(err.message || 'Failed to load chat');
      }
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const fetchSellerProducts = async () => {
    try {
      // Get the seller ID from the chat or URL
      const sellerId = sellerData?.id || id;
      
      // Fetch products
      const response = await getAllProducts({ seller: sellerId });
      
      if (response.success && response.data.length > 0) {
        const products = response.data.map((product: any) => ({
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || 'https://via.placeholder.com/50',
        }));
        
        setSellerProducts(products);
        
        // Set the first product as current
        if (products.length > 0) {
          setCurrentProduct(products[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching seller products:', err);
      // Non-critical error, don't show to user
    }
  };

  const handleSend = async (text: string, isBargain = false, offeredPrice?: number) => {
    try {
      setLoading(true);
      const bargainProductId = isBargain && currentProduct ? currentProduct.id : undefined;
      
      console.log("Sending message:", text);
      console.log("Chat ID:", id);
      console.log("Is bargain:", isBargain);
      console.log("Product ID:", bargainProductId);
      console.log("Offered price:", offeredPrice);
      
      // Add message optimistically to UI first
      const newMessage: Message = {
        id: Date.now().toString(),
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
        isBargain,
        bargainDetails: isBargain && bargainProductId && offeredPrice ? {
          productId: bargainProductId,
          originalPrice: currentProduct?.price || 0,
          offeredPrice,
          status: 'pending',
        } : undefined,
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd();
      }, 100);
      
      // Send to API
      try {
        const response = await sendMessage(
          id as string, 
          text, 
          isBargain, 
          bargainProductId, 
          offeredPrice
        );
        
        console.log("Message send response:", response);
        
        if (response.success) {
          // If there was an AI response, add it to the messages
          if (response.aiResponded && response.aiMessage) {
            const aiMessage: Message = {
              id: Date.now().toString() + '-ai',
              text: response.aiMessage.content,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isOwn: false,
              isAI: true,
            };
            
            setMessages(prev => [...prev, aiMessage]);
            
            // Scroll to bottom again after AI responds
            setTimeout(() => {
              flatListRef.current?.scrollToEnd();
            }, 100);
          }
          
          // Refresh the entire chat to ensure consistency
          fetchChatData();
        } else {
          console.error("API reported error:", response.message);
          Alert.alert('Error', response.message || 'Failed to send message. Please try again.');
        }
      } catch (sendError: any) {
        console.error("API call failed:", sendError);
        console.error("Error details:", sendError.response?.data);
        console.error("Status code:", sendError.response?.status);
        Alert.alert(
          'Error Sending Message', 
          `Failed to send message: ${sendError.message || 'Unknown error'}. Status: ${sendError.response?.status || 'N/A'}`
        );
      }
    } catch (err: any) {
      console.error('Error in handleSend:', err);
      Alert.alert('Error', err.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBargain = (messageId: string) => {
    // Logic to accept bargain would be implemented here
    Alert.alert('Confirm', 'Are you sure you want to accept this offer?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Accept',
        onPress: () => {
          // Update the local message state for immediate feedback
          setMessages(prev => 
            prev.map(msg => 
              msg.id === messageId 
                ? { 
                    ...msg, 
                    bargainDetails: { 
                      ...msg.bargainDetails!,
                      status: 'accepted' 
                    } 
                  } 
                : msg
            )
          );
          
          // In a real app, call API to update bargain status
          // This would also create an order or similar next step
          Alert.alert('Success', 'Offer accepted! Processing your order...');
        },
      },
    ]);
  };

  const handleRejectBargain = (messageId: string) => {
    Alert.alert('Confirm', 'Are you sure you want to reject this offer?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Reject',
        onPress: () => {
          // Update the local message state for immediate feedback
          setMessages(prev => 
            prev.map(msg => 
              msg.id === messageId 
                ? { 
                    ...msg, 
                    bargainDetails: { 
                      ...msg.bargainDetails!,
                      status: 'rejected' 
                    } 
                  } 
                : msg
            )
          );
          
          // In a real app, call API to update bargain status
          Alert.alert('Offer Rejected', 'You have rejected this offer.');
        },
      },
    ]);
  };

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary.main} />
      </SafeAreaView>
    );
  }

  if (error && messages.length === 0) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchChatData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.primary.main} />
        </TouchableOpacity>
        
        {sellerData && (
          <TouchableOpacity 
            style={styles.sellerInfo}
            onPress={() => router.push(`/farmer/${sellerData.id}`)}
          >
            <Image 
              source={{ uri: sellerData.image || 'https://via.placeholder.com/50' }} 
              style={styles.sellerImage} 
            />
            <View>
              <Text style={styles.sellerName}>{sellerData.name}</Text>
              <View style={styles.statusContainer}>
                <View 
                  style={[
                    styles.statusIndicator, 
                    sellerActive ? styles.activeStatus : styles.inactiveStatus
                  ]} 
                />
                <Text style={styles.statusText}>
                  {sellerActive ? 'Active now' : 'Offline'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Phone size={20} color={Colors.primary.main} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MoreVertical size={20} color={Colors.primary.main} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ChatMessage
            message={item.text}
            timestamp={item.timestamp}
            isOwn={item.isOwn}
            isBargain={item.isBargain}
            bargainDetails={item.bargainDetails}
            isAI={item.isAI}
            onAcceptBargain={() => handleAcceptBargain(item.id)}
            onRejectBargain={() => handleRejectBargain(item.id)}
          />
        )}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={Colors.primary.main} />
        </View>
      )}

      <ChatInput
        onSend={handleSend}
        onImagePress={() => console.log('Image picker')}
        onCameraPress={() => console.log('Camera')}
        currentProduct={currentProduct || undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.main,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingHorizontal: Layout.spacing.m,
    paddingBottom: Layout.spacing.m,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200],
  },
  backButton: {
    padding: Layout.spacing.xs,
  },
  sellerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Layout.spacing.s,
  },
  sellerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: Layout.spacing.s,
  },
  sellerName: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: Colors.text.primary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  activeStatus: {
    backgroundColor: Colors.success.main,
  },
  inactiveStatus: {
    backgroundColor: Colors.grey[400],
  },
  statusText: {
    fontSize: 12,
    color: Colors.text.light,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: Layout.spacing.xs,
    marginLeft: Layout.spacing.s,
  },
  messageList: {
    padding: Layout.spacing.m,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.main,
  },
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 1000,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.main,
    padding: Layout.spacing.l,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: Layout.spacing.m,
    color: Colors.error.main,
  },
  retryButton: {
    backgroundColor: Colors.primary.main,
    paddingHorizontal: Layout.spacing.l,
    paddingVertical: Layout.spacing.m,
    borderRadius: Layout.borderRadius.m,
  },
  retryButtonText: {
    color: Colors.white,
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
  },
});