import type { Database } from '@/src/shared/types/database.types';

export type Like = Database['public']['Tables']['likes']['Row'];
export type LikeInsert = Database['public']['Tables']['likes']['Insert'];
export type LikeUpdate = Database['public']['Tables']['likes']['Update'];

export interface LikeInfo {
  count: number;
  liked: boolean;
}

export interface ToggleLikeResult {
  liked: boolean;
  count: number;
}
