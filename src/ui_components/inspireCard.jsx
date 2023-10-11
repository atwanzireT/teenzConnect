import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import COLORS from "../values/COLORS";
import customstyles from "../values/styles";
import { useNavigation } from "@react-navigation/native";
import { ref as dbref, set, onValue, getDatabase, update, remove } from "firebase/database";
import { firebase_database } from "../config/firebaseConfig";

const cardWidth = "48%"; // Adjust the width to your preference
const cardMargin = "1%"; // Adjust the margin to create spacing between the cards

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    width: cardWidth,
    margin: cardMargin, // Add margin to create spacing between cards
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userInfoText: {
    flex: 1,
  },
  textBold800: {
    fontWeight: "800",
  },
  postImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 9 / 9,
  },
  actions: {
    flexDirection: "row",
    marginVertical: 5,
  },
  txtbtn: {
    color: "#fff",
    backgroundColor: COLORS.red_800,
    margin: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
});

export default function InspireCard(props) {
  const { id, userid, postImageSource, likes } = props;
  const [liked, setLiked] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const likeRef = dbref(firebase_database, `posts/${id}/likes/${userid}`);

    // Check if the user has already liked the post
    onValue(likeRef, (snapshot) => {
      setLiked(snapshot.exists());
    });
  }, [id, userid]);

  const handlePickPost = () => {
    navigation.navigate("Comments", { id });
  }

  const handleLike = () => {
    const likeRef = dbref(firebase_database, `posts/${id}/likes/${userid}`);

    onValue(likeRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        // User has not liked the post, so like it
        set(likeRef, true);
        setLiked(true);
      } else {
        // User has already liked the post, so unlike it
        remove(likeRef);
        setLiked(false);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.postImage}
        source={{ uri: postImageSource }}
      />
      <View style={styles.actions}>
        <Text style={{ marginLeft: 5 }}>{likes}</Text>
        <TouchableOpacity onPress={handleLike}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Button mode="contained" buttonColor={COLORS.red_800} textColor="#fff">SAVE</Button>
          </View>
        </TouchableOpacity>
        <TouchableOpacity >
          <Ionicons name="share" size={30} style={customstyles.ml_10} color={"#000"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
