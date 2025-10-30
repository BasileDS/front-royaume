import { supabase } from '@/src/core/api/supabase';
import type { Database } from '@/src/shared/types/database.types';
import type { CommentWithUser } from '../types';

type Comment = Database['public']['Tables']['comments']['Row'];
type CommentInsert = Database['public']['Tables']['comments']['Insert'];

/**
 * Service pour gérer les commentaires des différents contenus
 */
export class CommentService {
  /**
   * Obtenir le nombre de commentaires pour une news
   */
  static async getNewsCommentsCount(newsId: number): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('news_id', newsId)
        .eq('hidden', false); // Ne compter que les commentaires visibles

      if (error) {
        console.error('Erreur lors de la récupération du nombre de commentaires:', error);
        throw error;
      }

      return count || 0;
    } catch (error) {
      console.error('Erreur getNewsCommentsCount:', error);
      return 0;
    }
  }

  /**
   * Obtenir les commentaires d'une news avec les informations utilisateur
   */
  static async getNewsComments(newsId: number): Promise<CommentWithUser[]> {
    try {
      const { data: comments, error } = await supabase
        .from('comments')
        .select('*')
        .eq('news_id', newsId)
        .eq('hidden', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des commentaires:', error);
        throw error;
      }

      if (!comments || comments.length === 0) {
        return [];
      }

      // Récupérer les IDs uniques des utilisateurs
      const userIds = [...new Set(comments.map(c => c.customer_id))];
      
      // Récupérer les informations utilisateur via la fonction RPC
      const { data: usersData, error: usersError } = await supabase
        .rpc('get_user_info', { user_ids: userIds });

      if (usersError) {
        console.error('Erreur lors de la récupération des infos utilisateur:', usersError);
        // Continuer sans les infos utilisateur si erreur
      }

      // Créer un map des utilisateurs
      const usersMap = new Map();
      if (usersData) {
        usersData.forEach((user: any) => {
          usersMap.set(user.id, {
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            avatar_url: user.avatar_url,
          });
        });
      }

      // Enrichir les commentaires avec les infos utilisateur
      const enrichedComments: CommentWithUser[] = comments.map(comment => {
        const userInfo = usersMap.get(comment.customer_id);
        return {
          ...comment,
          user_email: userInfo?.email,
          user_first_name: userInfo?.first_name,
          user_last_name: userInfo?.last_name,
          user_username: userInfo?.username,
          user_avatar_url: userInfo?.avatar_url,
        };
      });

      return enrichedComments;
    } catch (error) {
      console.error('Erreur getNewsComments:', error);
      return [];
    }
  }

  /**
   * Obtenir le nombre de commentaires pour une bière
   */
  static async getBeerCommentsCount(beerId: number): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('beer_id', beerId)
        .eq('hidden', false);

      if (error) {
        console.error('Erreur lors de la récupération du nombre de commentaires de bière:', error);
        throw error;
      }

      return count || 0;
    } catch (error) {
      console.error('Erreur getBeerCommentsCount:', error);
      return 0;
    }
  }

  /**
   * Obtenir les commentaires d'une bière avec les informations utilisateur
   */
  static async getBeerComments(beerId: number): Promise<CommentWithUser[]> {
    try {
      const { data: comments, error } = await supabase
        .from('comments')
        .select('*')
        .eq('beer_id', beerId)
        .eq('hidden', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des commentaires de bière:', error);
        throw error;
      }

      if (!comments || comments.length === 0) {
        return [];
      }

      // Récupérer les IDs uniques des utilisateurs
      const userIds = [...new Set(comments.map(c => c.customer_id))];
      
      // Récupérer les informations utilisateur via la fonction RPC
      const { data: usersData, error: usersError } = await supabase
        .rpc('get_user_info', { user_ids: userIds });

      if (usersError) {
        console.error('Erreur lors de la récupération des infos utilisateur:', usersError);
        // Continuer sans les infos utilisateur si erreur
      }

      // Créer un map des utilisateurs
      const usersMap = new Map();
      if (usersData) {
        usersData.forEach((user: any) => {
          usersMap.set(user.id, {
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            avatar_url: user.avatar_url,
          });
        });
      }

      // Enrichir les commentaires avec les infos utilisateur
      const enrichedComments: CommentWithUser[] = comments.map(comment => {
        const userInfo = usersMap.get(comment.customer_id);
        return {
          ...comment,
          user_email: userInfo?.email,
          user_first_name: userInfo?.first_name,
          user_last_name: userInfo?.last_name,
          user_username: userInfo?.username,
          user_avatar_url: userInfo?.avatar_url,
        };
      });

      return enrichedComments;
    } catch (error) {
      console.error('Erreur getBeerComments:', error);
      return [];
    }
  }

  /**
   * Obtenir le nombre de commentaires pour une quête
   */
  static async getQuestCommentsCount(questId: number): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('quest_id', questId)
        .eq('hidden', false);

      if (error) {
        console.error('Erreur lors de la récupération du nombre de commentaires de quête:', error);
        throw error;
      }

      return count || 0;
    } catch (error) {
      console.error('Erreur getQuestCommentsCount:', error);
      return 0;
    }
  }

  /**
   * Obtenir le nombre de commentaires pour un établissement
   */
  static async getEstablishmentCommentsCount(establishmentId: number): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('establishment_id', establishmentId)
        .eq('hidden', false);

      if (error) {
        console.error('Erreur lors de la récupération du nombre de commentaires d\'établissement:', error);
        throw error;
      }

      return count || 0;
    } catch (error) {
      console.error('Erreur getEstablishmentCommentsCount:', error);
      return 0;
    }
  }

  /**
   * Ajouter un commentaire à une news
   */
  static async addNewsComment(userId: string, newsId: number, content: string): Promise<Comment> {
    try {
      const newComment: CommentInsert = {
        customer_id: userId,
        news_id: newsId,
        content: content,
        hidden: false,
      };

      const { data, error } = await supabase
        .from('comments')
        .insert(newComment)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de l\'ajout du commentaire:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Aucune donnée retournée après l\'ajout du commentaire');
      }

      return data;
    } catch (error) {
      console.error('Erreur addNewsComment:', error);
      throw error;
    }
  }

  /**
   * Ajouter un commentaire à une bière
   */
  static async addBeerComment(userId: string, beerId: number, content: string): Promise<Comment> {
    try {
      const newComment: CommentInsert = {
        customer_id: userId,
        beer_id: beerId,
        content: content,
        hidden: false,
      };

      const { data, error } = await supabase
        .from('comments')
        .insert(newComment)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de l\'ajout du commentaire de bière:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Aucune donnée retournée après l\'ajout du commentaire');
      }

      return data;
    } catch (error) {
      console.error('Erreur addBeerComment:', error);
      throw error;
    }
  }

  /**
   * Ajouter un commentaire à une quête
   */
  static async addQuestComment(userId: string, questId: number, content: string): Promise<Comment> {
    try {
      const newComment: CommentInsert = {
        customer_id: userId,
        quest_id: questId,
        content: content,
        hidden: false,
      };

      const { data, error } = await supabase
        .from('comments')
        .insert(newComment)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de l\'ajout du commentaire de quête:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Aucune donnée retournée après l\'ajout du commentaire');
      }

      return data;
    } catch (error) {
      console.error('Erreur addQuestComment:', error);
      throw error;
    }
  }
}
