import type { Database } from '@/src/shared/types/database.types';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Récupération des variables d'environnement
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase URL et Anon Key sont requis. ' +
    'Veuillez configurer EXPO_PUBLIC_SUPABASE_URL et EXPO_PUBLIC_SUPABASE_ANON_KEY dans votre fichier .env'
  );
}

/**
 * Client Supabase typé pour les opérations READ/WRITE
 * - Profils utilisateurs
 * - Likes et commentaires
 * - Notes et avis
 * - Données personnalisées
 * - Statistiques utilisateur
 * - Progression des quêtes
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Configuration de l'authentification
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Types pour l'authentification (compatibilité)
export type User = {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
};

export type Session = {
  access_token: string;
  refresh_token: string;
  user: User;
};

// Types des tables (réexportés depuis database.types.ts)
export type Tables = Database['public']['Tables'];
export type TableName = keyof Tables;

// Types pour chaque table
export type Profile = Tables['profiles']['Row'];
export type ProfileInsert = Tables['profiles']['Insert'];
export type ProfileUpdate = Tables['profiles']['Update'];

export type Like = Tables['likes']['Row'];
export type LikeInsert = Tables['likes']['Insert'];
export type LikeUpdate = Tables['likes']['Update'];

export type Comment = Tables['comments']['Row'];
export type CommentInsert = Tables['comments']['Insert'];
export type CommentUpdate = Tables['comments']['Update'];

export type Receipt = Tables['receipts']['Row'];
export type ReceiptInsert = Tables['receipts']['Insert'];
export type ReceiptUpdate = Tables['receipts']['Update'];

export type Coupon = Tables['coupons']['Row'];
export type CouponInsert = Tables['coupons']['Insert'];
export type CouponUpdate = Tables['coupons']['Update'];

export type Spending = Tables['spendings']['Row'];
export type SpendingInsert = Tables['spendings']['Insert'];
export type SpendingUpdate = Tables['spendings']['Update'];

export type Note = Tables['notes']['Row'];
export type NoteInsert = Tables['notes']['Insert'];
export type NoteUpdate = Tables['notes']['Update'];

// Types d'énumérations
export type PaymentMethod = Database['public']['Enums']['payment_method'];
