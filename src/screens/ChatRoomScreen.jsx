import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import {
  collection,
  query,
  where,
  addDoc,
  onSnapshot,
  orderBy,
} from 'firebase/firestore'; // Firestore imports
import { firebase_firestore, firebase_auth } from '../config/firebaseConfig';
import TitleBar from '../ui_components/titleBar';

function ChatRoomScreen({ route }) {
  const [messages, setMessages] = useState([]);
  const { userId, roomName } = route.params;
  const uid = firebase_auth.currentUser?.uid;

  const roomId = userId + uid;
  const otherId = uid + userId;

  const chatRef = collection(firebase_firestore, 'chats');

  // Create a query to filter messages by roomId and order by 'createdAt'
  const roomQuery = query(
    chatRef,
    where('roomId', 'in', [roomId, otherId]),
    orderBy('createdAt')
  );

  // Function to send a new message to Firestore
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
      setMessages(chatMessages);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const onSend = (newMessages = []) => {
    // Add the user's ID and room ID to the message before sending
    const newMessage = {
      ...newMessages[0],
      user: {
        _id: uid,
        avatar:
          'https://2.bp.blogspot.com/-UpC5KUoUGM0/V7InSApZquI/AAAAAAAAAOA/7GwJUqTplMM7JdY6nCAnvXIi8BD6NnjPQCK4B/s1600/albert_einstein_by_zuzahin-d5pcbug.jpg',
      },
      roomId: roomId,
    };

    // Update the state with the new message
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessage));

    // Send the message to Firestore
    sendToFirestore(newMessage);
  };

  return (
    <View style={{ flex: 1 }}>
      <TitleBar/>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{ _id: uid }}
        isTyping={true}
      />
    </View>
  );
}

export default ChatRoomScreen;
