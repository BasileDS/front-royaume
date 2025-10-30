import { directus, getDirectusImageUrl, readItem, readItems } from '@/core/api';
import type { Establishment, EstablishmentFilters } from '../types';

/**
 * Service pour gérer les établissements depuis Directus
 */
class EstablishmentService {
  private readonly collection = 'establishments';

  /**
   * Récupère tous les établissements
   */
  async getAll(filters?: EstablishmentFilters): Promise<Establishment[]> {
    try {
      const query: any = {
        sort: ['title'], // Tri alphabétique par titre
        limit: filters?.limit || 50,
        offset: filters?.offset || 0,
      };

      // Construire les filtres
      const filterConditions: any = {};

      if (filters?.search) {
        filterConditions._or = [
          { title: { _contains: filters.search } },
          { description: { _contains: filters.search } },
          { city: { _contains: filters.search } },
          { line_address_1: { _contains: filters.search } },
          { line_address_2: { _contains: filters.search } },
        ];
      }

      if (filters?.city) {
        filterConditions.city = { _eq: filters.city };
      }

      if (filters?.type) {
        filterConditions.type = { _eq: filters.type };
      }

      if (filters?.zipcode) {
        filterConditions.zipcode = { _eq: filters.zipcode };
      }

      // Ne pas filtrer par statut si le champ n'est pas accessible
      // filterConditions.status = { _eq: 'published' };

      if (Object.keys(filterConditions).length > 0) {
        query.filter = filterConditions;
      }

      const response = await directus.request(
        readItems(this.collection, query)
      );
      
      return response as Establishment[];
    } catch (error) {
      console.error('❌ [EstablishmentService] Error fetching establishments:', error);
      throw new Error('Impossible de récupérer les établissements');
    }
  }

  /**
   * Récupère un établissement par son ID
   */
  async getById(id: number): Promise<Establishment> {
    try {
      const response = await directus.request(
        readItem(this.collection, id)
      );

      return response as Establishment;
    } catch (error) {
      console.error(`❌ [EstablishmentService] Error fetching establishment ${id}:`, error);
      throw new Error('Établissement introuvable');
    }
  }

  /**
   * Récupère les établissements par ville
   */
  async getByCity(city: string, limit?: number): Promise<Establishment[]> {
    return this.getAll({ city, limit });
  }

  /**
   * Récupère les établissements par type
   */
  async getByType(type: string, limit?: number): Promise<Establishment[]> {
    return this.getAll({ type, limit });
  }

  /**
   * Construit l'URL de l'image d'un établissement
   */
  getImageUrl(establishment: Establishment, options?: {
    width?: number;
    height?: number;
    fit?: 'cover' | 'contain';
    quality?: number;
  }): string | null {
    if (!establishment.featured_image) {
      return null;
    }

    return getDirectusImageUrl(establishment.featured_image, options);
  }

  /**
   * Formate l'adresse complète d'un établissement
   */
  getFullAddress(establishment: Establishment): string {
    const parts = [
      establishment.line_address_1,
      establishment.line_address_2,
      establishment.zipcode && establishment.city 
        ? `${establishment.zipcode} ${establishment.city}`
        : establishment.city || establishment.zipcode
    ].filter(Boolean);

    return parts.join(', ');
  }

  /**
   * Vérifie si un établissement a des coordonnées GPS
   */
  hasCoordinates(establishment: Establishment): boolean {
    return !!(establishment.latitude && establishment.longitude);
  }
}

// Export d'une instance singleton
export const establishmentService = new EstablishmentService();
