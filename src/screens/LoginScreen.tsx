import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation, setIsLoggedIn }: { navigation: any, setIsLoggedIn: any }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.244:8080/TheWateringHoleBackend/routes/users/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('session_token', data.session_token); // Save session token
        setIsLoggedIn(true);
      } else {
        Alert.alert('Error', data.error || 'Invalid email or password.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Unable to connect to the server.');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/last_call_logo.png')}
        style={styles.logo}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#7983C2',
    padding: 10,
    borderRadius: 8,
    width: '35%',
    marginTop: 50,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    color: '#7983C2',
  },
  logo: {
    width: 300, 
    height: 100, 
    resizeMode: 'contain', 
    marginBottom: 50
  },  
});
