import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { NewsCard as FeatureNewsCard, useNews } from '@/features/news';
import { useThemeColor } from '@/hooks/useThemeColor';

interface DashboardNewsSectionProps {
  title?: string;
  limit?: number;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;
const CARD_MARGIN = 15; // marginRight from NewsCard
const SNAP_INTERVAL = CARD_WIDTH + CARD_MARGIN; // Total width including margin

/**
 * Section News pour le dashboard
 * Affiche les actualités récentes depuis Directus en scroll horizontal
 */
export function DashboardNewsSection({ 
  title = 'Actualités récentes', 
  limit = 3 
}: DashboardNewsSectionProps) {
  const textColor = useThemeColor({}, 'text');
  const router = useRouter();
  const { news, loading, error } = useNews({ limit });

  const handleNewsPress = (newsId: number) => {
    router.push(`/news/${newsId}`);
  };

  const handleSeeAll = () => {
    router.push('/(tabs)/news');
  };

  // Toujours afficher la section (même en loading ou erreur)
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>{title}</Text>
        {!loading && !error && news && news.length > 0 && (
          <TouchableOpacity onPress={handleSeeAll}>
            <Text style={styles.seeAllText}>Tout voir →</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#0a7ea4" />
          <Text style={[styles.loadingText, { color: textColor }]}>
            Chargement des actualités...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={[styles.errorText, { color: textColor }]}>
            Impossible de charger les actualités
          </Text>
        </View>
      ) : !news || news.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📰</Text>
          <Text style={[styles.emptyText, { color: textColor }]}>
            Aucune actualité disponible
          </Text>
        </View>
      ) : (
        <FlatList
          data={news}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id?.toString() || ''}
          renderItem={({ item }) => (
            <FeatureNewsCard
              news={item}
              onPress={() => item.id && handleNewsPress(item.id)}
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
    color: '#0a7ea4',
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
