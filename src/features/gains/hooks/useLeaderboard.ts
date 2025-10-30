import { useCallback, useEffect, useState } from 'react';
import { LeaderboardEntry, LeaderboardService } from '../services/leaderboardService';

interface UseLeaderboardReturn {
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  error: Error | null;
  refreshing: boolean;
  refresh: () => Promise<void>;
}

/**
 * Hook pour récupérer le classement hebdomadaire des utilisateurs
 */
export function useWeeklyLeaderboard(limit: number = 50): UseLeaderboardReturn {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchLeaderboard = useCallback(async (isRefresh: boolean = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const data = await LeaderboardService.getWeeklyLeaderboard(limit);
      setLeaderboard(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur inconnue'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [limit]);

  const refresh = useCallback(async () => {
    await fetchLeaderboard(true);
  }, [fetchLeaderboard]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return {
    leaderboard,
    loading,
    error,
    refreshing,
    refresh,
  };
}

/**
 * Hook pour récupérer le classement mensuel des utilisateurs
 */
export function useMonthlyLeaderboard(limit: number = 50): UseLeaderboardReturn {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchLeaderboard = useCallback(async (isRefresh: boolean = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const data = await LeaderboardService.getMonthlyLeaderboard(limit);
      setLeaderboard(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur inconnue'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [limit]);

  const refresh = useCallback(async () => {
    await fetchLeaderboard(true);
  }, [fetchLeaderboard]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return {
    leaderboard,
    loading,
    error,
    refreshing,
    refresh,
  };
}

/**
 * Hook pour récupérer le classement annuel des utilisateurs
 */
export function useYearlyLeaderboard(limit: number = 50): UseLeaderboardReturn {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchLeaderboard = useCallback(async (isRefresh: boolean = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const data = await LeaderboardService.getYearlyLeaderboard(limit);
      setLeaderboard(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur inconnue'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [limit]);

  const refresh = useCallback(async () => {
    await fetchLeaderboard(true);
  }, [fetchLeaderboard]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return {
    leaderboard,
    loading,
    error,
    refreshing,
    refresh,
  };
}

interface UseGlobalLeaderboardReturn {
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  error: Error | null;
  refreshing: boolean;
  refresh: () => Promise<void>;
}

/**
 * Hook pour récupérer le classement global (tous les temps) des utilisateurs
 */
export function useGlobalLeaderboard(limit: number = 50): UseGlobalLeaderboardReturn {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchLeaderboard = useCallback(async (isRefresh: boolean = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const data = await LeaderboardService.getGlobalLeaderboard(limit);
      setLeaderboard(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur inconnue'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [limit]);

  const refresh = useCallback(async () => {
    await fetchLeaderboard(true);
  }, [fetchLeaderboard]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return {
    leaderboard,
    loading,
    error,
    refreshing,
    refresh,
  };
}

interface UseUserRankReturn {
  rank: number | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook pour récupérer le rang d'un utilisateur dans le classement hebdomadaire
 */
export function useUserWeeklyRank(userId: string | undefined): UseUserRankReturn {
  const [rank, setRank] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchRank = async () => {
      try {
        setLoading(true);
        setError(null);

        const userRank = await LeaderboardService.getUserWeeklyRank(userId);
        setRank(userRank);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erreur inconnue'));
      } finally {
        setLoading(false);
      }
    };

    fetchRank();
  }, [userId]);

  return {
    rank,
    loading,
    error,
  };
}
