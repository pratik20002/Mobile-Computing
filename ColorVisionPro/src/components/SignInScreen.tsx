import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

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
        Alert.alert('Error', 'Invalid Password');
      }
    } else {
      Alert.alert('Error', 'User not found');
    }
  };

  return (
    <LinearGradient
      colors={['#4facfe', '#00f2fe']}
      style={styles.gradientBackground}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <LinearGradient
            colors={['#FF512F', '#F09819']}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.linkText}>New user? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  input: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  button: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 15,
  },
  buttonGradient: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  linkText: {
    fontSize: 14,
    color: '#fff',
    marginTop: 10,
    textDecorationLine: 'underline',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default SignInScreen;
