/**
 * Establishments Feature Module
 * 
 * Ce module gère toute la fonctionnalité des établissements :
 * - Récupération depuis Directus
 * - Affichage des cartes
 * - Gestion d'état via hooks
 * 
 * Usage:
 * ```typescript
 * import { useEstablishments, EstablishmentCard } from '@/src/features/establishments';
 * 
 * function EstablishmentsScreen() {
 *   const { establishments, loading, error, refresh } = useEstablishments();
 *   
 *   return (
 *     <FlatList
 *       data={establishments}
 *       renderItem={({ item }) => <EstablishmentCard establishment={item} />}
 *       onRefresh={refresh}
 *       refreshing={loading}
 *     />
 *   );
 * }
 * ```
 */

// Export components
export { EstablishmentCard } from './components/EstablishmentCard';

// Export hooks
export { useEstablishments, useEstablishment } from './hooks/useEstablishments';

// Export services
export { establishmentService } from './services/establishmentService';

// Export types
export type { Establishment, EstablishmentFilters } from './types/establishment.types';



