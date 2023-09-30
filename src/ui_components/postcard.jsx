import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import COLORS from "../values/COLORS";
import customstyles from "../values/styles";

export default function PostCard(props) {
  const { username, postTitle, profileImageSource, postImageSource} = props;
  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Image
          style={styles.profileImage}
          source={{uri: profileImageSource}}
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
          <Ionicons name="heart" style={customstyles.ml_10} size={30} color={"#000"} />
          <Ionicons name="chatbubble" style={customstyles.ml_10} size={30} color={"#000"} />
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
