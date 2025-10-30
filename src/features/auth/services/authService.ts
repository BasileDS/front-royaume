import { supabase } from '@/src/core/api/supabase';
import {
    AuthError,
    LoginCredentials,
    ResetPasswordData,
    Session,
    SignUpCredentials,
    UpdatePasswordData,
    User,
} from '../types';

/**
 * Service d'authentification avec Supabase
 */
export class AuthService {
  /**
   * Connexion avec email et mot de passe
   */
  static async signIn({ email, password }: LoginCredentials): Promise<{ user: User; session: Session }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new AuthError(this.getErrorMessage(error.message), error.status?.toString());
      }

      if (!data.user || !data.session) {
        throw new AuthError('Échec de la connexion. Veuillez réessayer.');
      }

      return {
        user: data.user,
        session: data.session,
      };
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError('Une erreur est survenue lors de la connexion.');
    }
  }

  /**
   * Inscription avec email et mot de passe
   */
  static async signUp({ 
    email, 
    password, 
    firstName, 
    lastName, 
    username, 
    birthdate, 
    phone,
    establishmentId,
    avatarUrl
  }: SignUpCredentials): Promise<{ user: User; session: Session | null }> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            username: username,
            birthdate: birthdate,
            phone: phone,
            attached_establishment_id: establishmentId,
            avatar_url: avatarUrl,
          },
        },
      });

      if (error) {
        console.error('❌ Erreur Supabase signUp:', error);
        throw new AuthError(this.getErrorMessage(error.message), error.status?.toString());
      }

      if (!data.user) {
        console.error('❌ Pas d\'utilisateur retourné après signUp');
        throw new AuthError('Échec de l\'inscription. Veuillez réessayer.');
      }

      // Note: Le profil est créé automatiquement par un trigger SQL (on_auth_user_created)
      // qui s'exécute lors de l'insertion dans auth.users
      // Voir: supabase/migrations/create_profile_trigger.sql

      return {
        user: data.user,
        session: data.session,
      };
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError('Une erreur est survenue lors de l\'inscription.');
    }
  }

  /**
   * Déconnexion
   */
  static async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new AuthError(this.getErrorMessage(error.message), error.status?.toString());
      }
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError('Une erreur est survenue lors de la déconnexion.');
    }
  }

  /**
   * Récupération de la session actuelle
   */
  static async getSession(): Promise<Session | null> {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Erreur lors de la récupération de la session:', error);
        return null;
      }

      return data.session;
    } catch (error) {
      console.error('Erreur lors de la récupération de la session:', error);
      return null;
    }
  }

  /**
   * Récupération de l'utilisateur actuel
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        return null;
      }

      return data.user;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  }

  /**
   * Demande de réinitialisation de mot de passe
   */
  static async resetPassword({ email }: ResetPasswordData): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'royaumeparaiges://reset-password',
      });

      if (error) {
        throw new AuthError(this.getErrorMessage(error.message), error.status?.toString());
      }
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError('Une erreur est survenue lors de la réinitialisation du mot de passe.');
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
   * Écoute des changements d'état d'authentification
   */
  static onAuthStateChange(callback: (session: Session | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
  }

  /**
   * Messages d'erreur personnalisés en français
   */
  private static getErrorMessage(errorMessage: string): string {
    const errorMessages: Record<string, string> = {
      'Invalid login credentials': 'Email ou mot de passe incorrect',
      'Email not confirmed': 'Veuillez confirmer votre email avant de vous connecter',
      'User already registered': 'Un compte existe déjà avec cet email',
      'Password should be at least 6 characters': 'Le mot de passe doit contenir au moins 6 caractères',
      'Unable to validate email address: invalid format': 'Format d\'email invalide',
      'User not found': 'Utilisateur non trouvé',
      'Invalid email or password': 'Email ou mot de passe incorrect',
    };

    return errorMessages[errorMessage] || errorMessage;
  }
}
