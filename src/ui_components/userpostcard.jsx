import React from "react";
import { Image, StyleSheet, View } from "react-native";

export default function UserPostCard({ image_uri }) {
    return (
        <View style = {{width:"33%"}}>
            <Image
                style={styles.postImage}
                source={{ uri: image_uri }}
                onError={(err) => console.log("Error loading post image: ", err)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    postImage: {
        width: '100%',
        aspectRatio: 1,
        marginVertical: 1,
    },
})
