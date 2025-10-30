import { supabase } from '@/core/api/supabase';

export interface NewsStats {
  likes_count: number;
  comments_count: number;
  user_has_liked: boolean;
}

class NewsInteractionsService {
  /**
   * Récupère les statistiques d'une news (likes, comments, user_has_liked)
   */
  async getNewsStats(newsId: string, userId: string): Promise<NewsStats> {
    try {
      // Compter les likes
      const { count: likesCount, error: likesError } = await supabase
        .from('likes' as any)
        .select('*', { count: 'exact', head: true })
        .eq('news_id', newsId);

      if (likesError) throw likesError;

      // Compter les commentaires
      const { count: commentsCount, error: commentsError } = await supabase
        .from('comments' as any)
        .select('*', { count: 'exact', head: true })
        .eq('news_id', newsId);

      if (commentsError) throw commentsError;

      // Vérifier si l'utilisateur a liké
      const { data: userLike, error: userLikeError } = await supabase
        .from('likes' as any)
        .select('id')
        .eq('news_id', newsId)
        .eq('user_id', userId)
        .single();

      if (userLikeError && userLikeError.code !== 'PGRST116') {
        throw userLikeError;
      }

      return {
        likes_count: likesCount || 0,
        comments_count: commentsCount || 0,
        user_has_liked: !!userLike,
      };
    } catch (error) {
      console.error('Error fetching news stats:', error);
      return {
        likes_count: 0,
        comments_count: 0,
        user_has_liked: false,
      };
    }
  }

  /**
   * Toggle le like d'une news
   */
  async toggleLike(newsId: string, userId: string): Promise<boolean> {
    try {
      // Vérifier si le like existe déjà
      const { data: existingLike, error: checkError } = await supabase
        .from('likes' as any)
        .select('id')
        .eq('news_id', newsId)
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingLike) {
        // Supprimer le like
        const { error: deleteError } = await supabase
          .from('likes' as any)
          .delete()
          .eq('id', (existingLike as any).id);

        if (deleteError) throw deleteError;
        return false; // Unlike
      } else {
        // Ajouter le like
        const { error: insertError } = await supabase
          .from('likes' as any)
          .insert({
            news_id: newsId,
            user_id: userId,
          });

        if (insertError) throw insertError;
        return true; // Liked
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  }

  /**
   * Récupère le nombre de likes d'une news
   */
  async getLikesCount(newsId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('likes' as any)
        .select('*', { count: 'exact', head: true })
        .eq('news_id', newsId);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error fetching likes count:', error);
      return 0;
    }
  }

  /**
   * Vérifie si l'utilisateur a liké une news
   */
  async hasUserLiked(newsId: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('likes' as any)
        .select('id')
        .eq('news_id', newsId)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking user like:', error);
      return false;
    }
  }
}

export const newsInteractionsService = new NewsInteractionsService();
