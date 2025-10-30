import { BeerDetailLayout } from '@/components/layout';
import { beerService, type Beer } from '@/features/beers';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function BeerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [beer, setBeer] = useState<Beer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadBeer(parseInt(id, 10));
    }
  }, [id]);

  const loadBeer = async (beerId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await beerService.getById(beerId);
      setBeer(data);
    } catch (err) {
      console.error('Error loading beer:', err);
      setError('Impossible de charger la bière');
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

  if (error || !beer) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>❌ {error || 'Bière introuvable'}</Text>
      </View>
    );
  }

  return <BeerDetailLayout beer={beer} />;
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
  },
});
