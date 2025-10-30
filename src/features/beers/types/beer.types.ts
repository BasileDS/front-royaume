import type { Beers, Breweries, Styles } from '@/core/api';

/**
 * Type pour une bière depuis Directus
 * Étend le type auto-généré pour supporter les relations chargées
 */
export type Beer = Beers & {
  brewery?: number | Brewery;
  style?: number | BeerStyle;
  likesCount?: number; // Nombre de likes (enrichi depuis Supabase)
};

/**
 * Type pour une brasserie depuis Directus
 */
export type Brewery = Breweries;

/**
 * Type pour un style de bière depuis Directus
 */
export type BeerStyle = Styles;

/**
 * Options de filtre pour les bières
 */
export interface BeerFilters {
  search?: string;
  brewery?: number;
  style?: number;
  available_at?: number;
  limit?: number;
  offset?: number;
}
