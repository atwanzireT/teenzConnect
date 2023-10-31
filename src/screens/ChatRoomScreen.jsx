// ChatRoomScreen.js
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { collection, query, where, addDoc, onSnapshot, or } from 'firebase/firestore'; // Firestore imports
import { firebase_firestore, firebase_auth } from '../config/firebaseConfig';

function ChatRoomScreen({ route }) {
  const [messages, setMessages] = useState([]);
  const {userId, roomName } = route.params;

  const uid = firebase_auth.currentUser?.uid;

  const roomId = userId + uid;
  const otherId = uid + userId;

  const chatRef = collection(firebase_firestore, 'chats'); // Assuming 'chats' is the collection name

  // Create a query to filter messages by roomId
  const roomQuery = query(chatRef, or(where('roomId', '==', roomId), where('roomId', '==', otherId)));

  // Function to send a new message to Firestore
  const sendToFirestore = async (newMessages) => {
    try {
      await addDoc(chatRef, newMessages[0]); // Assuming newMessages is an array with a single message
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
      unsubscribe(); // Unsubscribe from Firestore updates when the component unmounts
    };
  }, []);

  const onSend = (newMessages = []) => {
    // Add the user's ID and room ID to the message before sending
    newMessages[0].user._id = uid;
    newMessages[0].roomId = roomId;

    // Update the state with the new message
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));

    // Send the message to Firestore
    sendToFirestore(newMessages);
  };

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        user={{ _id: uid, avatar: "https://2.bp.blogspot.com/-UpC5KUoUGM0/V7InSApZquI/AAAAAAAAAOA/7GwJUqTplMM7JdY6nCAnvXIi8BD6NnjPQCK4B/s1600/albert_einstein_by_zuzahin-d5pcbug.jpg" }}
        isTyping={true}
      />
    </View>
  );
}

export default ChatRoomScreen;
