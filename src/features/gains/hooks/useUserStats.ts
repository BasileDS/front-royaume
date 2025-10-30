import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/src/features/auth';
import { GainService } from '../services/gainService';
import type { UserStats } from '../types/gain.types';

/**
 * Hook pour récupérer les statistiques de gains de l'utilisateur
 */
export function useUserStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    totalXP: 0,
    totalCashback: 0,
    gainsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async (isRefreshing = false) => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const userStats = await GainService.getUserStats(user.id);
      setStats(userStats);
    } catch (err) {
      console.error('Erreur lors du chargement des stats:', err);
      setError('Impossible de charger vos statistiques');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const refresh = useCallback(async () => {
    await loadStats(true);
  }, [loadStats]);

  return {
    stats,
    loading,
    refreshing,
    error,
    refresh,
    totalXP: stats.totalXP,
    totalCashback: stats.totalCashback,
    gainsCount: stats.gainsCount,
  };
}
