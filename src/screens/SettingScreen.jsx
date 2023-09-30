import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../values/COLORS';
import { Switch } from 'react-native-paper';
import { signOut } from 'firebase/auth';
import { firebase_auth } from '../config/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen({navigation}) {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const togglePushNotifications = () => {
    setPushNotifications(!pushNotifications);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = async () => {
    try {
      await signOut(firebase_auth);
      await AsyncStorage.removeItem('uid', null);
      await AsyncStorage.removeItem('email', null);
      await AsyncStorage.removeItem('password', null);

      await AsyncStorage.getItem('uid');
      await AsyncStorage.getItem('email');
      await AsyncStorage.getItem('password');
      navigation.navigate("MainScreen");
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>General</Text>
        <View style={styles.option}>
          <Text style={styles.optionText}>Push Notifications</Text>
          <Switch
            value={pushNotifications}
            onValueChange={togglePushNotifications}
            color={COLORS.red_800}
          />
        </View>
        <View style={styles.option}>
          <Text style={styles.optionText}>Dark Mode</Text>
          <Switch
            value={darkMode}
            color={COLORS.red_800}
            onValueChange={toggleDarkMode}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Account</Text>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Follow and invite friends</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Edit Profile</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Change Password</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Privacy</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Ads</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#888" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Support</Text>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Orders and payments</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Help Center</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Report a Problem</Text>
          <Ionicons name="chevron-forward-outline" size={24} color="#888" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: COLORS.red_800 }]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 30,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
  },
});
