import type { Database } from '@/src/shared/types/database.types';

export type Receipt = Database['public']['Tables']['receipts']['Row'];
export type PaymentMethod = Database['public']['Enums']['payment_method'];

