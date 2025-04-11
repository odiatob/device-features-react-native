import AsyncStorage from '@react-native-async-storage/async-storage';

// Generic function to store data
export const storeData = async <T>(key: string, value: T): Promise<boolean> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (e) {
    console.log(`Error storing ${key}:`, e);
    return false;
  }
};

// Generic function to retrieve data
export const getData = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log(`Error retrieving ${key}:`, e);
    return null;
  }
};

// Function to remove data
export const removeData = async (key: string): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    console.log(`Error removing ${key}:`, e);
    return false;
  }
};