import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignupScreen from './src/components/SignupScreen';
import SignInScreen from './src/components/SignInScreen';
import HomeScreen from './src/components/HomeScreen';
import IshiharaQuizScreen from './src/components/IshiharaQuizScreen';
import FarnsworthTestScreen from './src/components/FarnsworthTestScreen';
import EditProfileScreen from './src/components/EditProfileScreen';
import InfoScreen from './src/components/InfoScreen';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignUp" component={SignupScreen} options={{ title: 'Sign Up' }} />
        <Stack.Screen name="SignIn" component={SignInScreen} options={{ title: 'Sign In' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Welcome' }} />
        <Stack.Screen name="IshiharaQuiz" component={IshiharaQuizScreen} options={{ title: 'Ishihara Test' }} />
        <Stack.Screen name="FarnsworthTest" component={FarnsworthTestScreen} options={{ title: 'Farnsworth Test' }} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
        <Stack.Screen name="InfoScreen" component={InfoScreen} options={{ title: 'Learn About Color Blindness' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
