import type { News } from '@/core/api';

/**
 * Type pour une actualité/news depuis Directus
 * Utilise le type auto-généré
 */
export type NewsItem = News;

/**
 * Options de filtre pour les news
 */
export interface NewsFilters {
  search?: string;
  limit?: number;
  offset?: number;
}
