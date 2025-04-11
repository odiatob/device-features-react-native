import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import HomeScreen from './screens/HomeScreen';
import AddEntryScreen from './screens/AddEntryScreen';
import { ThemeProvider } from './contexts/ThemeContext';
import { EntryProvider } from './contexts/EntryContext';

// Set up notifications handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Stack = createNativeStackNavigator();

export default function App() {
  // Request permissions on app launch
  useEffect(() => {
    const requestPermissions = async () => {
      // Permission requests will be handled in respective utility files
    };
    
    requestPermissions();
  }, []);

  return (
    <ThemeProvider>
      <EntryProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'My Journey' }} />
            <Stack.Screen name="AddEntry" component={AddEntryScreen} options={{ title: 'Add Entry' }} />
          </Stack.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
      </EntryProvider>
    </ThemeProvider>
  );
}