import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView, Platform } from 'react-native';
import { Search, MoveVertical as MoreVertical } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { farmers } from '@/data/mockData';

// Mock chat data
const chats = farmers.map(farmer => ({
  id: farmer.id,
  name: farmer.name,
  image: farmer.image,
  lastMessage: 'Hello! I have some fresh produce available today.',
  time: '10:30 AM',
  unread: Math.floor(Math.random() * 3),
}));

export default function ChatScreen() {
  const router = useRouter();

  const handleChatPress = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  const renderChatItem = ({ item }: { item: typeof chats[0] }) => (
    <TouchableOpacity 
      style={styles.chatItem} 
      onPress={() => handleChatPress(item.id)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.image }} style={styles.avatar} />
      
      {item.unread > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unread}</Text>
        </View>
      )}
      
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatTime}>{item.time}</Text>
        </View>
        
        <Text 
          style={[styles.chatMessage, item.unread > 0 && styles.unreadMessage]} 
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

      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatList}
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
});