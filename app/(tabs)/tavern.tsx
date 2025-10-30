import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useState } from 'react';

import { ThemedText, ThemedView } from '@/components/common';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { 
  BeerCardVertical, 
  useBeers, 
  BeerFilterModal, 
  FloatingFilterButton,
  useFilteredBeers 
} from '@/src/features/beers';
import type { BeerFilterState } from '@/src/features/beers';
import { initialFilterState, countActiveFilters } from '@/src/features/beers/types/filter.types';
import { useAuth } from '@/src/features/auth';

export default function Tavern() {
  const { beers, loading, error, refreshing, refresh } = useBeers();
  const colorScheme = useColorScheme();
  const { userProfile } = useAuth();

  // État des filtres
  const [filters, setFilters] = useState<BeerFilterState>(initialFilterState);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Appliquer les filtres sur les bières
  const filteredBeers = useFilteredBeers(
    beers,
    filters,
    userProfile?.attached_establishment_id
  );

  // Compter les filtres actifs
  const activeFiltersCount = countActiveFilters(filters);

  const renderEmpty = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
          <ThemedText style={styles.loadingText}>Chargement des bières...</ThemedText>
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

    return (
      <View style={styles.centerContainer}>
        <ThemedText style={styles.emptyText}>🍺 Aucune bière disponible</ThemedText>
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
        }
      >
        <View style={styles.titleContainer}>
          <ThemedText type="title">La Taverne</ThemedText>
        </View>

        <View style={styles.contentContainer}>
          {!loading && !error && filteredBeers.length > 0 ? (
            <View style={styles.beersList}>
              {filteredBeers.map((beer, index) => {
                // Créer des paires de bières pour la grille
                if (index % 2 === 0) {
                  const nextBeer = filteredBeers[index + 1];
                  return (
                    <View key={`row-${index}`} style={styles.row}>
                      <View style={styles.column}>
                        <BeerCardVertical beer={beer} showActions={true} />
                      </View>
                      {nextBeer && (
                        <View style={styles.column}>
                          <BeerCardVertical beer={nextBeer} showActions={true} />
                        </View>
                      )}
                    </View>
                  );
                }
                return null;
              })}
            </View>
          ) : (
            renderEmpty()
          )}
        </View>

        <ThemedView style={styles.infoContainer}>
          <ThemedText style={styles.infoText}>
            🍻 Catalogue de bières du Royaume
          </ThemedText>
          <ThemedText style={styles.infoSubtext}>
            {filteredBeers.length > 0 
              ? `${filteredBeers.length} bière${filteredBeers.length > 1 ? 's' : ''} ${activeFiltersCount > 0 ? 'filtrée' + (filteredBeers.length > 1 ? 's' : '') : 'disponible' + (filteredBeers.length > 1 ? 's' : '')}`
              : 'Aucune bière pour le moment'
            }
          </ThemedText>
        </ThemedView>
      </ScrollView>

      {/* Floating Filter Button */}
      <FloatingFilterButton
        onPress={() => setFilterModalVisible(true)}
        activeFiltersCount={activeFiltersCount}
      />

      {/* Filter Modal */}
      <BeerFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={filters}
        onApplyFilters={setFilters}
        hasEstablishment={!!userProfile?.attached_establishment_id}
      />
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
    paddingTop: 100, // Pour le header
    paddingBottom: 100, // Pour la tab bar
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
  },
  beersList: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  column: {
    flex: 1,
  },
  centerContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    opacity: 0.7,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
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
  infoContainer: {
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 12,
    opacity: 0.8,
  },
});
