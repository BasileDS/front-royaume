import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BeerCard, useBeers } from '@/features/beers';
import { useThemeColor } from '@/hooks/useThemeColor';

interface DashboardBeersSectionProps {
  title?: string;
  limit?: number;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.45;
const CARD_MARGIN = 5; // marginHorizontal from BeerCard
const SNAP_INTERVAL = CARD_WIDTH + (CARD_MARGIN * 2); // Total width including margins

/**
 * Section Bières pour le dashboard
 * Affiche une sélection de bières depuis Directus en scroll horizontal
 */
export function DashboardBeersSection({ 
  title = 'Découvrez nos bières', 
  limit = 6 
}: DashboardBeersSectionProps) {
  const textColor = useThemeColor({}, 'text');
  const router = useRouter();
  const { beers, loading, error } = useBeers({ limit });

  const handleBeerPress = (beerId: number) => {
    router.push(`/beers/${beerId}`);
  };

  const handleSeeAll = () => {
    router.push('/(tabs)/tavern');
  };

  // Toujours afficher la section (même en loading ou erreur)
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>{title}</Text>
        {!loading && !error && beers && beers.length > 0 && (
          <TouchableOpacity onPress={handleSeeAll}>
            <Text style={styles.seeAllText}>Tout voir →</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#FFA500" />
          <Text style={[styles.loadingText, { color: textColor }]}>
            Chargement des bières...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={[styles.errorText, { color: textColor }]}>
            Impossible de charger les bières
          </Text>
        </View>
      ) : !beers || beers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🍺</Text>
          <Text style={[styles.emptyText, { color: textColor }]}>
            Aucune bière disponible
          </Text>
        </View>
      ) : (
        <FlatList
          data={beers}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(beer) => beer.id?.toString() || ''}
          renderItem={({ item }) => (
            <BeerCard
              beer={item}
              onPress={() => item.id && handleBeerPress(item.id)}
              showActions={false}
            />
          )}
          contentContainerStyle={styles.scrollContent}
          style={styles.horizontalScroll}
          snapToInterval={SNAP_INTERVAL}
          decelerationRate="fast"
          snapToAlignment="start"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
    paddingVertical: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    color: '#FFA500',
    fontWeight: '600',
  },
  horizontalScroll: {
    paddingLeft: 10,
  },
  scrollContent: {
    paddingRight: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    opacity: 0.7,
  },
  errorContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
});
