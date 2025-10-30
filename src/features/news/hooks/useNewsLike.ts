import { useAuth } from '@/features/auth';
import { useEffect, useState } from 'react';
import { newsInteractionsService } from '../services';

export function useNewsLike(newsId: string) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id && newsId) {
      loadLikeData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newsId, user?.id]);

  const loadLikeData = async () => {
    if (!user?.id || !newsId) return;
    
    try {
      const [hasLiked, count] = await Promise.all([
        newsInteractionsService.hasUserLiked(newsId, user.id),
        newsInteractionsService.getLikesCount(newsId),
      ]);
      
      setLiked(hasLiked);
      setLikesCount(count);
    } catch (error) {
      console.error('Error loading like data:', error);
    }
  };

  const toggleLike = async () => {
    if (!user?.id || !newsId || loading) return;
    
    setLoading(true);
    try {
      const isLiked = await newsInteractionsService.toggleLike(newsId, user.id);
      setLiked(isLiked);
      setLikesCount(prev => isLiked ? prev + 1 : prev - 1);
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    liked,
    likesCount,
    loading,
    toggleLike,
  };
}
