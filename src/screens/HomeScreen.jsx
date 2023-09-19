import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import PostCard from "../ui_components/postcard";

export default function HomeScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topbar}>
                <Text style={styles.title}>TeenzConnect</Text>
                <View style={styles.profile}>
                    <Ionicons name="person-circle" size={32} marginRight={10} color="black" />
                    <Ionicons name="settings" size={32} color="black" />
                </View>
            </View>
            <ScrollView>
                <PostCard />
                <PostCard />
                <PostCard />
                <PostCard />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:{
       
    },
    topbar: {
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 10,
    },
    title: {
        fontSize: 24,
    },
    profile: {
        flexDirection: "row",
        alignItems: "center",
    },
    profileText: {
        fontSize: 18,
        marginRight: 8,
    },
});
