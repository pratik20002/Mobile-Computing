import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Switch,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ route, navigation }: any) => {
  const { userName } = route.params;
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  // Facts about color blindness
  const facts = [
    "1 in 12 men and 1 in 200 women are color blind.",
    "The most common form of color blindness is red-green.",
    "Color blindness is often hereditary.",
    "EnChroma glasses can help some people with color blindness.",
    "Blue-yellow color blindness is rarer than red-green.",
    "Color blindness does not mean seeing the world in black and white.",
    "Color blindness can sometimes be caused by eye diseases like glaucoma.",
    "Women are usually carriers of the color blindness gene but are rarely color blind themselves.",
    "The Ishihara Test is the most widely used test for detecting color blindness.",
    "There are three main types of color blindness: red-green, blue-yellow, and total color blindness.",
    "People with color blindness may excel at seeing patterns and camouflages.",
    "Dogs and cats are also partially color blind, unable to see reds and greens distinctly.",
    "Many color blind individuals use apps and technology to distinguish colors.",
    "Color blindness is not a disability but a difference in color perception.",
    "Some professions like pilots and electricians require normal color vision.",
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

  // Change fact every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prevIndex) => (prevIndex + 1) % facts.length);
    }, 8000);
    return () => clearInterval(interval);
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

  const renderTile = ({ item }: { item: { id: string; name: string; screen: string } }) => (
    <TouchableOpacity
      style={styles.tileContainer}
      onPress={() => navigation.navigate(item.screen)}
    >
      <LinearGradient
        colors={
          isHighContrast
            ? ['#FFDD00', '#FF8800']
            : ['#6A11CB', '#2575FC'] // Updated gradient color
        }
        style={[styles.tile, isDarkMode ? styles.darkTile : styles.lightTile]}
      >
        <Text style={[styles.tileText, isDarkMode ? styles.lightText : styles.darkText]}>
          {item.name}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={isDarkMode ? require('../../assets/dark_bg.jpg') : require('../../assets/light_bg.jpg')}
      style={styles.background}
    >
      <View style={[styles.container]}>
        <View style={styles.header}>
          <Text style={[styles.welcomeText, isDarkMode ? styles.lightText : styles.darkText]}>
            Welcome, {userName}!
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile', { userName })}>
            <Text style={[styles.profileIcon, isDarkMode ? styles.lightText : styles.darkText]}>👤</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={[
            { id: '1', name: 'Ishihara Test', screen: 'IshiharaQuiz' },
            { id: '2', name: 'Farnsworth Test', screen: 'FarnsworthTest' },
            { id: '3', name: 'Learn About Color Blindness', screen: 'InfoScreen' },
          ]}
          renderItem={renderTile}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.tilesContainer}
        />

        {/* Fact Box */}
        <Text style={[styles.factHeading, isDarkMode ? styles.lightText : styles.darkText]}>
          Did you know??
        </Text>
        <View
          style={[
            styles.factBox,
            {
              backgroundColor: isDarkMode ? '#333333' : '#F0F0F0', // Adjust based on mode
            },
          ]}
        >
          <Text
            style={[
              styles.factText,
              { color: isDarkMode ? '#FFFFFF' : '#333333' }, // Adjust text color
            ]}
          >
            {facts[currentFactIndex]}
          </Text>
        </View>

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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover' },
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  welcomeText: { fontSize: 24, fontWeight: '600' },
  profileIcon: { fontSize: 28 },

  tilesContainer: { alignItems: 'center', marginVertical: 16 },
  tileContainer: {
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  tile: {
    width: 160,
    height: 140,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  darkTile: { borderWidth: 1, borderColor: '#555' },
  lightTile: { borderWidth: 1, borderColor: '#E0E0E0' },
  tileText: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },

  factHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  factBox: {
    marginVertical: 20,
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  factText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  toggleContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 20, alignSelf: 'center' },
  toggleLabel: { fontSize: 18, marginRight: 8 },
  contrastButton: { marginTop: 16, fontSize: 18, textAlign: 'center' },

  lightText: { color: '#FFFFFF' },
  darkText: { color: '#121212' },

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
