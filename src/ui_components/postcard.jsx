import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import COLORS from "../values/COLORS";
import customstyles from "../values/styles";
import { useNavigation } from "@react-navigation/native";
import { ref as dbref, update, getDatabase, set, push, onValue } from "firebase/database";
import { firebase_database } from "../config/firebaseConfig";

export default function PostCard(props) {
  const { id, userid, username, postTitle, profileImageSource, postImageSource, Likes } = props;
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(false);


  const navigation = useNavigation();
  const handlePickPost = (id) => {
    navigation.navigate("Comments", { id })
  }

  const handleLike = () => {
    const data = {
      liked: !liked, // Toggle the liked state
      // Use a combination of author and postid as a composite key
      author_postid: `${userid}_${id}`,
    };

    const likeRef = dbref(firebase_database, `likes/${id}/${userid}`);

    // Try to set the like data, if it fails, it means the user has already liked the post
    update(likeRef, data)
      .then(() => {
        // Successfully liked or unliked the post
        setLiked(!liked); // Toggle the liked state in the component state
        // setLikes(liked ? likes - 1 : likes + 1);
      })
      .catch((error) => {
        // Handle the case where the user has already liked the post
        console.error("Error liking or unliking the post:", error);
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
        {/* <Button style={styles.followButton}>FOLLOW</Button> */}
        <TouchableOpacity>
          <Text style={styles.txtbtn}>Follow</Text>
        </TouchableOpacity>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={handleLike}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name={liked ? "heart" : "heart"}
                size={32}
                color={liked ? "red" : "black"}
              />
              <Text style={{ marginLeft: 5 }}>{Likes}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlePickPost(id)}>
            <Ionicons name="chatbubble" style={customstyles.ml_10} size={30} color={"#000"} />
          </TouchableOpacity>
          <Ionicons name="share" size={30} style={customstyles.ml_10} color={"#000"} />
        </View>
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
    justifyContent: "space-between",
    marginVertical: 5,
  },
  followButton: {
    flex: 1,
    marginRight: 5,
  },
  iconContainer: {
    flexDirection: "row",
  },
  txtbtn: {
    color: "#fff",
    backgroundColor: COLORS.red_800,
    margin: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  }
});
