import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, ActivityIndicator } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { ref as dbref, equalTo, onValue, orderByChild, query } from "firebase/database";
import { firebase_database } from "../config/firebaseConfig";
import customstyles from "../values/styles";
import SearchCard from "../ui_components/searchCard";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function SearchScreen() {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // setError(null);

    if (searchText) {
      setIsLoading(true);
      const searchRef = dbref(firebase_database, 'posts');

      const searchQuery = query(
        searchRef,
        orderByChild("text"),
        equalTo(searchText.toLowerCase())
      );

      onValue(searchQuery, (snapshot) => {
        const data = snapshot.val() || {};
        setIsLoading(false);
        setSearchResults(Object.values(data));
        console.log(searchResults);
      });
    } else {
      setSearchResults([]);
    }
  }, [searchText]);


  return (
    <SafeAreaProvider style={[customstyles.mt_20, customstyles.mh_10, styles.container]}>
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
          {isLoading && <ActivityIndicator size="large" color="#991b1b" />}
          {searchResults.map((result, index) => (
            // <SearchCard key={index} data={result} />
            <Text>{result.text}</Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    // justifyContent:"flex-start"
  },
  fontText: {
    fontSize: 24,
    marginVertical: 10,
  },
});
