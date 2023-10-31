import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { ActivityIndicator, Button } from 'react-native-paper';
import { query, where, getDocs, addDoc, deleteDoc, collection } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { firebase_auth, firebase_firestore } from '../config/firebaseConfig';
import UserPostCard from '../ui_components/userpostcard';

const UserProfileScreen = ({ route }) => {
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const { userId } = route.params;

  const navigation = useNavigation();
  const currentUserUid = firebase_auth.currentUser?.uid;
  console.log("userPosts: ", userPosts);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = collection(firebase_firestore, 'users');
        const q = query(userRef, where('uid', '==', userId));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          setUserData(doc.data());
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      setDataLoading(true);
      try {
        const postRef = collection(firebase_firestore, 'posts');
        const q = query(postRef, where('user', '==', userId));
        const querySnapshot = await getDocs(q);
        const postsData = [];

        querySnapshot.forEach((doc) => {
          postsData.push(doc.data());
        });

        setUserPosts(postsData);
        setDataLoading(false);
      } catch (error) {
        setDataLoading(false);
        console.error('Error fetching user posts:', error);
      }
    };

    fetchUserPosts();
  }, [userId]);

  useEffect(() => {
    // Handle tracking follow status when the component mounts
    handleTrackFollow();
  }, []);

  const handleTrackFollow = async () => {
    setLoading(true);
    try {
      const followersRef = collection(firebase_firestore, 'followers');
      const q = query(followersRef, where('user', '==', userId), where('follower', '==', currentUserUid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.docs.length > 0) {
        setFollowing(true);
        setLoading(false);
      } else {
        setFollowing(false);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error while querying Firestore:', error);
    }
  };

  const handleFollowToggle = async () => {
    setProcessing(true);
    if (following) {
      // If the user is already following, show an alert to confirm unfollowing
      Alert.alert(
        'Unfollow Confirmation',
        'Are you sure you want to unfollow this user?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {
              setProcessing(false);
            }
          },
          {
            text: 'Unfollow',
            onPress: async () => {
              // User confirmed unfollow, proceed with the unfollow logic
              try {
                const followersRef = collection(firebase_firestore, 'followers');
                const q = query(followersRef, where('user', '==', userId), where('follower', '==', currentUserUid));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.docs.length > 0) {
                  // User is already following, unfollow
                  const followDoc = querySnapshot.docs[0];
                  await deleteDoc(followDoc.ref);
                  setFollowing(false);
                  setProcessing(false);
                  console.log('Unfollowed.');
                }
              } catch (error) {
                console.error('Error while querying Firestore:', error);
              }
            },
          },
        ]
      );
    } else {
      // If the user is not following, follow immediately without confirmation
      try {
        const followersRef = collection(firebase_firestore, 'followers');
        const followData = {
          user: userId,
          follower: currentUserUid,
          following: true,
        };
        await addDoc(followersRef, followData);
        setFollowing(true);
        setProcessing(false);
        console.log('Followed.');
      } catch (error) {
        setProcessing(false);
        console.error('Error while following:', error);
      }
    }
  };

  const handleEditProfile = () => {
    // You can navigate to the edit profile screen here
    navigation.navigate('EditProfile');
  };

  const handleShareProfile = () => {
    // Handle profile sharing here
  };

  const handleContact = () => {
    // Handle contact action here
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: userData?.profileImage || 'https://2.bp.blogspot.com/-UpC5KUoUGM0/V7InSApZquI/AAAAAAAAAOA/7GwJUqTplMM7JdY6nCAnvXIi8BD6NnjPQCK4B/s1600/albert_einstein_by_zuzahin-d5pcbug.jpg' }}
          style={styles.profileImage}
        />
        <Text style={styles.username}>{userData?.displayname || <ActivityIndicator size="small" color="#991b1b" />}</Text>
        <Text style={styles.bio}>{userData?.bio || 'No Bio ...'}</Text>
      </View>

      {loading ? <ActivityIndicator size="small" color="#991b1b" /> :
        <View style={styles.stats}>
          {processing ? <ActivityIndicator size="small" color="#991b1b" />
            :
            <Button mode="contained" buttonColor={following ? "#1f2937" : "#FF0000"} style={styles.statsItem} onPress={handleFollowToggle}>
              {following ? 'Unfollow' : 'Follow'}
            </Button>
          }
          <Button mode="contained" buttonColor="#4b5563" style={styles.statsItem} onPress={handleContact}>
            Message
          </Button>
        </View>
      }
      {dataLoading ?
        <ActivityIndicator size="small" color="#991b1b" />
        :
        <View style={styles.posts}>
          {userPosts && userPosts.map((post, index) => (
            <UserPostCard
              key={index}
              image_uri={post.imageURL}
            />
          ))}
        </View>
      }
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
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
    textAlign: 'center',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
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

export default UserProfileScreen;
