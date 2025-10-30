import { ReceiptService } from '../services/receiptService';
import type { ReceiptWithEstablishment } from '../types/receipt.types';
import { useAuth } from '@/src/features/auth';
import { useEffect, useState } from 'react';

/**
 * Hook pour récupérer les receipts d'un utilisateur
 */
export function useUserReceipts() {
  const { user } = useAuth();
  const [receipts, setReceipts] = useState<ReceiptWithEstablishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadReceipts = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await ReceiptService.getUserReceipts(user.id);
        setReceipts(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
        console.error('Erreur lors du chargement des receipts:', err);
      } finally {
        setLoading(false);
      }
    };

    loadReceipts();
  }, [user?.id]);

  return {
    receipts,
    loading,
    error,
    totalSpent: ReceiptService.getTotalSpent(receipts),
  };
}
