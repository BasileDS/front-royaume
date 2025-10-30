/**
 * Beers Feature Module
 * 
 * Ce module gère toute la fonctionnalité des bières :
 * - Récupération depuis Directus
 * - Affichage des cartes
 * - Gestion d'état via hooks
 * - Page de détail individuelle
 * - Système de likes
 * - Système de commentaires
 * 
 * Usage:
 * ```typescript
 * // Liste de bières
 * import { useBeers, BeerCard } from '@/features/beers';
 * 
 * function BeersScreen() {
 *   const { beers, loading, error, refresh } = useBeers();
 *   
 *   return (
 *     <FlatList
 *       data={beers}
 *       renderItem={({ item }) => <BeerCard beer={item} />}
 *       onRefresh={refresh}
 *       refreshing={loading}
 *     />
 *   );
 * }
 * 
 * // Détail d'une bière avec likes et commentaires
 * import { useBeer, BeerLikeButton, BeerCommentsSection } from '@/features/beers';
 * 
 * function BeerDetailScreen({ id }: { id: number }) {
 *   const { beer, loading, error } = useBeer(id);
 *   
 *   if (loading) return <ActivityIndicator />;
 *   if (!beer) return <Text>Bière introuvable</Text>;
 *   
 *   return (
 *     <View>
 *       <Text>{beer.title}</Text>
 *       <BeerLikeButton beerId={beer.id} />
 *       <BeerCommentsSection beerId={beer.id} />
 *     </View>
 *   );
 * }
 * ```
 */

// Public API
export * from './components';
export * from './hooks';
export { beerService } from './services';
export * from './types';

