import { StyleSheet, View, ScrollView } from 'react-native';

import { ThemedText, ThemedView } from '@/components/common';

export default function Quest() {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Quêtes</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.contentContainer}>
          <View style={styles.centerContainer}>
            <ThemedText style={styles.emptyText}>🗺️ Bientôt disponible</ThemedText>
          </View>
        </ThemedView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 100,
    paddingBottom: 100,
    paddingHorizontal: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  contentContainer: {
    marginBottom: 30,
    minHeight: 250,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
});