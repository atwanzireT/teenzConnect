import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import COLORS from "../values/COLORS";
import customstyles from "../values/styles";
import { useNavigation } from "@react-navigation/native";
import { firebase_database, firebase_firestore } from "../config/firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

export default function PostCard(props) {
  const { id, userid, username, postTitle, profileImageSource, postImageSource, likes } = props;
  const [liked, setLiked] = useState(false);

  const navigation = useNavigation();

  const handlePickPost = () => {
    navigation.navigate("Comments", { postId: id }); // Corrected the navigation parameter
  };

  const handlePickUser = () => {
    navigation.navigate("UserProfile", { userId: userid }); // Corrected the navigation parameter
  };

  const countLikes = async () => {
    const likeRef = collection(firebase_firestore, "likes");
    const q = query(likeRef, where("user", "==", userid), where("post", "==", id));

    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.docs.length > 0) {
        // Like exists, setLiked to true
        setLiked(true);
      } else {
        setLiked(false);
      }
    } catch (error) {
      console.error("Error while querying Firestore:", error);
    }
  };

  const handleLike = async () => {
    const likeRef = collection(firebase_firestore, "likes");
    const q = query(likeRef, where("user", "==", userid), where("post", "==", id));

    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.docs.length > 0) {
        // Like exists, delete it
        const likeDoc = querySnapshot.docs[0];
        await deleteDoc(likeDoc.ref);
        setLiked(false);
        console.log("Like deleted ...");
      } else {
        // Like doesn't exist, add it
        const likeData = {
          user: userid,
          post: id,
          liked: true,
        };
        await addDoc(likeRef, likeData);
        setLiked(true);
        console.log("Post liked ...");
      }
    } catch (error) {
      console.error("Error while querying Firestore:", error);
    }
  };

  useEffect(() => {
    countLikes();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePickUser} style={styles.userInfo}>
        <Image
          style={styles.profileImage}
          source={{ uri: profileImageSource }}
        />
        <View style={styles.userInfoText}>
          <Text style={styles.textBold800}>{username}</Text>
          <Text>{postTitle}</Text>
        </View>
      </TouchableOpacity>
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
              color={liked ? "#991b1b" : "black"}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePickPost}>
          <Ionicons
            name="chatbubble-outline"
            style={customstyles.ml_10}
            size={30}
            color={"#000"}
          />
        </TouchableOpacity>
        <Ionicons name="share-outline" size={30} style={customstyles.ml_10} color={"#000"} />
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
