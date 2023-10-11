import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import COLORS from "../values/COLORS";
import customstyles from "../values/styles";
import { useNavigation } from "@react-navigation/native";
import { ref as dbref, set, onValue, getDatabase, update, remove } from "firebase/database";
import { firebase_database } from "../config/firebaseConfig";

export default function PostCard(props) {
  const { id, userid, username, postTitle, profileImageSource, postImageSource, likes } = props;
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
      <View style={styles.userInfo}>
        <Image
          style={styles.profileImage}
          source={{ uri: profileImageSource }}
        />
        <View style={styles.userInfoText}>
          <Text style={styles.textBold800}>{username}</Text>
          <Text>{postTitle}</Text>
        </View>
      </View>
      <Image
        style={styles.postImage}
        source={{ uri: postImageSource }}
      />
      <View style={styles.actions}>
        <Text style={{ marginLeft: 5 }}>{likes}</Text>
        <TouchableOpacity onPress={handleLike}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={32}
              color={liked ? "red" : "black"}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePickPost}>
          <Ionicons name="chatbubble" style={customstyles.ml_10} size={30} color={"#000"} />
        </TouchableOpacity>
        <Ionicons name="share" size={30} style={customstyles.ml_10} color={"#000"} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
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
