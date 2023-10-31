import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PostScreen from "./PostScreen";
import SearchScreen from "./SearchScreen";
import HomeScreen from "./HomeScreen";
import ChatListScreen from "./ChatListScreen";

const Tab = createBottomTabNavigator();

export default function MainScreen() {

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: "#991b1b",
            }}>
            <Tab.Screen name="Home" component={HomeScreen}
                options={{
                    tabBarLabel: "Home",
                    tabBarShowLabel: false,
                    headerShown:false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home" color={color} size={size} />
                    ),
                }} />
            <Tab.Screen name="Post" component={PostScreen}
                options={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="pencil-box" color={color} size={size} />
                    ),
                }} />
            <Tab.Screen name="Discover" component={SearchScreen}
                options={{
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="map-search" color={color} size={size} />
                    ),
                }} />
            <Tab.Screen name="Chats" component={ChatListScreen}
                options={{
                    headerShown: true,
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="send-circle" color={color} size={size} />
                    ),
                }} />
        </Tab.Navigator>
    )
}