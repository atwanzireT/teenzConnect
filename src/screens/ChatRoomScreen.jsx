import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'; // Import Bubble component
import {
  collection,
  query,
  where,
  addDoc,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import { firebase_firestore, firebase_auth } from '../config/firebaseConfig';
import TitleBar from '../ui_components/titleBar';

function ChatRoomScreen({ route }) {
  const [messages, setMessages] = useState([]);
  const { userId, roomName, username } = route.params;
  const currentUserId = firebase_auth.currentUser?.uid;

  const roomId = userId + currentUserId;
  const otherId = currentUserId + userId;

  const chatRef = collection(firebase_firestore, 'chats');

  const roomQuery = query(
    chatRef,
    where('roomId', 'in', [roomId, otherId]),
    orderBy('createdAt')
  );

  const sendToFirestore = async (newMessage) => {
    try {
      await addDoc(chatRef, newMessage);
    } catch (error) {
      console.error('Error sending message to Firestore: ', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(roomQuery, (querySnapshot) => {
      const chatMessages = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          createdAt: data.createdAt.toDate(),
        };
      });
      const sortedMessages = chatMessages.sort((a, b) => b.createdAt - a.createdAt);
      setMessages(sortedMessages);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const onSend = (newMessages = []) => {
    const newMessage = {
      ...newMessages[0],
      user: {
        _id: currentUserId,
        // avatar: 'YOUR_AVATAR_URL_HERE',
      },
      roomId: roomId,
    };

    sendToFirestore(newMessage);
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'lightgray' }}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: currentUserId }}
        isTyping={true}
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: 'red', // Set the primary color to red for your messages
              },
              left: {
                backgroundColor: 'white', // Background color for received messages
              },
            }}
          />
        )}
      />
    </View>
  );
}

export default ChatRoomScreen;
