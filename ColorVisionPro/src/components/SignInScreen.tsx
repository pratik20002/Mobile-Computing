import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignInScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Check if a user is already logged in
  useEffect(() => {
    const checkUserSession = async () => {
      const loggedInUser = await AsyncStorage.getItem('loggedInUser');
      if (loggedInUser) {
        const userData = await AsyncStorage.getItem(loggedInUser);
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          navigation.navigate('Home', { userName: parsedUserData.fullName });
        }
      }
    };

    checkUserSession();
  }, []);

  // Handle Sign In
  const handleSignIn = async () => {
    const storedUser = await AsyncStorage.getItem(email);
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.password === password) {
        await AsyncStorage.setItem('loggedInUser', email); // Save logged-in user
        navigation.navigate('Home', { userName: userData.fullName });
      } else {
        alert('Invalid Password');
      }
    } else {
      alert('User not found');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <Button title="Sign In" onPress={handleSignIn} />
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.link}>New user? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  input: { borderBottomWidth: 1, marginBottom: 16, padding: 8 },
  link: { marginTop: 16, color: 'blue', textAlign: 'center' },
});

export default SignInScreen;
