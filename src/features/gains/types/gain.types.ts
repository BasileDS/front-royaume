import type { Database } from '@/src/shared/types/database.types';

export type Gain = Database['public']['Tables']['gains']['Row'];

export interface UserStats {
  totalXP: number;
  totalCashback: number;
  gainsCount: number;
}
