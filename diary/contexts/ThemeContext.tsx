import React, { createContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeType = {
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    secondary: string;
    button: string;
    buttonText: string;
  };
};

export const lightTheme: ThemeType = {
  dark: false,
  colors: {
    primary: '#4A6572',
    background: '#F5F5F5',
    card: '#FFFFFF',
    text: '#212121',
    border: '#E0E0E0',
    secondary: '#757575',
    button: '#344955',
    buttonText: '#FFFFFF',
  },
};

export const darkTheme: ThemeType = {
  dark: true,
  colors: {
    primary: '#4A6572',
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    border: '#2C2C2C',
    secondary: '#B0B0B0',
    button: '#4A6572',
    buttonText: '#FFFFFF',
  },
};

type ThemeContextType = {
  theme: ThemeType;
  isDark: boolean;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [isDark, setIsDark] = useState<boolean>(deviceTheme === 'dark');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themePref');
        if (savedTheme !== null) {
          setIsDark(savedTheme === 'dark');
        } else {

          setIsDark(deviceTheme === 'dark');
        }
      } catch (e) {
        console.log('Failed to load theme preference.');
      }
    };
    
    loadTheme();
  }, [deviceTheme]);

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      await AsyncStorage.setItem('themePref', newTheme ? 'dark' : 'light');
    } catch (e) {
      console.log('Failed to save theme preference.');
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      theme: isDark ? darkTheme : lightTheme, 
      isDark, 
      toggleTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};