import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const EditProfileScreen = ({ route, navigation }: any) => {
  const { userName } = route.params;
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await AsyncStorage.getItem(userName);
      if (userData) {
        const parsedData = JSON.parse(userData);
        setAge(parsedData.age || '');
        setGender(parsedData.gender || '');
        setPassword(parsedData.password || '');
      }
    };
    loadUserData();
  }, []);

  const handleSave = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }

    const updatedData = {
      age,
      gender,
      password,
    };

    await AsyncStorage.mergeItem(userName, JSON.stringify(updatedData));
    Alert.alert('Success', 'Profile updated successfully!');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Gender</Text>
      <Picker
        selectedValue={gender}
        style={styles.input}
        onValueChange={(itemValue) => setGender(itemValue)}
      >
        <Picker.Item label="Select Gender" value="" />
        <Picker.Item label="Male" value="Male" />
        <Picker.Item label="Female" value="Female" />
        <Picker.Item label="Other" value="Other" />
      </Picker>

      <Text style={styles.label}>New Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Button title="Save Changes" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontSize: 16, marginBottom: 8, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
    borderRadius: 5,
  },
});

export default EditProfileScreen;
