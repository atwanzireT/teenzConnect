import { StyleSheet, View } from "react-native";
import { Avatar, Button, Card, Text } from 'react-native-paper';
import customstyles from "../values/styles";

const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

export default function SearchCard() {
    return (
        <Card style={customstyles.my_10}>
            <Card.Content>
                <Text style={styles.cardtitle}>HipTeenz in Western Uganda</Text>
                <Text style={styles.fontstyle}>Kats</Text>
                <Text>2,966 posts</Text>
            </Card.Content>
        </Card>
    )
}

const styles = StyleSheet.create({
    cardtitle: {
        fontSize:18,
    },
    fontstyle: {
        fontWeight:"800",
    }
})