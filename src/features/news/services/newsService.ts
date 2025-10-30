import { directus, getDirectusImageUrl, readItem, readItems } from '@/core/api';
import type { NewsFilters, NewsItem } from '../types';

/**
 * Service pour gérer les actualités depuis Directus
 * Structure simplifiée correspondant aux champs réels de la collection
 */
class NewsService {
  private readonly collection = 'news';

  /**
   * Récupère toutes les actualités
   */
  async getAll(filters?: NewsFilters): Promise<NewsItem[]> {
    try {
      const query: any = {
        sort: ['-id'], // Tri par ID décroissant (plus récent d'abord)
        limit: filters?.limit || 20,
        offset: filters?.offset || 0,
      };

      // Filtre de recherche optionnel
      if (filters?.search) {
        query.filter = {
          _or: [
            { title: { _contains: filters.search } },
            { content: { _contains: filters.search } },
          ],
        };
      }

      const response = await directus.request(
        readItems(this.collection, query)
      );
      
      return response as NewsItem[];
    } catch (error) {
      console.error('❌ [NewsService] Error fetching news:', error);
      throw new Error('Impossible de récupérer les actualités');
    }
  }

  /**
   * Récupère une actualité par son ID
   */
  async getById(id: number): Promise<NewsItem> {
    try {
      const response = await directus.request(
        readItem(this.collection, id)
      );

      return response as NewsItem;
    } catch (error) {
      console.error(`❌ [NewsService] Error fetching news ${id}:`, error);
      throw new Error('Actualité introuvable');
    }
  }

  /**
   * Récupère les actualités récentes
   */
  async getRecent(limit: number = 5): Promise<NewsItem[]> {
    return this.getAll({ limit });
  }

  /**
   * Construit l'URL de l'image d'une actualité
   */
  getImageUrl(news: NewsItem, options?: {
    width?: number;
    height?: number;
    fit?: 'cover' | 'contain';
    quality?: number;
  }): string | null {
    if (!news.featured_image) return null;
    // featured_image est un UUID string dans Directus
    return getDirectusImageUrl(news.featured_image, options);
  }

  /**
   * Extrait un excerpt du contenu HTML
   */
  getExcerpt(news: NewsItem, maxLength: number = 150): string {
    if (!news.content) return '';
    
    // Supprimer les balises HTML
    const text = news.content.replace(/<[^>]*>/g, '');
    // Décoder les entités HTML
    const decoded = text
      .replace(/&agrave;/g, 'à')
      .replace(/&eacute;/g, 'é')
      .replace(/&egrave;/g, 'è')
      .replace(/&ecirc;/g, 'ê')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&');
    
    // Tronquer si nécessaire
    if (decoded.length > maxLength) {
      return decoded.substring(0, maxLength).trim() + '...';
    }
    
    return decoded.trim();
  }
}

// Export d'une instance singleton
export const newsService = new NewsService();
