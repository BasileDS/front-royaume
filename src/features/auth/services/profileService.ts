import { supabase } from '@/src/core/api/supabase';
import {
  AuthError,
  UpdateEmailData,
  UpdatePasswordData,
  UpdateProfileData,
  UserProfile,
} from '../types';

/**
 * Service de gestion du profil utilisateur avec Supabase
 */
export class ProfileService {
  /**
   * Récupération du profil utilisateur actuel
   */
  static async getUserProfile(): Promise<UserProfile | null> {
    try {
      // Vérifier d'abord qu'il y a une session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Pas de session active, pas d'erreur à logger (cas normal si non connecté)
        return null;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', userError);
        return null;
      }

      // Récupérer les données depuis la table profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Erreur lors de la récupération du profil:', profileError);
        return null;
      }

      // Construire le profil avec les données de la table profiles
      const profile: UserProfile = {
        id: user.id,
        email: user.email || '',
        first_name: profileData?.first_name || '',
        last_name: profileData?.last_name || '',
        username: profileData?.username || '',
        birthdate: profileData?.birthdate || undefined,
        phone: profileData?.phone || '',
        avatar_url: profileData?.avatar_url || '',
        attached_establishment_id: profileData?.attached_establishment_id || null,
        created_at: user.created_at,
        updated_at: profileData?.updated_at || user.updated_at,
      };

      return profile;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      return null;
    }
  }

  /**
   * Mise à jour du profil utilisateur
   */
  static async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    try {
      // Récupérer l'utilisateur actuel
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new AuthError('Utilisateur non authentifié');
      }

      // Mettre à jour la table profiles avec les nouvelles données
      const { data: updatedProfile, error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          username: data.username,
          birthdate: data.birthdate,
          phone: data.phone,
          avatar_url: data.avatar_url,
          attached_establishment_id: data.attached_establishment_id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (profileError) {
        console.error('Erreur lors de la mise à jour du profil:', profileError);
        throw new AuthError(this.getErrorMessage(profileError.message));
      }

      // Retourner le profil mis à jour
      const profile: UserProfile = {
        id: user.id,
        email: user.email || '',
        first_name: updatedProfile.first_name || '',
        last_name: updatedProfile.last_name || '',
        username: updatedProfile.username || '',
        birthdate: updatedProfile.birthdate || undefined,
        phone: updatedProfile.phone || '',
        avatar_url: updatedProfile.avatar_url || '',
        attached_establishment_id: updatedProfile.attached_establishment_id || null,
        created_at: user.created_at,
        updated_at: updatedProfile.updated_at || user.updated_at,
      };

      return profile;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      console.error('Erreur updateProfile:', error);
      throw new AuthError('Une erreur est survenue lors de la mise à jour du profil.');
    }
  }

  /**
   * Mise à jour de l'email utilisateur
   */
  static async updateEmail({ email }: UpdateEmailData): Promise<void> {
    try {
      const { error } = await supabase.auth.updateUser({
        email: email,
      });

      if (error) {
        throw new AuthError(this.getErrorMessage(error.message), error.status?.toString());
      }
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError('Une erreur est survenue lors de la mise à jour de l\'email.');
    }
  }

  /**
   * Mise à jour du mot de passe
   */
  static async updatePassword({ newPassword }: UpdatePasswordData): Promise<void> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw new AuthError(this.getErrorMessage(error.message), error.status?.toString());
      }
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError('Une erreur est survenue lors de la mise à jour du mot de passe.');
    }
  }

  /**
   * Upload d'avatar (optionnel - pour une future implémentation)
   */
  static async uploadAvatar(userId: string, file: File | Blob): Promise<string> {
    try {
      const fileExt = 'jpg'; // Peut être détecté depuis le type MIME
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw new AuthError('Erreur lors du téléchargement de l\'avatar.');
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError('Une erreur est survenue lors du téléchargement de l\'avatar.');
    }
  }

  /**
   * Suppression d'avatar (optionnel - pour une future implémentation)
   */
  static async deleteAvatar(avatarUrl: string): Promise<void> {
    try {
      // Extraire le chemin du fichier depuis l'URL
      const urlParts = avatarUrl.split('/avatars/');
      if (urlParts.length < 2) {
        throw new AuthError('URL d\'avatar invalide.');
      }

      const filePath = `avatars/${urlParts[1]}`;

      const { error } = await supabase.storage
        .from('avatars')
        .remove([filePath]);

      if (error) {
        throw new AuthError('Erreur lors de la suppression de l\'avatar.');
      }
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError('Une erreur est survenue lors de la suppression de l\'avatar.');
    }
  }

  /**
   * Messages d'erreur personnalisés en français
   */
  private static getErrorMessage(errorMessage: string): string {
    const errorMessages: Record<string, string> = {
      'Email already exists': 'Cet email est déjà utilisé',
      'Password should be at least 6 characters': 'Le mot de passe doit contenir au moins 6 caractères',
      'Unable to validate email address: invalid format': 'Format d\'email invalide',
      'User not found': 'Utilisateur non trouvé',
      'New password should be different from the old password': 'Le nouveau mot de passe doit être différent de l\'ancien',
    };

    return errorMessages[errorMessage] || errorMessage;
  }
}
