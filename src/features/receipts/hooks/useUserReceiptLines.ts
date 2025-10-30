import { ReceiptLineService } from '../services/receiptLineService';
import type { ReceiptLineWithReceipt } from '../types/receiptLine.types';
import { useAuth } from '@/src/features/auth';
import { useEffect, useState } from 'react';

/**
 * Hook pour récupérer les receipt_lines d'un utilisateur
 */
export function useUserReceiptLines() {
  const { user } = useAuth();
  const [receiptLines, setReceiptLines] = useState<ReceiptLineWithReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadReceiptLines = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await ReceiptLineService.getUserReceiptLines(user.id);
        setReceiptLines(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
        console.error('Erreur lors du chargement des receipt_lines:', err);
      } finally {
        setLoading(false);
      }
    };

    loadReceiptLines();
  }, [user?.id]);

  return {
    receiptLines,
    loading,
    error,
    totalSpent: ReceiptLineService.getTotalSpent(receiptLines),
  };
}
