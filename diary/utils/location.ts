import * as Location from 'expo-location';
import { Alert } from 'react-native';

export const requestLocationPermission = async (): Promise<boolean> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
};

export const getCurrentLocation = async (): Promise<Location.LocationObject | null> => {
  const hasPermission = await requestLocationPermission();
  
  if (!hasPermission) {
    Alert.alert('Permission Required', 'Location permission is required');
    return null;
  }
  
  try {
    return await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High
    });
  } catch (error) {
    console.log('Error getting location:', error);
    return null;
  }
};

export const getAddressFromCoordinates = async (
  latitude: number, 
  longitude: number
): Promise<string> => {
  try {
    const results = await Location.reverseGeocodeAsync({ latitude, longitude });
    
    if (results.length > 0) {
      const { street, city, region, country } = results[0];
      
      let formattedAddress = '';
      if (street) formattedAddress += street;
      if (city) formattedAddress += (formattedAddress ? ', ' : '') + city;
      if (region) formattedAddress += (formattedAddress ? ', ' : '') + region;
      if (country) formattedAddress += (formattedAddress ? ', ' : '') + country;
      
      return formattedAddress || 'Unknown location';
    }
    
    return 'Unknown location';
  } catch (error) {
    console.log('Error getting address:', error);
    return 'Unknown location';
  }
};