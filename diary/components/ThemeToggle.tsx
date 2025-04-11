import React, { useContext } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <TouchableOpacity style={styles.button} onPress={toggleTheme}>
      <Ionicons 
        name={isDark ? 'sunny-outline' : 'moon-outline'} 
        size={24} 
        color={theme.colors.text} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    marginRight: 8,
  },
});

export default ThemeToggle;