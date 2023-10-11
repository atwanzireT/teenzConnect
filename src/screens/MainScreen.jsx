import React, { useState } from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ChatScreen from "./ChatScreen";
import HomeScreen from "./HomeScreen";
import PostScreen from "./PostScreen";
import { StyleSheet } from "react-native";
import SearchScreen from "./SearchScreen";
import TopTabs from "./TopTab";

const Tab = createBottomTabNavigator();


export default function MainScreen() {

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: "#991b1b",
            }}>
            <Tab.Screen name="YConnect" component={TopTabs}
                options={{
                    tabBarLabel:"Home",
                    title:"YConnect",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="home" color={color} size={size} />
                    ),
                }} />
            <Tab.Screen name="Post" component={PostScreen} 
            options={{ 
                headerShown: false, 
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="note" color={color} size={size} />
                ),}} />
            <Tab.Screen name="Discover" component={SearchScreen} 
            options={{ 
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="map-search" color={color} size={size} />
                ),}} />
            {/* <Tab.Screen name="Chats" component={ChatScreen} 
            options={{ 
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons name="comment" color={color} size={size} />
                ), }} /> */}
        </Tab.Navigator>
    )
}