import { supabase } from '@/src/core/api/supabase';
import type { Receipt } from '../types/receipt.types';

/**
 * Service pour gérer les receipts (reçus/commandes)
 */
export class ReceiptService {
  /**
   * Récupérer tous les receipts d'un utilisateur
   */
  static async getUserReceipts(userId: string): Promise<Receipt[]> {
    try {
      const { data: receipts, error } = await supabase
        .from('receipts')
        .select('*')
        .eq('customer_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des receipts:', error);
        throw error;
      }

      return receipts || [];
    } catch (error) {
      console.error('Erreur getUserReceipts:', error);
      return [];
    }
  }

  /**
   * Calculer le total dépensé par l'utilisateur
   * Les montants sont en centimes, donc on divise par 100
   */
  static getTotalSpent(receipts: Receipt[]): number {
    const totalInCents = receipts.reduce((total, receipt) => total + receipt.amount, 0);
    return totalInCents / 100;
  }

  /**
   * Formater le montant en euros
   * Le montant est en centimes, donc on divise par 100
   */
  static formatAmount(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount / 100);
  }

  /**
   * Formater la méthode de paiement
   */
  static formatPaymentMethod(method: string): string {
    const methods: Record<string, string> = {
      'card': 'Carte bancaire',
      'cash': 'Espèces',
      'app': 'Application',
      'other': 'Autre',
    };
    return methods[method] || method;
  }
}
