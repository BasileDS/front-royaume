import { useCallback, useEffect, useState } from 'react';
import { establishmentService } from '../services';
import type { Establishment, EstablishmentFilters } from '../types';

/**
 * Hook pour gérer les établissements
 */
export function useEstablishments(filters?: EstablishmentFilters) {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadEstablishments = useCallback(async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const data = await establishmentService.getAll(filters);
      setEstablishments(data);
    } catch (err) {
      setError(err as Error);
      console.error('❌ [useEstablishments] Error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filters]);

  useEffect(() => {
    loadEstablishments();
  }, [loadEstablishments]);

  const refresh = useCallback(() => {
    loadEstablishments(true);
  }, [loadEstablishments]);

  return {
    establishments,
    loading,
    error,
    refreshing,
    refresh,
  };
}

/**
 * Hook pour gérer un établissement individuel
 */
export function useEstablishment(id: number) {
  const [establishment, setEstablishment] = useState<Establishment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadEstablishment = useCallback(async () => {
    // Ne rien faire si l'ID est invalide
    if (!id || id <= 0) {
      setEstablishment(null);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await establishmentService.getById(id);
      setEstablishment(data);
    } catch (err) {
      setError(err as Error);
      console.error(`❌ [useEstablishment] Error loading establishment ${id}:`, err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadEstablishment();
  }, [loadEstablishment]);

  return {
    establishment,
    loading,
    error,
    reload: loadEstablishment,
  };
}
