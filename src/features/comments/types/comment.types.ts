import type { Database } from '@/src/shared/types/database.types';

export type Comment = Database['public']['Tables']['comments']['Row'];
export type CommentInsert = Database['public']['Tables']['comments']['Insert'];
export type CommentUpdate = Database['public']['Tables']['comments']['Update'];

/**
 * Commentaire enrichi avec les informations de l'utilisateur
 */
export interface CommentWithUser extends Comment {
  user_email?: string;
  user_first_name?: string;
  user_last_name?: string;
  user_username?: string;
  user_avatar_url?: string;
}
