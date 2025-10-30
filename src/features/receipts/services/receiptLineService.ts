import { supabase } from '@/src/core/api/supabase';
import { directus, readItem } from '@/src/core/api';
import type { ReceiptLine, ReceiptLineWithReceipt } from '../types/receiptLine.types';

/**
 * Service pour gérer les receipt_lines (lignes de paiement)
 */
export class ReceiptLineService {
  /**
   * Récupérer toutes les lignes de paiement d'un utilisateur via ses receipts
   */
  static async getUserReceiptLines(userId: string): Promise<ReceiptLineWithReceipt[]> {
    try {
      // D'abord récupérer les receipts de l'utilisateur
      const { data: receipts, error: receiptsError } = await supabase
        .from('receipts')
        .select('id, establishment_id, created_at, customer_id')
        .eq('customer_id', userId);

      if (receiptsError) {
        console.error('Erreur lors de la récupération des receipts:', receiptsError);
        throw receiptsError;
      }

      if (!receipts || receipts.length === 0) {
        return [];
      }

      const receiptIds = receipts.map(r => r.id);

      // Récupérer les receipt_lines associées
      const { data: receiptLines, error: linesError } = await supabase
        .from('receipt_lines')
        .select('*')
        .in('receipt_id', receiptIds)
        .order('created_at', { ascending: false });

      if (linesError) {
        console.error('Erreur lors de la récupération des receipt_lines:', linesError);
        throw linesError;
      }

      // Récupérer les IDs uniques des établissements
      const establishmentIds = [...new Set(receipts.map(r => r.establishment_id))];
      
      // Récupérer les noms des établissements depuis Directus
      const establishmentNames = await this.getEstablishmentNames(establishmentIds);

      // Joindre les données des receipts avec les receipt_lines
      const linesWithReceipt = (receiptLines || []).map(line => {
        const receipt = receipts.find(r => r.id === line.receipt_id);
        return {
          ...line,
          receipt: receipt ? {
            ...receipt,
            establishment_name: receipt.establishment_id 
              ? establishmentNames[receipt.establishment_id] 
              : null,
          } : null,
        };
      });

      return linesWithReceipt;
    } catch (error) {
      console.error('Erreur getUserReceiptLines:', error);
      return [];
    }
  }

  /**
   * Récupérer les noms des établissements depuis Directus
   */
  private static async getEstablishmentNames(ids: number[]): Promise<Record<number, string>> {
    const names: Record<number, string> = {};
    
    try {
      // Récupérer tous les établissements en parallèle
      const promises = ids.map(async (id) => {
        try {
          const establishment = await directus.request(
            readItem('establishments', id, {
              fields: ['id', 'title'],
            })
          );
          return { id, name: establishment.title };
        } catch (error) {
          console.error(`Erreur lors de la récupération de l'établissement ${id}:`, error);
          return { id, name: `Établissement #${id}` };
        }
      });

      const results = await Promise.all(promises);
      
      results.forEach(result => {
        names[result.id] = result.name;
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des noms d\'établissements:', error);
    }

    return names;
  }

  /**
   * Calculer le total dépensé par l'utilisateur via receipt_lines
   * Les montants sont en centimes, donc on divise par 100
   */
  static getTotalSpent(receiptLines: ReceiptLine[]): number {
    const totalInCents = receiptLines.reduce((total, line) => total + line.amount, 0);
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
      'cashback': 'Cashback',
      'coupon': 'Coupon',
    };
    return methods[method] || method;
  }

  /**
   * Vérifier si la méthode de paiement est cashback
   */
  static isCashbackPayment(method: string): boolean {
    return method === 'cashback';
  }
}
