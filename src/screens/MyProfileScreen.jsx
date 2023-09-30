// Import necessary components and libraries
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import COLORS from '../values/COLORS';

// Create a functional component for the profile page
const MyProfileScreen = () => {
  const [userData, setUserData] = useState([]);

  useEffect(()=>{
    
  })
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://2.bp.blogspot.com/-UpC5KUoUGM0/V7InSApZquI/AAAAAAAAAOA/7GwJUqTplMM7JdY6nCAnvXIi8BD6NnjPQCK4B/s1600/albert_einstein_by_zuzahin-d5pcbug.jpg' }}
          style={styles.profileImage}
        />
        <Text style={styles.username}>Kusa Fuaza</Text>
        <Text style={styles.bio}>The Future the medic beyonds #stdenisssebugwawo</Text>
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
        <Image source={require("./images/a1.jpg")} style={styles.postImage} />
        <Image source={require("./images/a2.jpg")} style={styles.postImage} />
        <Image source={require("./images/a3.jpg")} style={styles.postImage} />
        <Image source={require("./images/a4.jpg")} style={styles.postImage} />
        <Image source={require("./images/a5.jpg")} style={styles.postImage} />
        <Image source={require("./images/a6.jpg")} style={styles.postImage} />
        <Image source={require("./images/a7.jpg")} style={styles.postImage} />
        <Image source={require("./images/a8.png")} style={styles.postImage} />
        <Image source={require("./images/a9.jpg")} style={styles.postImage} />
        <Image source={require("./images/a10.png")} style={styles.postImage} />
        <Image source={require("./images/a11.jpg")} style={styles.postImage} />
        <Image source={require("./images/a12.jpg")} style={styles.postImage} />
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
