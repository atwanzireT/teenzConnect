// ChatListScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore'; // Updated Firestore imports
import { firebase_auth, firebase_firestore } from '../config/firebaseConfig';
import customstyles from '../values/styles';

const ChatListScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);

  // Removed the userPosts state as it's not used in this code.

  console.log("Profile User Data :", users);

  const uid = firebase_auth.currentUser?.uid;

  useEffect(() => {
    const fetchUserData = async () => {
      if (uid) {
        const userRef = collection(firebase_firestore, 'users');
        const q = query(userRef, where("uid", "!=", uid));
        const querySnapshot = await getDocs(q);

        // Initialize an empty array to store user data
        const userData = [];

        querySnapshot.forEach((doc) => {
          // Push each user's data to the userData array
          userData.push(doc.data());
        });

        // Set the users state with the array of user data
        setUsers(userData);
      }
    };

    fetchUserData();
  }, [uid]);

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(user) => user.uid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chatRoom]}
            onPress={() =>
              navigation.navigate('ChatRoom', {
                userId: item.uid,
                roomName: item.displayname,
              })
            }
          >
            <View style={[customstyles.grid]}>
              <Image
                source={{ uri: 'https://2.bp.blogspot.com/-UpC5KUoUGM0/V7InSApZquI/AAAAAAAAAOA/7GwJUqTplMM7JdY6nCAnvXIi8BD6NnjPQCK4B/s1600/albert_einstein_by_zuzahin-d5pcbug.jpg' }}
                style={styles.profileImage}
              />
              <View>
                <Text style={styles.roomName}>{item.displayname}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  chatRoom: {
    padding: 16,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  roomName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: '#777',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight:20,
  },
});

export default ChatListScreen;
