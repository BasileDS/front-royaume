import { createDirectus, readItem, readItems, rest } from '@directus/sdk';
import Constants from 'expo-constants';

// Import des types auto-générés depuis Directus
export type {
  Beers,
  Breweries,
  Establishments,
  News,
  Quests,
  Styles,
  BeersEstablishments,
  NewsEstablishments,
  LevelThresholds,
  DirectusSchema,
} from '@/shared/types/directus-generated';

// Récupération de l'URL Directus
const directusUrl = Constants.expoConfig?.extra?.directusUrl || process.env.EXPO_PUBLIC_DIRECTUS_URL || 'https://paraiges-directus.neodelta.dev';

/**
 * Client Directus pour les données READ ONLY
 * - Bières (catalog)
 * - Établissements
 * - Actualités
 * - Événements
 * - Quêtes
 * - Level Thresholds
 */
export const directus = createDirectus(directusUrl).with(rest());

// Type pour les images Directus (utilisé pour les helpers)
export interface DirectusImage {
  id: string;
  title?: string;
  filename_disk: string;
  filename_download: string;
  type: string;
  width?: number;
  height?: number;
}

/**
 * Helper pour construire l'URL d'une image Directus
 */
export function getDirectusImageUrl(imageId: string | DirectusImage, options?: {
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'inside' | 'outside';
  quality?: number;
}): string {
  const id = typeof imageId === 'string' ? imageId : imageId.id;
  
  const params = new URLSearchParams();
  if (options?.width) params.append('width', options.width.toString());
  if (options?.height) params.append('height', options.height.toString());
  if (options?.fit) params.append('fit', options.fit);
  if (options?.quality) params.append('quality', options.quality.toString());
  
  const queryString = params.toString();
  return `${directusUrl}/assets/${id}${queryString ? `?${queryString}` : ''}`;
}

// Export des méthodes utiles
export { readItem, readItems };

