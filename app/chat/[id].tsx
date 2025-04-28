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
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Phone, MoreVertical } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { farmers } from '@/data/mockData';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const farmer = farmers.find(f => f.id === id);
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I have some fresh vegetables available today.',
      timestamp: '10:30 AM',
      isOwn: false,
    },
    {
      id: '2',
      text: 'Great! What vegetables do you have?',
      timestamp: '10:31 AM',
      isOwn: true,
    },
    {
      id: '3',
      text: 'I have fresh tomatoes, cauliflower, and potatoes. Would you like to see some photos?',
      timestamp: '10:32 AM',
      isOwn: false,
    },
  ]);

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const handleSend = (message: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isOwn: true,
    };

    setMessages(prev => [...prev, newMessage]);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleCall = () => {
    // Implement call functionality
    console.log('Calling farmer:', farmer?.name);
  };

  if (!farmer) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <ArrowLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.farmerInfo}
          onPress={() => router.push(`/farmer/${farmer.id}`)}
        >
          <Image source={{ uri: farmer.image }} style={styles.farmerImage} />
          <View style={styles.farmerDetails}>
            <Text style={styles.farmerName}>{farmer.name}</Text>
            <Text style={styles.farmerLocation}>{farmer.location}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleCall} style={styles.headerButton}>
            <Phone size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <MoreVertical size={24} color={Colors.text.primary} />
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
          />
        )}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <ChatInput
        onSend={handleSend}
        onImagePress={() => console.log('Image picker')}
        onCameraPress={() => console.log('Camera')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.m,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: Layout.spacing.m,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey[200],
  },
  headerButton: {
    padding: Layout.spacing.xs,
  },
  farmerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Layout.spacing.s,
  },
  farmerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: Layout.spacing.s,
  },
  farmerDetails: {
    flex: 1,
  },
  farmerName: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: Colors.text.primary,
  },
  farmerLocation: {
    fontSize: 12,
    color: Colors.text.light,
    fontFamily: 'Nunito-Regular',
  },
  headerActions: {
    flexDirection: 'row',
  },
  messageList: {
    paddingVertical: Layout.spacing.m,
  },
});