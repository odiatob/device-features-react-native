import React, { useContext, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../contexts/ThemeContext';
import { EntryContext } from '../contexts/EntryContext';
import DiaryEntryCard from '../components/DiaryEntryCard';
import ThemeToggle from '../components/ThemeToggle';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const { entries, loading } = useContext(EntryContext);

  // Add theme toggle to header and apply theme to header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <ThemeToggle />,
      headerStyle: {
        backgroundColor: theme.colors.card,
      },
      headerTintColor: theme.colors.text,
      headerTitleStyle: {
        color: theme.colors.text,
      },
    });
  }, [navigation, theme]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {loading ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            Loading entries...
          </Text>
        </View>
      ) : entries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            There are no entries!
          </Text>
          <TouchableOpacity
            style={[styles.addEntryButton, { backgroundColor: theme.colors.button }]}
            onPress={() => navigation.navigate('AddEntry' as never)}
          >
            <Ionicons name="add" size={20} color={theme.colors.buttonText} style={styles.buttonIcon} />
            <Text style={[styles.buttonText, { color: theme.colors.buttonText }]}>Add Entry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={entries}
            renderItem={({ item }) => <DiaryEntryCard entry={item} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
          
          <TouchableOpacity
            style={[styles.addEntryButton, styles.centeredButton, { backgroundColor: theme.colors.button }]}
            onPress={() => navigation.navigate('AddEntry' as never)}
          >
            <Ionicons name="add" size={20} color={theme.colors.buttonText} style={styles.buttonIcon} />
            <Text style={[styles.buttonText, { color: theme.colors.buttonText }]}>Add Entry</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80, // Add extra padding to avoid button overlap
  },
  addEntryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  centeredButton: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});