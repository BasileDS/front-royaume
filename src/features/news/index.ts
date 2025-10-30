/**
 * News Feature Module
 * 
 * Ce module gère toute la fonctionnalité des actualités :
 * - Récupération depuis Directus
 * - Affichage des cartes
 * - Gestion d'état via hooks
 * 
 * Usage:
 * ```typescript
 * import { useNews, NewsCard } from '@/features/news';
 * 
 * function NewsScreen() {
 *   const { news, loading, error, refresh } = useNews();
 *   
 *   return (
 *     <FlatList
 *       data={news}
 *       renderItem={({ item }) => <NewsCard news={item} />}
 *       onRefresh={refresh}
 *       refreshing={loading}
 *     />
 *   );
 * }
 * ```
 */

// Public API
export * from './components';
export * from './hooks';
export { newsService } from './services';
export * from './types';

