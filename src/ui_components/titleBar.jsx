import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons"; // Assuming you have AntDesign icons installed

export default function TitleBar({ title, onBackPress }) {
  return (
    <View style={styles.titleBar}>
      <TouchableOpacity onPress={onBackPress}>
        <AntDesign name="arrowleft" size={24} color="white" style={styles.backIcon} />
      </TouchableOpacity>
      <Text style={styles.titleText}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  titleBar: {
    backgroundColor: "blue",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  backIcon: {
    marginRight: 10,
  },
  titleText: {
    color: "white",
    fontSize: 20,
  },
});
