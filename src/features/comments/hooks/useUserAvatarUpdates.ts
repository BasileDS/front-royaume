import { supabase } from '@/src/core/api/supabase';
import { useEffect, useState } from 'react';

/**
 * Hook pour écouter les changements d'avatar d'un utilisateur spécifique
 * Peut être utilisé pour rafraîchir automatiquement les commentaires
 */
export function useUserAvatarUpdates(userId?: string) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    // Récupérer l'avatar initial
    const fetchAvatar = async () => {
      const { data } = await supabase
        .rpc('get_user_info', { user_ids: [userId] });
      
      if (data && data.length > 0) {
        setAvatarUrl(data[0].avatar_url);
      }
    };

    fetchAvatar();

    // Note: Supabase Realtime ne supporte pas directement auth.users
    // Donc on utilise un polling léger ou on se fie au rechargement de page
    // Pour une vraie solution temps réel, il faudrait une table profiles synchronisée

  }, [userId]);

  return { avatarUrl };
}

/**
 * Hook pour forcer le rechargement des commentaires
 * Utile après l'upload d'un avatar
 */
export function useRefreshComments() {
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return { refreshKey, refresh };
}
