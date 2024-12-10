import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';

const InfoScreen = () => {
  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Learn About Color Blindness</Text>
      <Text style={styles.sectionTitle}>What is Color Blindness?</Text>
      <Text style={styles.text}>
        Color blindness, also known as color vision deficiency, is the inability to distinguish certain shades of color, commonly red and green. It affects millions of people worldwide.
      </Text>

      <Text style={styles.sectionTitle}>Types of Color Blindness</Text>
      <Text style={styles.text}>1. Red-Green Color Blindness</Text>
      <Text style={styles.text}>2. Blue-Yellow Color Blindness</Text>
      <Text style={styles.text}>3. Complete Color Blindness (Monochromacy)</Text>

      <Text style={styles.sectionTitle}>Resources for People with Color Blindness</Text>
      <TouchableOpacity onPress={() => openLink('https://enchroma.com/')}>
        <Text style={styles.link}>EnChroma Glasses</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => openLink('https://play.google.com/store/apps/details?id=com.colorblindpal.android')}>
        <Text style={styles.link}>Color Blind Pal App</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => openLink('https://colorblindawareness.org/')}>
        <Text style={styles.link}>Color Blind Awareness</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>For People Without Color Blindness</Text>
      <Text style={styles.text}>
        Understanding color blindness is important to support friends, family, and colleagues. You can use apps like "Color Blind Pal" to see how they perceive the world.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#4A90E2',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 22,
    color: '#555',
  },
  link: {
    fontSize: 16,
    color: '#4A90E2',
    marginBottom: 10,
    textDecorationLine: 'underline',
  },
});

export default InfoScreen;
