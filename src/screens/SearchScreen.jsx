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
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsFetching(true);
        const postCollection = collection(firebase_firestore, 'posts');
        const querySnapshot = await getDocs(postCollection);
        const posts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSearchResults(posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        // Display user-friendly error message
        // You can set an error state here if needed
      } finally {
        setIsFetching(false);
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredResults = searchResults.filter((result) =>
    result.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <SafeAreaView style={[customstyles.mt_20, customstyles.mh_10, styles.container]}>
      <ScrollView>
        <View>
          <TextInput
            label="Search"
            mode="outlined"
            outlineColor="#991b1b"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
            left={<TextInput.Icon icon="search-web" />}
          />
          <Text style={[customstyles.textbold_800, styles.fontText]}>HipTeenz For You.</Text>
          {isFetching ? (
            <ActivityIndicator size="large" color="#991b1b" />
          ) : (
            filteredResults.length > 0 ? (
              filteredResults.map((result, index) => (
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
            ) : (
              <Text>No results found.</Text>
            )
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
