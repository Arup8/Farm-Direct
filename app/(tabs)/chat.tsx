import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView, Platform, ActivityIndicator, Alert } from 'react-native';
import { Search, MoveVertical as MoreVertical } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { getUserChats, getAllSellers, createOrGetChat } from '@/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/hooks/useAuth';

interface ChatListItem {
  id: string;
  name: string;
  image: string;
  lastMessage?: string;
  time?: string;
  unread?: number;
  isNewChat?: boolean;
}

export default function ChatScreen() {
  const router = useRouter();
  const { user: currentUser } = useAuth(); // Get current user from auth context
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user's existing chats
      const chatResponse = await getUserChats();
      let existingChats: ChatListItem[] = [];
      
      if (chatResponse.success && chatResponse.data.length > 0) {
        existingChats = chatResponse.data.map((chat: any) => {
          // Find other participant (not current user) using the current user's ID
          const otherParticipant = chat.participants.find(
            (p: any) => p._id !== currentUser?.id
          );
          
          // If we couldn't find the other participant, use the first one as fallback
          const participantToUse = otherParticipant || chat.participants[0];
          
          return {
            id: chat._id,
            name: participantToUse.name,
            image: participantToUse.image,
            lastMessage: chat.lastMessage?.content || 'Start a conversation',
            time: chat.lastMessage?.createdAt 
              ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }) 
              : undefined,
            unread: chat.messages.filter((m: any) => !m.readAt).length,
          };
        });
      }
      
      // Also fetch sellers for users who don't have chats yet
      const sellersResponse = await getAllSellers();
      
      if (sellersResponse.success) {
        // Filter out sellers that are already in chats
        const existingChatUserIds = existingChats.map(chat => chat.id);
        
        const additionalSellers = sellersResponse.data
          .filter((seller: any) => !existingChatUserIds.includes(seller._id))
          .map((seller: any) => ({
            id: seller._id,
            name: seller.name,
            image: seller.image,
            lastMessage: 'Tap to start chatting',
            isNewChat: true, // Flag to identify sellers without existing chats
          }));
        
        setChats([...existingChats, ...additionalSellers]);
      } else {
        setChats(existingChats);
      }
    } catch (err: any) {
      console.error('Error fetching chats:', err);
      setError(err.message || 'Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  const handleChatPress = async (item: ChatListItem) => {
    try {
      if (item.isNewChat) {
        // Create a new chat with this seller
        setLoading(true);
        console.log('Creating new chat with seller:', item.id, item.name);
        
        // Check auth token
        const token = await AsyncStorage.getItem('token');
        console.log('Auth token available:', !!token);
        
        const response = await createOrGetChat(item.id);
        console.log('Chat creation response:', response);
        
        if (response.success) {
          router.push(`/chat/${response.data._id}`);
        } else {
          Alert.alert('Error', response.message || 'Failed to create chat with seller');
        }
      } else {
        // Navigate to existing chat
        router.push(`/chat/${item.id}`);
      }
    } catch (err: any) {
      console.error('Error opening chat:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to open chat';
      Alert.alert('Error', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderChatItem = ({ item }: { item: ChatListItem }) => (
    <TouchableOpacity 
      style={styles.chatItem} 
      onPress={() => handleChatPress(item)}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: item.image || 'https://via.placeholder.com/50' }} 
        style={styles.avatar} 
      />
      
      {item.unread && item.unread > 0 ? (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unread}</Text>
        </View>
      ) : null}
      
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          {item.time && <Text style={styles.chatTime}>{item.time}</Text>}
        </View>
        
        <Text 
          style={[
            styles.chatMessage, 
            (item.unread && item.unread > 0) ? styles.unreadMessage : null,
            item.isNewChat ? styles.newChatMessage : null
          ]} 
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Search size={22} color={Colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MoreVertical size={22} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary.main} />
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchChats}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {!loading && !error && (
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.chatList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No chats found</Text>
            </View>
          }
          refreshing={loading}
          onRefresh={fetchChats}
        />
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.m,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: Layout.spacing.m,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200],
  },
  title: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    color: Colors.text.primary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: Layout.spacing.xs,
    marginLeft: Layout.spacing.s,
  },
  chatList: {
    paddingVertical: Layout.spacing.s,
  },
  chatItem: {
    flexDirection: 'row',
    padding: Layout.spacing.m,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200],
    position: 'relative',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: Layout.spacing.m,
  },
  unreadBadge: {
    position: 'absolute',
    top: Layout.spacing.m,
    left: 44,
    backgroundColor: Colors.primary.main,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  unreadText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 4,
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: Colors.text.primary,
  },
  chatTime: {
    fontSize: 12,
    color: Colors.text.light,
  },
  chatMessage: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  unreadMessage: {
    fontFamily: 'Nunito-SemiBold',
    color: Colors.text.primary,
  },
  newChatMessage: {
    color: Colors.primary.main,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.spacing.l,
  },
  errorText: {
    color: Colors.error.main,
    marginBottom: Layout.spacing.m,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Colors.primary.main,
    paddingHorizontal: Layout.spacing.m,
    paddingVertical: Layout.spacing.s,
    borderRadius: Layout.borderRadius.m,
  },
  retryText: {
    color: Colors.white,
    fontFamily: 'Nunito-Bold',
  },
  emptyContainer: {
    padding: Layout.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Nunito-Medium',
    color: Colors.text.light,
    fontSize: 16,
  },
});