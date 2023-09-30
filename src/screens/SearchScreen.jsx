import { ScrollView, StyleSheet, View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import customstyles from "../values/styles";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SearchCard from "../ui_components/searchCard";

export default function SearchScreen() {
    return (
        <SafeAreaProvider style={[customstyles.mt_20, customstyles.mh_10, styles.container]}>
            <ScrollView>
                <View>
                    <TextInput
                        label="Search"
                        mode="outlined"
                        outlineColor='#991b1b'
                        left={<TextInput.Icon icon="search-web" />}
                    />
                    <Text style={[customstyles.textbold_800, styles.fontText]}>HipTeenz For You.</Text>
                    <SearchCard />
                    <SearchCard />
                    <SearchCard />
                    <SearchCard />
                    <SearchCard />
                </View>
            </ScrollView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        // justifyContent:"flex-start"
    },
    fontText: {
        fontSize: 24,
        marginVertical: 10
    },
})