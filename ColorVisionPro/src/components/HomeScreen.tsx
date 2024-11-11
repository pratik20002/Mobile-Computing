import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, FlatList, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons'; // Ensure this package is installed

const HomeScreen = ({ route, navigation }: any) => {
  const { userName } = route.params;
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const tests = [
    { id: '1', name: 'Ishihara Test' },
    { id: '2', name: 'Color Arrangement Test' },
    { id: '3', name: 'Cambridge Color Test' },
    { id: '4', name: 'RGB Anomaloscope Test' },
  ];

  useEffect(() => {
    const loadUserPreferences = async () => {
      const userContrastPreference = await AsyncStorage.getItem(`${userName}_contrast`);
      const userThemePreference = await AsyncStorage.getItem(`${userName}_theme`);

      setIsHighContrast(userContrastPreference === 'high');
      setIsDarkMode(userThemePreference === 'dark');
    };
    loadUserPreferences();
  }, []);

  const toggleContrast = async () => {
    const newContrastMode = !isHighContrast;
    setIsHighContrast(newContrastMode);
    await AsyncStorage.setItem(`${userName}_contrast`, newContrastMode ? 'high' : 'low');
  };

  const toggleDarkMode = async () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    await AsyncStorage.setItem(`${userName}_theme`, newDarkMode ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('loggedInUser');
    navigation.navigate('SignIn');
  };

  const renderTile = ({ item }: { item: { id: string; name: string } }) => (
    <TouchableOpacity
      style={[styles.tile, isDarkMode ? styles.darkTile : styles.lightTile]}
      onPress={() => {
        if (item.name === 'Ishihara Test') {
          navigation.navigate('IshiharaQuiz');
        }
      }}
    >
      <Text style={[styles.tileText, isDarkMode ? styles.lightText : styles.darkText]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDarkMode ? styles.darkBackground : styles.lightBackground]}>
      <View style={styles.header}>
        <Text style={[styles.welcomeText, isDarkMode ? styles.lightText : styles.darkText]}>
          Welcome, {userName}!
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile', { userName })}>
            <Text style={[styles.profileIcon, isDarkMode ? styles.lightText : styles.darkText]}>
              👤
            </Text>
          </TouchableOpacity>
      </View>

      <FlatList
        data={tests}
        renderItem={renderTile}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.tilesContainer}
      />

      <View style={styles.toggleContainer}>
        <Text style={[styles.toggleLabel, isDarkMode ? styles.lightText : styles.darkText]}>
          Dark Mode
        </Text>
        <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
      </View>

      <TouchableOpacity onPress={toggleContrast}>
        <Text style={[styles.contrastButton, isDarkMode ? styles.lightText : styles.darkText]}>
          {isHighContrast ? 'Switch to Low Contrast' : 'Switch to High Contrast'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  welcomeText: { fontSize: 24, fontWeight: '600' },
  profileIcon: { fontSize: 28 },

  tilesContainer: { alignItems: 'center', marginVertical: 16 },
  tile: {
    width: 150,
    height: 120,
    borderRadius: 10,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  darkTile: { backgroundColor: '#333', borderWidth: 1, borderColor: '#555' },
  lightTile: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E0E0E0' },
  tileText: { fontSize: 16, fontWeight: 'bold', textAlign: 'center' },

  toggleContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 20, alignSelf: 'center' },
  toggleLabel: { fontSize: 18, marginRight: 8 },
  contrastButton: { marginTop: 16, fontSize: 18, textAlign: 'center' },

  // Dark and Light Mode Backgrounds
  lightBackground: { backgroundColor: '#F9F9F9' },
  darkBackground: { backgroundColor: '#121212' },

  // Text Colors for Light and Dark Modes
  lightText: { color: '#FFFFFF' },
  darkText: { color: '#121212' },

  // Logout Button
  logoutButton: {
    backgroundColor: '#FF6B6B',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
  },
  logoutButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});

export default HomeScreen;