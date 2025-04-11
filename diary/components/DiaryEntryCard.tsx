import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ThemeContext } from '../contexts/ThemeContext';
import { EntryContext, DiaryEntry } from '../contexts/EntryContext';

type DiaryEntryCardProps = {
  entry: DiaryEntry;
};

const DiaryEntryCard: React.FC<DiaryEntryCardProps> = ({ entry }) => {
  const { theme } = useContext(ThemeContext);
  const { removeEntry } = useContext(EntryContext);

  const handleRemove = () => {
    Alert.alert(
      'Remove Entry',
      'Are you sure you want to remove this entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => removeEntry(entry.id)
        }
      ]
    );
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
      <Image source={{ uri: entry.imageUri }} style={styles.image} />
      <View style={styles.content}>
        <Text style={[styles.address, { color: theme.colors.text }]}>
          {entry.address}
        </Text>
        <Text style={[styles.date, { color: theme.colors.secondary }]}>
          {format(new Date(entry.timestamp), 'MMM dd, yyyy • HH:mm')}
        </Text>
      </View>
      <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
        <Ionicons name="trash-outline" size={24} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  address: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DiaryEntryCard;