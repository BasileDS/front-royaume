import { NewsDetailLayout } from '@/components/layout';
import { newsService, type NewsItem } from '@/features/news';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadNews(parseInt(id, 10));
    }
  }, [id]);

  const loadNews = async (newsId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await newsService.getById(newsId);
      setNews(data);
    } catch (err) {
      console.error('Error loading news:', err);
      setError('Impossible de charger l\'actualité');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0a7ea4" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (error || !news) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>❌ {error || 'Actualité introuvable'}</Text>
      </View>
    );
  }

  return <NewsDetailLayout news={news} />;
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
  },
});
