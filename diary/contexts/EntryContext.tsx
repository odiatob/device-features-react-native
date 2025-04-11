import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the diary entry type
export type DiaryEntry = {
  id: string;
  imageUri: string;
  address: string;
  timestamp: number;
  latitude?: number;
  longitude?: number;
};

// Define the context type
type EntryContextType = {
  entries: DiaryEntry[];
  addEntry: (entry: DiaryEntry) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  loading: boolean;
};

// Create the context
export const EntryContext = createContext<EntryContextType>({
  entries: [],
  addEntry: async () => {},
  removeEntry: async () => {},
  loading: true,
});

// Storage key
const STORAGE_KEY = 'diaryEntries';

// Provider component
export const EntryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load entries from AsyncStorage on mount
  useEffect(() => {
    const loadEntries = async () => {
      try {
        const savedEntries = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedEntries !== null) {
          setEntries(JSON.parse(savedEntries));
        }
      } catch (e) {
        console.log('Failed to load diary entries.');
      } finally {
        setLoading(false);
      }
    };
    
    loadEntries();
  }, []);

  // Save entries to AsyncStorage
  const saveEntries = async (updatedEntries: DiaryEntry[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
    } catch (e) {
      console.log('Failed to save diary entries.');
    }
  };

  // Add new entry
  const addEntry = async (entry: DiaryEntry) => {
    const updatedEntries = [...entries, entry];
    setEntries(updatedEntries);
    await saveEntries(updatedEntries);
  };

  // Remove entry
  const removeEntry = async (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    setEntries(updatedEntries);
    await saveEntries(updatedEntries);
  };

  return (
    <EntryContext.Provider value={{ entries, addEntry, removeEntry, loading }}>
      {children}
    </EntryContext.Provider>
  );
};