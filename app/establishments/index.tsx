import { ThemedText, ThemedView } from '@/components/common';
import { Header } from '@/components/layout';
import type { Establishment } from '@/src/features/establishments';
import { EstablishmentCard, useEstablishments } from '@/src/features/establishments';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

/**
 * Page principale des établissements du Royaume
 * Affiche la liste complète des établissements partenaires
 */
export default function EstablishmentsIndex() {
  const { establishments, loading, error, refreshing, refresh } = useEstablishments();

  const handleEstablishmentPress = (establishment: Establishment) => {
    // TODO: Navigation vers le détail (à implémenter)
  };

  const renderEmpty = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
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

    return (
      <View style={styles.centerContainer}>
        <ThemedText style={styles.emptyText}>📍 Aucun établissement disponible</ThemedText>
      </View>
    );
  };

  return (
    <>
      <Header />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={refresh}
              tintColor="#4A90E2"
            />
          }
        >
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">📍 Établissements du Royaume</ThemedText>
          </ThemedView>

          <ThemedView style={styles.subtitleContainer}>
            <ThemedText style={styles.subtitle}>
              Découvrez nos établissements partenaires
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.contentContainer}>
            {!loading && !error && establishments.length > 0 ? (
              <View style={styles.establishmentsList}>
                {establishments.map((establishment) => (
                  <EstablishmentCard 
                    key={establishment.id} 
                    establishment={establishment}
                    onPress={handleEstablishmentPress}
                  />
                ))}
              </View>
            ) : (
              renderEmpty()
            )}
          </ThemedView>

          {establishments.length > 0 && (
            <ThemedView style={styles.infoContainer}>
              <ThemedText style={styles.infoText}>
                📍 Établissements partenaires du Royaume
              </ThemedText>
              <ThemedText style={styles.infoSubtext}>
                {establishments.length} établissement{establishments.length > 1 ? 's' : ''} référencé{establishments.length > 1 ? 's' : ''}
              </ThemedText>
            </ThemedView>
          )}

          <ThemedView style={styles.mapHintContainer}>
            <ThemedText style={styles.mapHintText}>
              💡 Astuce : Utilisez l&apos;onglet Carte pour voir les établissements près de vous
            </ThemedText>
          </ThemedView>
        </ScrollView>
      </View>
    </>
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
    paddingBottom: 40,
    paddingHorizontal: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  subtitleContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  contentContainer: {
    marginBottom: 30,
  },
  establishmentsList: {
    gap: 12,
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
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  infoContainer: {
    padding: 16,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 12,
    marginTop: 20,
    marginHorizontal: 10,
    marginBottom: 20,
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
  mapHintContainer: {
    padding: 12,
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderRadius: 8,
    marginHorizontal: 10,
  },
  mapHintText: {
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.8,
  },
});
