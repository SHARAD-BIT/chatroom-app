// app/chat.tsx
import React, { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  DocumentData,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useLocalSearchParams } from 'expo-router';

interface ChatMessage extends DocumentData {
  id: string;
  text: string;
  sender: string;
  createdAt?: Date;
}

const ChatScreen = () => {
  const { username } = useLocalSearchParams<{ username?: string }>();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          text: data.text,
          sender: data.sender,
          createdAt: data.createdAt?.toDate?.() || new Date(),
        };
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    try {
      await addDoc(collection(db, 'messages'), {
        text: trimmed,
        sender: username || 'Anonymous',
        createdAt: serverTimestamp(),
      });
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  useEffect(() => {
    const registerForPushNotifications = async () => {
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
  
        if (finalStatus !== 'granted') {
          alert('Permission not granted for push notifications');
          return;
        }
  
        const tokenData = await Notifications.getExpoPushTokenAsync();
        const pushToken = tokenData.data;
        console.log('📱 Push Notification Token:', pushToken);
        // 🔒 Optionally send this token to Firestore to use from your backend
      } else {
        alert('Must use physical device for push notifications');
      }
    };
  
    registerForPushNotifications();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <Text style={styles.message}>
            <Text style={styles.sender}>{item.sender}: </Text>
            {item.text}
          </Text>
        )}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#999"
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingBottom: 30,
    backgroundColor: '#fff',
  },
  message: {
    marginVertical: 6,
    fontSize: 16,
    color: '#333',
  },
  sender: {
    fontWeight: 'bold',
    color: '#444',
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    fontSize: 16,
  },
});