import type { Establishments } from '@/core/api';

/**
 * Type pour un établissement depuis Directus
 * Utilise le type auto-généré et ajoute des champs optionnels
 */
export interface Establishment extends Establishments {
  // Champs additionnels non présents dans Directus mais utiles pour l'app
  status?: 'published' | 'draft' | 'archived';
  phone?: string;
  email?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  opening_hours?: string;
  type?: string; // Type d'établissement (bar, restaurant, brasserie, etc.)
}

/**
 * Options de filtre pour les établissements
 */
export interface EstablishmentFilters {
  search?: string;
  city?: string;
  type?: string;
  zipcode?: string;
  limit?: number;
  offset?: number;
}
