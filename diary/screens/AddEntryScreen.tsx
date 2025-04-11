import React, { useState, useContext, useLayoutEffect, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  Alert,
  BackHandler
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { ThemeContext } from '../contexts/ThemeContext';
import { EntryContext } from '../contexts/EntryContext';
import { takePicture } from '../utils/camera';
import { getAddressFromCoordinates } from '../utils/location';
import { sendNotification } from '../utils/notifications';

export default function AddEntryScreen() {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const { addEntry } = useContext(EntryContext);
  
  const [image, setImage] = useState<string | null>(null);
  const [address, setAddress] = useState<string>('');
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Apply theme to header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: theme.colors.card,
      },
      headerTintColor: theme.colors.text,
      headerTitleStyle: {
        color: theme.colors.text,
      },
    });
  }, [navigation, theme]);

  // Clear state when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      setImage(null);
      setAddress('');
      setCoordinates(null);
      setLoading(false);
      return () => {};
    }, [])
  );

  // Handle back button - confirm discard if entry in progress
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (image) {
          Alert.alert(
            'Discard Entry',
            'Are you sure you want to discard this entry?',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Discard', 
                style: 'destructive',
                onPress: () => navigation.goBack()
              }
            ]
          );
          return true;
        }
        return false;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [image, navigation])
  );

  // Take photo and get location
  const handleTakePicture = async () => {
    try {
      const result = await takePicture();
      if (result) {
        setImage(result);
        await getCurrentLocation();
      }
    } catch (error) {
      console.log('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture');
    }
  };

  // Get current location and address
  const getCurrentLocation = async () => {
    setLoading(true);
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoading(false);
        setAddress('Location permission denied');
        return;
      }
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });
      
      const { latitude, longitude } = location.coords;
      setCoordinates({ latitude, longitude });
      
      // Get address from coordinates
      const address = await getAddressFromCoordinates(latitude, longitude);
      setAddress(address);
    } catch (error) {
      console.log('Error getting location:', error);
      setAddress('Could not determine location');
    } finally {
      setLoading(false);
    }
  };

  // Save the entry
  const saveEntry = async () => {
    if (!image || !address) {
      Alert.alert('Error', 'Please take a picture first');
      return;
    }

    try {
      const newEntry = {
        id: Date.now().toString(),
        imageUri: image,
        address,
        timestamp: Date.now(),
        ...(coordinates && {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        }),
      };

      await addEntry(newEntry);
      
      // Send notification
      await sendNotification(
        'New Travel Entry Added',
        `You've added a new memory from ${address}`
      );
      
      navigation.goBack();
    } catch (error) {
      console.log('Error saving entry:', error);
      Alert.alert('Error', 'Failed to save entry');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {image ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.preview} />
          <TouchableOpacity
            style={[styles.retakeButton, { backgroundColor: theme.colors.button }]}
            onPress={handleTakePicture}
          >
            <Ionicons name="camera-reverse" size={24} color={theme.colors.buttonText} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.cameraButton, { backgroundColor: theme.colors.card }]}
          onPress={handleTakePicture}
        >
          <Ionicons name="camera" size={48} color={theme.colors.primary} />
          <Text style={[styles.cameraText, { color: theme.colors.text }]}>
            Take a Picture
          </Text>
        </TouchableOpacity>
      )}

      {loading ? (
        <View style={styles.addressContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Getting location...
          </Text>
        </View>
      ) : address ? (
        <View style={styles.addressContainer}>
          <Text style={[styles.addressLabel, { color: theme.colors.secondary }]}>
            LOCATION
          </Text>
          <Text style={[styles.addressText, { color: theme.colors.text }]}>
            {address}
          </Text>
        </View>
      ) : null}

      {image && address && !loading && (
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.colors.button }]}
          onPress={saveEntry}
        >
          <Text style={[styles.saveButtonText, { color: theme.colors.buttonText }]}>
            Save Entry
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  cameraButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 16,
  },
  cameraText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
  },
  imageContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  preview: {
    flex: 1,
    resizeMode: 'cover',
  },
  retakeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  addressContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  addressLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 16,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
  },
  saveButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});