import { Session as SupabaseSession, User as SupabaseUser } from '@supabase/supabase-js';

/**
 * Type pour l'utilisateur authentifié
 */
export type User = SupabaseUser;

/**
 * Type pour la session utilisateur
 */
export type Session = SupabaseSession;

/**
 * Type pour les données de connexion
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Type pour les données d'inscription
 */
export interface SignUpCredentials {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  birthdate?: string;
  phone?: string;
  establishmentId?: number;
  avatarUrl?: string;
}

/**
 * Type pour la réinitialisation de mot de passe
 */
export interface ResetPasswordData {
  email: string;
}

/**
 * Type pour le changement de mot de passe
 */
export interface UpdatePasswordData {
  newPassword: string;
}

/**
 * Type pour le profil utilisateur
 */
export interface UserProfile {
  id: string;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  birthdate?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  attached_establishment_id?: number | null;
  role?: string;
  created_at?: string;
  updated_at?: string | null;
}

/**
 * Type pour la mise à jour du profil utilisateur
 */
export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  username?: string;
  birthdate?: string;
  phone?: string;
  avatar_url?: string;
  attached_establishment_id?: number | null;
}

/**
 * Type pour la mise à jour de l'email
 */
export interface UpdateEmailData {
  email: string;
}

/**
 * Type pour l'état d'authentification
 */
export interface AuthState {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  initialized: boolean;
}

/**
 * Erreurs d'authentification personnalisées
 */
export class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthError';
  }
}
