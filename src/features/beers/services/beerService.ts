import { directus, getDirectusImageUrl, readItem, readItems } from '@/core/api';
import type { Beer, BeerFilters } from '../types';

/**
 * Service pour gérer les bières depuis Directus
 */
class BeerService {
  private readonly collection = 'beers';

  /**
   * Récupère toutes les bières
   */
  async getAll(filters?: BeerFilters): Promise<Beer[]> {
    try {
      const query: any = {
        sort: ['title'], // Tri alphabétique
        limit: filters?.limit || 50,
        offset: filters?.offset || 0,
        fields: ['*', 'brewery.*', 'style.*'], // Charger les relations
      };

      // Construire les filtres
      const filterConditions: any = {};

      if (filters?.search) {
        filterConditions._or = [
          { title: { _contains: filters.search } },
          { description: { _contains: filters.search } },
        ];
      }

      if (filters?.brewery) {
        filterConditions.brewery = { _eq: filters.brewery };
      }

      if (filters?.style) {
        filterConditions.style = { _eq: filters.style };
      }

      if (filters?.available_at) {
        filterConditions.available_at = { _contains: filters.available_at };
      }

      // N'ajouter le filtre que s'il y a des conditions
      if (Object.keys(filterConditions).length > 0) {
        query.filter = filterConditions;
      }

      const response = await directus.request(
        readItems(this.collection, query)
      );
      
      return response as Beer[];
    } catch (error) {
      console.error('❌ [BeerService] Error fetching beers:', error);
      throw new Error('Impossible de récupérer les bières');
    }
  }

  /**
   * Récupère une bière par son ID
   */
  async getById(id: number): Promise<Beer> {
    try {
      const response = await directus.request(
        readItem(this.collection, id, {
          fields: ['*', 'brewery.*', 'style.*'], // Charger les relations
        })
      );

      return response as Beer;
    } catch (error) {
      console.error(`❌ [BeerService] Error fetching beer ${id}:`, error);
      throw new Error('Bière introuvable');
    }
  }

  /**
   * Récupère les bières par brasserie
   */
  async getByBrewery(breweryId: number, limit?: number): Promise<Beer[]> {
    return this.getAll({ brewery: breweryId, limit });
  }

  /**
   * Récupère les bières par style
   */
  async getByStyle(styleId: number, limit?: number): Promise<Beer[]> {
    return this.getAll({ style: styleId, limit });
  }

  /**
   * Récupère les bières disponibles dans un établissement
   */
  async getByEstablishment(establishmentId: number, limit?: number): Promise<Beer[]> {
    return this.getAll({ available_at: establishmentId, limit });
  }

  /**
   * Construit l'URL de l'image d'une bière
   */
  getImageUrl(beer: Beer, options?: {
    width?: number;
    height?: number;
    fit?: 'cover' | 'contain';
    quality?: number;
  }): string | null {
    if (!beer.featured_image) return null;
    // featured_image est un UUID string dans Directus
    return getDirectusImageUrl(beer.featured_image, options);
  }

  /**
   * Extrait un résumé de la description
   */
  getShortDescription(beer: Beer, maxLength: number = 100): string {
    if (!beer.description) return '';
    
    // Supprimer les retours à la ligne multiples
    const text = beer.description.replace(/\n\n+/g, ' ').trim();
    
    // Tronquer si nécessaire
    if (text.length > maxLength) {
      return text.substring(0, maxLength).trim() + '...';
    }
    
    return text;
  }

  /**
   * Formate l'IBU pour l'affichage
   */
  formatIBU(beer: Beer): string {
    if (!beer.ibu) return 'N/A';
    return `${beer.ibu} IBU`;
  }
}

// Export d'une instance singleton
export const beerService = new BeerService();
