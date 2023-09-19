import React, { useState } from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatScreen from "./ChatScreen";
import HomeScreen from "./HomeScreen";

const Tab = createBottomTabNavigator();

export default function MainScreen() {

    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen} options={{headerShown:false}} />
            <Tab.Screen name="Chats" component={ChatScreen} options={{headerShown:false}}/>
        </Tab.Navigator>
    )
}