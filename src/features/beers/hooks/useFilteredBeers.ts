import { useMemo } from 'react';
import type { Beer, BeerFilterState, Brewery, BeerStyle } from '../types';

/**
 * Hook pour filtrer et trier les bières côté client
 */
export function useFilteredBeers(
  beers: Beer[],
  filters: BeerFilterState,
  userEstablishmentId?: number | null
): Beer[] {
  return useMemo(() => {
    let filtered = [...beers];

    // Filtrer par style (recherche insensible à la casse)
    if (filters.styleSearch.length > 0) {
      const searchLower = filters.styleSearch.toLowerCase();
      filtered = filtered.filter((beer) => {
        // Vérifier si le style est chargé en tant qu'objet
        if (typeof beer.style === 'object' && beer.style !== null) {
          const style = beer.style as BeerStyle;
          return style.title?.toLowerCase().includes(searchLower);
        }
        return false;
      });
    }

    // Filtrer par brasserie (recherche insensible à la casse)
    if (filters.brewerySearch.length > 0) {
      const searchLower = filters.brewerySearch.toLowerCase();
      filtered = filtered.filter((beer) => {
        // Vérifier si la brasserie est chargée en tant qu'objet
        if (typeof beer.brewery === 'object' && beer.brewery !== null) {
          const brewery = beer.brewery as Brewery;
          return brewery.title?.toLowerCase().includes(searchLower);
        }
        return false;
      });
    }

    // Filtrer par disponibilité dans l'établissement de référence
    if (filters.availableInMyEstablishment && userEstablishmentId) {
      filtered = filtered.filter((beer) => {
        // Vérifier si la bière est disponible dans l'établissement
        return beer.available_at?.includes(userEstablishmentId);
      });
    }

    // Trier par nombre de likes (descendant - plus populaires en premier)
    if (filters.sortByLikes) {
      filtered.sort((a, b) => {
        const likesA = a.likesCount ?? 0;
        const likesB = b.likesCount ?? 0;
        return likesB - likesA; // Ordre décroissant
      });
    }

    return filtered;
  }, [beers, filters, userEstablishmentId]);
}
