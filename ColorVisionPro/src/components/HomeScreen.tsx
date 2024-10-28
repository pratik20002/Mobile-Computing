import React, { useEffect, useState } from 'react';
import { View, Text, Image, Button, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ route, navigation }: any) => {
  const { userName } = route.params;
  const [isHighContrast, setIsHighContrast] = useState(false);

  // Load the saved contrast preference for the user
  useEffect(() => {
    const loadUserPreferences = async () => {
      const userContrastPreference = await AsyncStorage.getItem(`${userName}_contrast`);
      if (userContrastPreference) {
        setIsHighContrast(userContrastPreference === 'high');
      }
    };
    loadUserPreferences();
  }, []);

  // Toggle contrast between high and low
  const toggleContrast = async () => {
    const newContrastMode = !isHighContrast;
    setIsHighContrast(newContrastMode);
    await AsyncStorage.setItem(`${userName}_contrast`, newContrastMode ? 'high' : 'low');
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('loggedInUser'); // Clear logged in user data
    navigation.navigate('SignIn'); // Navigate to the SignInScreen
  };

  return (
    <View style={[styles.container, isHighContrast ? styles.highContrast : styles.lowContrast]}>
      <Text style={styles.welcomeText}>Welcome, {userName}!</Text>
      <Image source={require('../../assets/Sample.jpg')} style={styles.image} />

      {/* Button to toggle contrast mode */}
      <TouchableOpacity onPress={toggleContrast}>
        <Text style={styles.contrastButton}>
          {isHighContrast ? 'Switch to Low Contrast' : 'Switch to High Contrast'}
        </Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  welcomeText: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  image: { width: 200, height: 200 },
  contrastButton: { marginTop: 20, fontSize: 18, color: 'blue' },

  // High contrast style
  highContrast: { backgroundColor: 'black', color: 'white' },

  // Low contrast style
  lowContrast: { backgroundColor: 'white', color: 'black' },
});

export default HomeScreen;
