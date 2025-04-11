import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


export type DiaryEntry = {
  id: string;
  imageUri: string;
  address: string;
  timestamp: number;
  latitude?: number;
  longitude?: number;
};


type EntryContextType = {
  entries: DiaryEntry[];
  addEntry: (entry: DiaryEntry) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  loading: boolean;
};

export const EntryContext = createContext<EntryContextType>({
  entries: [],
  addEntry: async () => {},
  removeEntry: async () => {},
  loading: true,
});


const STORAGE_KEY = 'diaryEntries';


export const EntryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

  const saveEntries = async (updatedEntries: DiaryEntry[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
    } catch (e) {
      console.log('Failed to save diary entries.');
    }
  };

  const addEntry = async (entry: DiaryEntry) => {
    const updatedEntries = [...entries, entry];
    setEntries(updatedEntries);
    await saveEntries(updatedEntries);
  };


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