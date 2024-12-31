import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, Text, View, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

// Placeholder Feed Screen
function FeedScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Feed Screen</Text>
    </SafeAreaView>
  );
}

// Placeholder Discover Screen
function DiscoverScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Discover Screen</Text>
    </SafeAreaView>
  );
}

// Placeholder Check-In Screen
function CheckInScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Check-In Screen</Text>
    </SafeAreaView>
  );
}

// Profile Screen
function ProfileScreen({ setIsLoggedIn }: { setIsLoggedIn: any }) {
  const handleLogout = async () => {
    try {
      const sessionToken = await AsyncStorage.getItem('session_token');
      if (!sessionToken) return;

      const response = await fetch('http://192.168.1.244:8080/TheWateringHoleBackend/routes/users/logout.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_token: sessionToken }),
      });

      if (response.ok) {
        await AsyncStorage.removeItem('session_token'); // Remove session token
        setIsLoggedIn(false); // Redirect to login
      } else {
        Alert.alert('Failed to log out. Please try again.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Unable to connect to the server.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>Profile Screen</Text>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Custom Header Component
function CustomHeader() {
  return (
    <View style={styles.header}>
      <Image source={require('./assets/last_call_logo.png')} style={styles.logo} />
    </View>
  );
}

// Tab Navigator
const Tab = createBottomTabNavigator();
function MainTabs({ setIsLoggedIn }: { setIsLoggedIn: any }) {
  return (
    <Tab.Navigator
      screenOptions={{
        header: () => <CustomHeader />,
        tabBarStyle: {
          backgroundColor: '#f8f9fa',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 5,
        },
      }}
    >
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Check-In" component={CheckInScreen} />
      <Tab.Screen name="Profile">
        {() => <ProfileScreen setIsLoggedIn={setIsLoggedIn} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// Stack Navigator
const Stack = createStackNavigator();

// Main App Component
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Handle loading state

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionToken = await AsyncStorage.getItem('session_token');
        if (sessionToken) {
          const response = await fetch('http://192.168.1.244:8080/TheWateringHoleBackend/routes/users/validate-session.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_token: sessionToken }),
          });

          const data = await response.json();
          if (response.ok && data.valid) {
            setIsLoggedIn(true);
          } else {
            await AsyncStorage.removeItem('session_token'); // Clear invalid token
          }
        }
      } catch (error) {
        console.error('Error validating session:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    checkSession();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#7983C2" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="Login">
              {props => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
            </Stack.Screen>
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <Stack.Screen name="MainTabs">
            {() => <MainTabs setIsLoggedIn={setIsLoggedIn} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  logo: {
    width: 190,
    height: 55,
    resizeMode: 'contain',
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#7983C2',
    padding: 10,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
