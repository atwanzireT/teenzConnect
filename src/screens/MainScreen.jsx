import React, { useState } from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatScreen from "./ChatScreen";
import HomeScreen from "./HomeScreen";
import PostScreen from "./PostScreen";
import { StyleSheet } from "react-native";
import SearchScreen from "./SearchScreen";

const Tab = createBottomTabNavigator();

export default function MainScreen() {

    return (
        <Tab.Navigator>
           <Tab.Screen name="Home" component={HomeScreen} options={{headerShown:false}} />
            <Tab.Screen name="Post" component={PostScreen} options={{headerShown:false}}/>
            <Tab.Screen name="Search" component={SearchScreen} options={{headerShown:false}}/>
            <Tab.Screen name="Chats" component={ChatScreen} options={{headerShown:false}}/>
        </Tab.Navigator>
    )
}