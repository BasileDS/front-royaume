import { supabase } from '@/src/core/api/supabase';
import type { Gain, UserStats } from '../types/gain.types';

/**
 * Service pour gérer les gains (XP et cashback)
 */
export class GainService {
  /**
   * Récupérer tous les gains d'un utilisateur via ses receipts
   */
  static async getUserGains(userId: string): Promise<Gain[]> {
    try {
      // Récupérer les receipts de l'utilisateur
      const { data: receipts, error: receiptsError } = await supabase
        .from('receipts')
        .select('id')
        .eq('customer_id', userId);

      if (receiptsError) {
        console.error('Erreur lors de la récupération des receipts:', receiptsError);
        throw receiptsError;
      }

      if (!receipts || receipts.length === 0) {
        return [];
      }

      const receiptIds = receipts.map(r => r.id);

      // Récupérer les gains associés à ces receipts
      const { data: gains, error: gainsError } = await supabase
        .from('gains')
        .select('*')
        .in('receipt_id', receiptIds);

      if (gainsError) {
        console.error('Erreur lors de la récupération des gains:', gainsError);
        throw gainsError;
      }

      return gains || [];
    } catch (error) {
      console.error('Erreur getUserGains:', error);
      return [];
    }
  }

  /**
   * Récupérer tous les spendings (dépenses en cashback) d'un utilisateur
   */
  static async getUserSpendings(userId: string): Promise<number> {
    try {
      const { data: spendings, error } = await supabase
        .from('spendings')
        .select('amount')
        .eq('customer_id', userId);

      if (error) {
        console.error('Erreur lors de la récupération des spendings:', error);
        throw error;
      }

      if (!spendings || spendings.length === 0) {
        return 0;
      }

      // Les spendings sont en centimes, donc on divise par 100
      const totalSpendings = spendings.reduce((sum, spending) => sum + spending.amount, 0) / 100;
      return totalSpendings;
    } catch (error) {
      console.error('Erreur getUserSpendings:', error);
      return 0;
    }
  }

  /**
   * Calculer les statistiques totales des gains d'un utilisateur
   */
  static async getUserStats(userId: string): Promise<UserStats> {
    try {
      const gains = await this.getUserGains(userId);
      const totalSpendings = await this.getUserSpendings(userId);

      const totalXP = gains.reduce((sum, gain) => sum + (gain.xp || 0), 0);
      // Le cashback est stocké multiplié par 100 en base, donc on divise par 100
      const totalCashbackEarned = gains.reduce((sum, gain) => sum + (gain.cashback_money || 0), 0) / 100;
      
      // Cashback disponible = cashback gagné - cashback dépensé
      const totalCashback = totalCashbackEarned - totalSpendings;

      return {
        totalXP,
        totalCashback,
        gainsCount: gains.length,
      };
    } catch (error) {
      console.error('Erreur getUserStats:', error);
      return {
        totalXP: 0,
        totalCashback: 0,
        gainsCount: 0,
      };
    }
  }

  /**
   * Formater le montant de cashback en euros
   */
  static formatCashback(amount: number): string {
    return `${amount.toFixed(2)} €`;
  }

  /**
   * Formater l'XP
   */
  static formatXP(xp: number): string {
    return `${xp.toLocaleString('fr-FR')} XP`;
  }
}
