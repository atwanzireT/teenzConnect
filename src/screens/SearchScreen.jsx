import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, ActivityIndicator, TouchableOpacity } from "react-native";
import { Text, TextInput, Card, Avatar, IconButton } from "react-native-paper";
import { query, ref as dbref, equalTo, onValue, orderByChild } from "firebase/database";
import { getDocs, collection } from "firebase/firestore";
import { firebase_database, firebase_firestore } from "../config/firebaseConfig";
import customstyles from "../values/styles";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchScreen({ navigation }) {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Initialize as true to show loading initially

  useEffect(() => {
    // Fetch posts from Firebase Firestore
    const fetchPosts = async () => {
      try {
        const postCollection = collection(firebase_firestore, 'posts');
        const querySnapshot = await getDocs(postCollection);
        const posts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSearchResults(posts);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <SafeAreaView style={[customstyles.mt_20, customstyles.mh_10, styles.container]}>
      <ScrollView>
        <View>
          <TextInput
            label="Search"
            mode="outlined"
            outlineColor="#991b1b"
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
            }}
            left={<TextInput.Icon icon="search-web" />}
          />
          <Text style={[customstyles.textbold_800, styles.fontText]}>HipTeenz For You.</Text>
          {isLoading ? (
            <ActivityIndicator size="large" color="#991b1b" />
          ) : (
            searchResults.map((result, index) => (
              <Card style={customstyles.my_5} key={index} onPress={() => navigation.navigate("PostDetailScreen", { "postId": result.postId })}>
                <Card.Title
                  title={result.title}
                  left={(props) => (
                    <Avatar.Image {...props} source={{ uri: result.imageURL }} />
                  )}
                  right={(props) => (
                    <View style={customstyles.grid}>
                      <IconButton icon="arrow-right-circle" onPress={() => navigation.navigate("PostDetailScreen", { "postId": result.postId })} />
                    </View>
                  )}
                />
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // Add your styles for the container if needed
  },
  fontText: {
    fontSize: 24,
    marginVertical: 10,
  },
});
