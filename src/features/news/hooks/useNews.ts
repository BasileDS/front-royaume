import { useCallback, useEffect, useState } from 'react';
import { newsService } from '../services';
import type { NewsFilters, NewsItem } from '../types';

/**
 * Hook pour gérer les actualités
 */
export function useNews(filters?: NewsFilters) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Extraire les valeurs des filtres pour les utiliser comme dépendances
  const search = filters?.search;
  const limit = filters?.limit;
  const offset = filters?.offset;

  /**
   * Charge les actualités
   */
  const loadNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await newsService.getAll({ search, limit, offset });
      setNews(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error loading news:', err);
    } finally {
      setLoading(false);
    }
  }, [search, limit, offset]);

  /**
   * Rafraîchit les actualités (pull-to-refresh)
   */
  const refresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      const data = await newsService.getAll({ search, limit, offset });
      setNews(data);
    } catch (err) {
      setError(err as Error);
      console.error('Error refreshing news:', err);
    } finally {
      setRefreshing(false);
    }
  }, [search, limit, offset]);

  // Charge les actualités au montage du composant
  useEffect(() => {
    loadNews();
  }, [loadNews]);

  return {
    news,
    loading,
    error,
    refreshing,
    refresh,
    reload: loadNews,
  };
}

/**
 * Hook pour récupérer une actualité par son ID
 */
export function useNewsById(id: number | null) {
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setNewsItem(null);
      return;
    }

    const loadNewsItem = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await newsService.getById(id);
        setNewsItem(data);
      } catch (err) {
        setError(err as Error);
        console.error(`Error loading news ${id}:`, err);
      } finally {
        setLoading(false);
      }
    };

    loadNewsItem();
  }, [id]);

  return {
    newsItem,
    loading,
    error,
  };
}

/**
 * Hook pour récupérer les actualités récentes
 */
export function useRecentNews(limit: number = 5) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadRecentNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await newsService.getRecent(limit);
        setNews(data);
      } catch (err) {
        setError(err as Error);
        console.error('Error loading recent news:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRecentNews();
  }, [limit]);

  return {
    news,
    loading,
    error,
  };
}
