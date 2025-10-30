import React, { createContext, useCallback, useEffect, useState } from 'react';
import { AuthService, ProfileService } from '../services';
import { AuthState, Session, SignUpCredentials, User, UserProfile } from '../types';

/**
 * Interface du contexte d'authentification
 */
interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, profileData: Omit<SignUpCredentials, 'email' | 'password'>) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

/**
 * Contexte d'authentification
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider d'authentification
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  /**
   * Initialisation de la session au montage
   */
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const currentSession = await AuthService.getSession();
        
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user || null);
          
          // Récupérer le profil utilisateur si connecté
          if (currentSession?.user) {
            const profile = await ProfileService.getUserProfile();
            setUserProfile(profile);
          }
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
      } finally {
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  /**
   * Écoute des changements d'état d'authentification
   */
  useEffect(() => {
    const { data: authListener } = AuthService.onAuthStateChange(async (newSession) => {
      setSession(newSession);
      setUser(newSession?.user || null);
      setLoading(false);
      
      // Récupérer le profil si l'utilisateur est connecté, sinon le réinitialiser
      if (newSession?.user) {
        const profile = await ProfileService.getUserProfile();
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  /**
   * Connexion
   */
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user: newUser, session: newSession } = await AuthService.signIn({
        email,
        password,
      });
      setUser(newUser);
      setSession(newSession);
      
      // Récupérer le profil après connexion
      if (newUser) {
        const profile = await ProfileService.getUserProfile();
        setUserProfile(profile);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Inscription
   */
  const signUp = useCallback(async (
    email: string, 
    password: string, 
    profileData: Omit<SignUpCredentials, 'email' | 'password'>
  ) => {
    try {
      setLoading(true);
      const { user: newUser, session: newSession } = await AuthService.signUp({
        email,
        password,
        ...profileData,
      });
      setUser(newUser);
      setSession(newSession);
      
      // Récupérer le profil après inscription
      if (newUser) {
        const profile = await ProfileService.getUserProfile();
        setUserProfile(profile);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Déconnexion
   */
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      await AuthService.signOut();
      setUser(null);
      setSession(null);
      setUserProfile(null);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Réinitialisation du mot de passe
   */
  const resetPassword = useCallback(async (email: string) => {
    try {
      await AuthService.resetPassword({ email });
    } catch (error) {
      throw error;
    }
  }, []);

  /**
   * Mise à jour du mot de passe
   */
  const updatePassword = useCallback(async (newPassword: string) => {
    try {
      await AuthService.updatePassword({ newPassword });
    } catch (error) {
      throw error;
    }
  }, []);

  /**
   * Rafraîchir le profil utilisateur
   */
  const refreshProfile = useCallback(async () => {
    try {
      const profile = await ProfileService.getUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du profil:', error);
    }
  }, []);

  const value: AuthContextType = {
    user,
    session,
    userProfile,
    loading,
    initialized,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
