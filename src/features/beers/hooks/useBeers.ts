import { useCallback, useEffect, useState } from 'react';
import { beerService } from '../services';
import type { Beer, BeerFilters } from '../types';
import { LikeService } from '@/src/features/likes';

/**
 * Hook pour gérer les bières
 */
export function useBeers(filters?: BeerFilters) {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Extraire les valeurs des filtres pour les utiliser comme dépendances
  const search = filters?.search;
  const brewery = filters?.brewery;
  const style = filters?.style;
  const available_at = filters?.available_at;
  const limit = filters?.limit;
  const offset = filters?.offset;

  /**
   * Enrichit les bières avec le comptage des likes depuis Supabase
   */
  const enrichBeersWithLikes = useCallback(async (beersData: Beer[]): Promise<Beer[]> => {
    if (beersData.length === 0) return beersData;

    try {
      // Récupérer tous les IDs de bières
      const beerIds = beersData
        .map(beer => beer.id)
        .filter((id): id is number => id !== undefined);

      // Récupérer le comptage des likes pour toutes les bières
      const likesMap = await LikeService.getBeersLikesCount(beerIds);

      // Enrichir chaque bière avec son comptage
      return beersData.map(beer => ({
        ...beer,
        likesCount: beer.id ? likesMap.get(beer.id) || 0 : 0,
      }));
    } catch (err) {
      console.error('Error enriching beers with likes:', err);
      // En cas d'erreur, retourner les bières sans enrichissement
      return beersData.map(beer => ({ ...beer, likesCount: 0 }));
    }
  }, []);

  /**
   * Charge les bières
   */
  const loadBeers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await beerService.getAll({ 
        search, 
        brewery, 
        style, 
        available_at, 
        limit, 
        offset 
      });
      
      // Enrichir avec les likes
      const enrichedData = await enrichBeersWithLikes(data);
      setBeers(enrichedData);
    } catch (err) {
      setError(err as Error);
      console.error('Error loading beers:', err);
    } finally {
      setLoading(false);
    }
  }, [search, brewery, style, available_at, limit, offset, enrichBeersWithLikes]);

  /**
   * Rafraîchit les bières (pull-to-refresh)
   */
  const refresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      const data = await beerService.getAll({ 
        search, 
        brewery, 
        style, 
        available_at, 
        limit, 
        offset 
      });
      
      // Enrichir avec les likes
      const enrichedData = await enrichBeersWithLikes(data);
      setBeers(enrichedData);
    } catch (err) {
      setError(err as Error);
      console.error('Error refreshing beers:', err);
    } finally {
      setRefreshing(false);
    }
  }, [search, brewery, style, available_at, limit, offset, enrichBeersWithLikes]);

  // Charge les bières au montage du composant
  useEffect(() => {
    loadBeers();
  }, [loadBeers]);

  return {
    beers,
    loading,
    error,
    refreshing,
    refresh,
    reload: loadBeers,
  };
}

/**
 * Hook pour récupérer une bière par son ID
 */
export function useBeerById(id: number | null) {
  const [beer, setBeer] = useState<Beer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setBeer(null);
      return;
    }

    const loadBeer = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await beerService.getById(id);
        setBeer(data);
      } catch (err) {
        setError(err as Error);
        console.error(`Error loading beer ${id}:`, err);
      } finally {
        setLoading(false);
      }
    };

    loadBeer();
  }, [id]);

  return {
    beer,
    loading,
    error,
  };
}
