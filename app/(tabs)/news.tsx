import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet, View, ScrollView, RefreshControl } from 'react-native';

import { ThemedText } from '@/components/common';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import type { NewsItem } from '@/features/news';
import { NewsListVertical, useNews } from '@/features/news';

export default function News() {
  const { news, loading, error, refreshing, refresh } = useNews();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const handleNewsPress = (newsItem: NewsItem) => {
    router.push(`/news/${newsItem.id}`);
  };

  const renderEmpty = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
          <ThemedText style={styles.loadingText}>Chargement des actualités...</ThemedText>
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
        <ThemedText style={styles.emptyText}>📰 Aucune actualité disponible</ThemedText>
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
          <ThemedText type="title">Gazette du Royaume</ThemedText>
        </View>

        <View style={styles.contentContainer}>
          {!loading && !error && news.length > 0 ? (
            <NewsListVertical
              news={news}
              onPress={handleNewsPress}
            />
          ) : (
            renderEmpty()
          )}
        </View>

        <View style={styles.infoContainer}>
          <ThemedText style={styles.infoText}>
            💡 Les actualités sont chargées depuis Directus
          </ThemedText>
          <ThemedText style={styles.infoSubtext}>
            {news.length > 0 
              ? `${news.length} actualité${news.length > 1 ? 's' : ''} disponible${news.length > 1 ? 's' : ''}`
              : 'Aucune actualité pour le moment'
            }
          </ThemedText>
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
    marginBottom: 20,
    minHeight: 250,
  },
  newsList: {
    paddingVertical: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    opacity: 0.7,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  errorSubtext: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
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
    opacity: 0.7,
  },
});
