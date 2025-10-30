import type { Database } from '@/src/shared/types/database.types';

export type ReceiptLine = Database['public']['Tables']['receipt_lines']['Row'];
export type PaymentMethod = Database['public']['Enums']['payment_method'];

// Type étendu avec les données du receipt parent
export interface ReceiptLineWithReceipt extends ReceiptLine {
  receipt: {
    id: number;
    establishment_id: number;
    establishment_name?: string | null;
    created_at: string;
    customer_id: string;
  } | null;
}
