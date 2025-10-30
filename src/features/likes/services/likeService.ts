import { supabase } from '@/src/core/api/supabase';
import type { Database } from '@/src/shared/types/database.types';

type LikeInsert = Database['public']['Tables']['likes']['Insert'];

/**
 * Service pour gérer les likes des différents contenus
 */
export class LikeService {
  /**
   * Obtenir le nombre de likes pour une news
   */
  static async getNewsLikesCount(newsId: number): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('news_id', newsId);

      if (error) {
        console.error('Erreur lors de la récupération du nombre de likes:', error);
        throw error;
      }

      return count || 0;
    } catch (error) {
      console.error('Erreur getNewsLikesCount:', error);
      return 0;
    }
  }

  /**
   * Vérifier si un utilisateur a liké une news
   */
  static async hasUserLikedNews(userId: string, newsId: number): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', userId)
        .eq('news_id', newsId)
        .maybeSingle();

      if (error) {
        console.error('Erreur lors de la vérification du like:', error);
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Erreur hasUserLikedNews:', error);
      return false;
    }
  }

  /**
   * Toggle le like d'une news (ajouter ou retirer)
   */
  static async toggleNewsLike(userId: string, newsId: number): Promise<{ liked: boolean; count: number }> {
    try {
      // Vérifier si le like existe déjà
      const { data: existingLike, error: checkError } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', userId)
        .eq('news_id', newsId)
        .maybeSingle();

      if (checkError) {
        console.error('Erreur lors de la vérification du like existant:', checkError);
        throw checkError;
      }

      let liked: boolean;

      if (existingLike) {
        // Retirer le like
        const { error: deleteError } = await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id);

        if (deleteError) {
          console.error('Erreur lors de la suppression du like:', deleteError);
          throw deleteError;
        }

        liked = false;
      } else {
        // Ajouter le like
        const newLike: LikeInsert = {
          user_id: userId,
          news_id: newsId,
        };

        const { error: insertError } = await supabase
          .from('likes')
          .insert(newLike);

        if (insertError) {
          console.error('Erreur lors de l\'ajout du like:', insertError);
          throw insertError;
        }

        liked = true;
      }

      // Récupérer le nouveau nombre de likes
      const count = await this.getNewsLikesCount(newsId);

      return { liked, count };
    } catch (error) {
      console.error('Erreur toggleNewsLike:', error);
      throw error;
    }
  }

  /**
   * Obtenir toutes les infos de like pour une news et un utilisateur
   */
  static async getNewsLikeInfo(userId: string | null, newsId: number): Promise<{ count: number; liked: boolean }> {
    try {
      const count = await this.getNewsLikesCount(newsId);
      const liked = userId ? await this.hasUserLikedNews(userId, newsId) : false;

      return { count, liked };
    } catch (error) {
      console.error('Erreur getNewsLikeInfo:', error);
      return { count: 0, liked: false };
    }
  }

  /**
   * Obtenir le nombre de likes pour une bière
   */
  static async getBeerLikesCount(beerId: number): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('beer_id', beerId);

      if (error) {
        console.error('Erreur lors de la récupération du nombre de likes de bière:', error);
        throw error;
      }

      return count || 0;
    } catch (error) {
      console.error('Erreur getBeerLikesCount:', error);
      return 0;
    }
  }

  /**
   * Obtenir le nombre de likes pour plusieurs bières en une seule requête
   * Retourne un Map avec beer_id => count
   */
  static async getBeersLikesCount(beerIds: number[]): Promise<Map<number, number>> {
    try {
      if (beerIds.length === 0) {
        return new Map();
      }

      const { data, error } = await supabase
        .from('likes')
        .select('beer_id')
        .in('beer_id', beerIds)
        .not('beer_id', 'is', null);

      if (error) {
        console.error('Erreur lors de la récupération des likes des bières:', error);
        throw error;
      }

      // Compter les likes par bière
      const likesMap = new Map<number, number>();
      
      // Initialiser toutes les bières à 0
      beerIds.forEach(id => likesMap.set(id, 0));
      
      // Compter les likes
      if (data) {
        data.forEach((like) => {
          if (like.beer_id) {
            const currentCount = likesMap.get(like.beer_id) || 0;
            likesMap.set(like.beer_id, currentCount + 1);
          }
        });
      }

      return likesMap;
    } catch (error) {
      console.error('Erreur getBeersLikesCount:', error);
      return new Map();
    }
  }

  /**
   * Toggle le like d'une bière
   */
  static async toggleBeerLike(userId: string, beerId: number): Promise<{ liked: boolean; count: number }> {
    try {
      const { data: existingLike, error: checkError } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', userId)
        .eq('beer_id', beerId)
        .maybeSingle();

      if (checkError) {
        console.error('Erreur lors de la vérification du like de bière:', checkError);
        throw checkError;
      }

      let liked: boolean;

      if (existingLike) {
        const { error: deleteError } = await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id);

        if (deleteError) {
          console.error('Erreur lors de la suppression du like de bière:', deleteError);
          throw deleteError;
        }

        liked = false;
      } else {
        const newLike: LikeInsert = {
          user_id: userId,
          beer_id: beerId,
        };

        const { error: insertError } = await supabase
          .from('likes')
          .insert(newLike);

        if (insertError) {
          console.error('Erreur lors de l\'ajout du like de bière:', insertError);
          throw insertError;
        }

        liked = true;
      }

      const count = await this.getBeerLikesCount(beerId);

      return { liked, count };
    } catch (error) {
      console.error('Erreur toggleBeerLike:', error);
      throw error;
    }
  }

  /**
   * Vérifier si un utilisateur a liké une bière
   */
  static async hasUserLikedBeer(userId: string, beerId: number): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', userId)
        .eq('beer_id', beerId)
        .maybeSingle();

      if (error) {
        console.error('Erreur lors de la vérification du like de bière:', error);
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Erreur hasUserLikedBeer:', error);
      return false;
    }
  }

  /**
   * Obtenir toutes les infos de like pour une bière et un utilisateur
   */
  static async getBeerLikeInfo(userId: string | null, beerId: number): Promise<{ count: number; liked: boolean }> {
    try {
      const count = await this.getBeerLikesCount(beerId);
      const liked = userId ? await this.hasUserLikedBeer(userId, beerId) : false;

      return { count, liked };
    } catch (error) {
      console.error('Erreur getBeerLikeInfo:', error);
      return { count: 0, liked: false };
    }
  }

  /**
   * Obtenir le nombre de likes pour une quête
   */
  static async getQuestLikesCount(questId: number): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('quest_id', questId);

      if (error) {
        console.error('Erreur lors de la récupération du nombre de likes de quête:', error);
        throw error;
      }

      return count || 0;
    } catch (error) {
      console.error('Erreur getQuestLikesCount:', error);
      return 0;
    }
  }

  /**
   * Toggle le like d'une quête
   */
  static async toggleQuestLike(userId: string, questId: number): Promise<{ liked: boolean; count: number }> {
    try {
      const { data: existingLike, error: checkError } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', userId)
        .eq('quest_id', questId)
        .maybeSingle();

      if (checkError) {
        console.error('Erreur lors de la vérification du like de quête:', checkError);
        throw checkError;
      }

      let liked: boolean;

      if (existingLike) {
        const { error: deleteError } = await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id);

        if (deleteError) {
          console.error('Erreur lors de la suppression du like de quête:', deleteError);
          throw deleteError;
        }

        liked = false;
      } else {
        const newLike: LikeInsert = {
          user_id: userId,
          quest_id: questId,
        };

        const { error: insertError } = await supabase
          .from('likes')
          .insert(newLike);

        if (insertError) {
          console.error('Erreur lors de l\'ajout du like de quête:', insertError);
          throw insertError;
        }

        liked = true;
      }

      const count = await this.getQuestLikesCount(questId);

      return { liked, count };
    } catch (error) {
      console.error('Erreur toggleQuestLike:', error);
      throw error;
    }
  }
}
