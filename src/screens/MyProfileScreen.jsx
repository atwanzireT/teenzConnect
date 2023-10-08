// Import necessary components and libraries
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import COLORS from '../values/COLORS';
import { ref as dbref, child, get, DataSnapshot, onValue } from "firebase/database";
import { firebase_database, firebase_auth } from '../config/firebaseConfig';
import UserPostCard from '../ui_components/userpostcard';

// Create a functional component for the profile page
const MyProfileScreen = () => {
  const [userData, setUserData] = useState([]);
  const [userPosts, setUserPosts] = useState([]);

  const uid = firebase_auth.currentUser?.uid;

  useEffect(() => {
    const fetchUserData = async () => {
      if (uid) {
        const dbRef = dbref(firebase_database, `users/${uid}`);
        onValue(dbRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setUserData(data); // Update user data directly
            console.log("User name:", data.displayname);
          } else {
            setUserData(null);
            console.log("No User Data Found.");
          }
        });
      }
    };

    fetchUserData();
  }, [uid]);

  useEffect(() => {
    const postRef = dbref(firebase_database, "posts");

    onValue(postRef, (snapshot) => {
      const postdata = snapshot.val();
      if (postdata) {
        const postsArray = Object.values(postdata);
        const filteredData = postsArray.filter(item => item.user === uid);
        setUserPosts(filteredData);
        console.log("Filtered data: ", filteredData);
      } else {
        setUserPosts([]);
      }
    })
  }, []);

  const selectProfile = () => {

  }
  const updateProfileImage = async() => {
  try {
              const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.All,
                  allowsEditing: true,
                  aspect: [7, 9],
                  quality: 1,
              });

              if (!result.canceled) {
                  const selectedAssets = result.assets;
                  if (selectedAssets.length > 0) {
                      const selectedImage = selectedAssets[0];
                      setSelectedImage(selectedImage);
                  }
              }
          } catch (error) {
              console.error("Error picking image:", error);
          }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://2.bp.blogspot.com/-UpC5KUoUGM0/V7InSApZquI/AAAAAAAAAOA/7GwJUqTplMM7JdY6nCAnvXIi8BD6NnjPQCK4B/s1600/albert_einstein_by_zuzahin-d5pcbug.jpg' }}
          style={styles.profileImage}
        />
        <Text style={styles.username}>{userData?.displayname}</Text>
        <Text style={styles.bio}>{userData?.bio || ""}</Text>
      </View>

      <View style={styles.stats}>
        <Text style={styles.statsItem}>100 Posts</Text>
        <Text style={styles.statsItem}>10k Followers</Text>
        <Text style={styles.statsItem}>500 Following</Text>
      </View>

      <View style={styles.stats}>
        <TouchableOpacity>
          <Button mode='contained' buttonColor={COLORS.gray_200} textColor="#000" style={styles.statsItem}>Edit Profile</Button>
        </TouchableOpacity>
        <TouchableOpacity>
          <Button mode='contained' buttonColor={COLORS.gray_200} textColor="#000" style={styles.statsItem}>Share Profile</Button>
        </TouchableOpacity>
        <TouchableOpacity>
          <Button mode='contained' buttonColor={COLORS.gray_200} textColor="#000" style={styles.statsItem}>Contact</Button>
        </TouchableOpacity>
      </View>

      <View style={styles.posts}>
        {userPosts && userPosts.map((post, index) => ( 
          <UserPostCard
            key={index}
            image_uri={post.image}
          />
        ))}
      </View>
    </ScrollView>
  );
};

// Define styles using StyleSheet
const styles = StyleSheet.create({
  container: {

  },
  header: {
    alignItems: 'center',
    padding: 20,
    marginTop: 45,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  bio: {
    fontSize: 16,
    marginTop: 5,
    textAlign: "center"
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 5,
  },
  statsItem: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  posts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 0,
  },
  postImage: {
    width: '33%',
    aspectRatio: 1,
    marginVertical: 1,
  },
});

export default MyProfileScreen;
