import { useCallback, useEffect, useState } from 'react';
import { beerService } from '../services';
import type { Beer } from '../types';

/**
 * Hook pour gérer une bière individuelle
 */
export function useBeer(id: number | null) {
  const [beer, setBeer] = useState<Beer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Charge la bière
   */
  const loadBeer = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

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
  }, [id]);

  /**
   * Rafraîchit la bière
   */
  const refresh = useCallback(async () => {
    if (!id) return;

    try {
      const data = await beerService.getById(id);
      setBeer(data);
    } catch (err) {
      setError(err as Error);
      console.error(`Error refreshing beer ${id}:`, err);
    }
  }, [id]);

  useEffect(() => {
    loadBeer();
  }, [loadBeer]);

  return {
    beer,
    loading,
    error,
    refresh,
  };
}
