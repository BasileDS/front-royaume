import React from 'react';
import { StyleSheet, ActivityIndicator, View, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/common';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { EstablishmentCard, useEstablishments } from '@/features/establishments';

export default function EstablishmentsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { establishments, loading, error, refreshing, refresh } = useEstablishments();

  const handleEstablishmentPress = (id: number) => {
    router.push(`/establishments/${id}`);
  };

  const renderContent = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
          <ThemedText style={styles.loadingText}>Chargement des établissements...</ThemedText>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <ThemedText style={styles.errorText}>❌ {error.message}</ThemedText>
          <ThemedText style={styles.errorSubtext}>Tirez pour réessayer</ThemedText>
        </View>
      );
    }

    if (establishments.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <ThemedText style={styles.emptyText}>🏰 Aucun établissement disponible</ThemedText>
        </View>
      );
    }

    return (
      <View style={styles.listContainer}>
        {establishments.map((establishment) => (
          <EstablishmentCard
            key={establishment.id}
            establishment={establishment}
            onPress={() => establishment.id && handleEstablishmentPress(establishment.id)}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={Colors[colorScheme ?? 'light'].tint}
            colors={[Colors[colorScheme ?? 'light'].tint]}
          />
        }>
        <View style={styles.titleContainer}>
          <ThemedText type="title">Établissements</ThemedText>
        </View>

        <View style={styles.contentContainer}>
          {renderContent()}
        </View>
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
    gap: 16,
  },
  listContainer: {
    gap: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 12,
    opacity: 0.7,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
});
