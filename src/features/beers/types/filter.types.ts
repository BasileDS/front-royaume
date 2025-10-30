/**
 * État des filtres pour les bières
 */
export interface BeerFilterState {
  /** Recherche par style de bière */
  styleSearch: string;
  /** Recherche par brasserie */
  brewerySearch: string;
  /** Trier par nombre de likes (descendant) */
  sortByLikes: boolean;
  /** Filtrer par disponibilité dans l'établissement de référence */
  availableInMyEstablishment: boolean;
}

/**
 * État initial des filtres
 */
export const initialFilterState: BeerFilterState = {
  styleSearch: '',
  brewerySearch: '',
  sortByLikes: false,
  availableInMyEstablishment: false,
};

/**
 * Vérifier si des filtres sont actifs
 */
export function hasActiveFilters(filters: BeerFilterState): boolean {
  return (
    filters.styleSearch.length > 0 ||
    filters.brewerySearch.length > 0 ||
    filters.sortByLikes ||
    filters.availableInMyEstablishment
  );
}

/**
 * Compter le nombre de filtres actifs
 */
export function countActiveFilters(filters: BeerFilterState): number {
  let count = 0;
  if (filters.styleSearch.length > 0) count++;
  if (filters.brewerySearch.length > 0) count++;
  if (filters.sortByLikes) count++;
  if (filters.availableInMyEstablishment) count++;
  return count;
}
