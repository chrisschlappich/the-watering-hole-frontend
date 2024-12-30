import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView, Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';


// Placeholder screens
function FeedScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Feed Screen</Text>
    </SafeAreaView>
  );
}

function DiscoverScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Discover Screen</Text>
    </SafeAreaView>
  );
}

function CheckInScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Check-In Screen</Text>
    </SafeAreaView>
  );
}

function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Profile Screen</Text>
    </SafeAreaView>
  );
}

// Custom header component
function CustomHeader({ navigation }: { navigation: any }) {
  return (
    <View style={styles.header}>
      <Image
        source={require('./assets/last_call_logo.png')} 
        style={styles.logo}
      />
    </View>
  );
}

// Tab Navigator
const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ navigation }) => ({
          header: () => <CustomHeader navigation={navigation} />, // Add the custom header
        })}>
        <Tab.Screen name="Feed" component={FeedScreen} />
        <Tab.Screen name="Discover" component={DiscoverScreen} />
        <Tab.Screen name="Check-In" component={CheckInScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  logo: {
    width: 190,
    height: 55,
    resizeMode: 'contain',
  },
  profileButton: {
    padding: 5,
  }
});

export default App;
