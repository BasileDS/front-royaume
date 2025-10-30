/**
 * Types partagés pour toute l'application
 */

/**
 * État générique pour les requêtes asynchrones
 */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Options de pagination
 */
export interface PaginationOptions {
  page?: number;
  limit?: number;
  offset?: number;
}

/**
 * Réponse paginée
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageCount: number;
}

/**
 * Filtre de recherche
 */
export interface SearchFilter {
  query?: string;
  status?: 'published' | 'draft' | 'archived';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Image générique
 */
export interface AppImage {
  id: string;
  url: string;
  title?: string;
  alt?: string;
  width?: number;
  height?: number;
}

/**
 * Coordonnées géographiques
 */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Adresse
 */
export interface Address {
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  coordinates?: Coordinates;
}
