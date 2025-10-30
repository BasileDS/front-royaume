import { supabase } from '@/src/core/api/supabase';

export interface LeaderboardEntry {
  customer_id: string;
  total_xp: number;
  receipt_count: number;
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  avatar_url?: string | null;
  rank?: number;
}

/**
 * Service pour gérer le classement des utilisateurs
 */
export class LeaderboardService {
  /**
   * Récupérer le classement hebdomadaire des utilisateurs par XP
   * Basé sur les gains des 7 derniers jours
   */
  static async getWeeklyLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
    try {
      // Essayer d'abord d'utiliser la fonction RPC si elle existe
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('get_weekly_leaderboard' as any, { 
          days_back: 7, 
          result_limit: limit 
        });

      if (!rpcError && rpcData && Array.isArray(rpcData)) {
        console.log('Utilisation de la fonction RPC get_weekly_leaderboard');
        // Si la fonction RPC fonctionne, utiliser ses résultats
        const userIds = (rpcData as any[]).map((entry: any) => entry.customer_id);
        
        // Récupérer les informations des profils (uniquement username et avatar)
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .in('id', userIds);

        if (profilesError) {
          console.error('Erreur lors de la récupération des profils:', profilesError);
        }

        // Construire le classement final
        const leaderboard: LeaderboardEntry[] = (rpcData as any[]).map((entry: any, index: number) => {
          const profile = profiles?.find(p => p.id === entry.customer_id);
          return {
            customer_id: entry.customer_id,
            total_xp: entry.total_xp || 0,
            receipt_count: entry.receipt_count || 0,
            first_name: null,
            last_name: null,
            username: profile?.username,
            avatar_url: profile?.avatar_url,
            rank: index + 1,
          };
        });

        return leaderboard;
      }

      console.log('Fonction RPC non disponible, calcul manuel du classement hebdomadaire');
      
      // Fallback : Calculer manuellement les XP de la semaine
      // Date il y a 7 jours
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const sevenDaysAgoISO = sevenDaysAgo.toISOString();

      // Récupérer tous les receipts de la période avec les gains associés
      const { data: receipts, error: receiptsError } = await supabase
        .from('receipts')
        .select(`
          id,
          customer_id,
          created_at
        `)
        .gte('created_at', sevenDaysAgoISO);

      if (receiptsError) {
        console.error('Erreur lors de la récupération des receipts:', receiptsError);
        throw receiptsError;
      }

      if (!receipts || receipts.length === 0) {
        console.log('Aucun receipt trouvé pour la période');
        return [];
      }

      console.log(`Trouvé ${receipts.length} receipts pour la période`);

      // Récupérer tous les gains pour ces receipts
      const receiptIds = receipts.map(r => r.id);
      const { data: gains, error: gainsError } = await supabase
        .from('gains')
        .select('xp, receipt_id')
        .in('receipt_id', receiptIds);

      if (gainsError) {
        console.error('Erreur lors de la récupération des gains:', gainsError);
        throw gainsError;
      }

      console.log(`Trouvé ${gains?.length || 0} gains pour ces receipts`);

      if (!gains || gains.length === 0) {
        return [];
      }

      // Créer un map receipt_id -> customer_id
      const receiptToCustomer = new Map<number, string>();
      receipts.forEach(receipt => {
        receiptToCustomer.set(receipt.id, receipt.customer_id);
      });

      // Agréger les XP par utilisateur
      const xpByUser = new Map<string, number>();
      gains.forEach((gain: any) => {
        const customerId = receiptToCustomer.get(gain.receipt_id);
        if (customerId && gain.xp) {
          const currentXP = xpByUser.get(customerId) || 0;
          xpByUser.set(customerId, currentXP + gain.xp);
        }
      });

      console.log(`${xpByUser.size} utilisateurs ont gagné des XP cette semaine`);

      // Trier les utilisateurs par XP décroissant
      const sortedUsers = Array.from(xpByUser.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit);

      if (sortedUsers.length === 0) {
        return [];
      }

      // Récupérer les informations des profils (uniquement username et avatar)
      const userIds = sortedUsers.map(([userId]) => userId);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', userIds);

      if (profilesError) {
        console.error('Erreur lors de la récupération des profils:', profilesError);
        // Continuer sans les profils
      }

      // Construire le classement final
      const leaderboard: LeaderboardEntry[] = sortedUsers.map(([userId, xp], index) => {
        const profile = profiles?.find(p => p.id === userId);
        return {
          customer_id: userId,
          total_xp: xp,
          receipt_count: 0, // On pourrait calculer ça si nécessaire
          first_name: null,
          last_name: null,
          username: profile?.username,
          avatar_url: profile?.avatar_url,
          rank: index + 1,
        };
      });

      return leaderboard;
    } catch (error) {
      console.error('Erreur getWeeklyLeaderboard:', error);
      return [];
    }
  }

  /**
   * Récupérer le classement mensuel des utilisateurs par XP
   * Basé sur les gains des 30 derniers jours
   */
  static async getMonthlyLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
    try {
      // Essayer d'abord d'utiliser la fonction RPC si elle existe
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('get_weekly_leaderboard' as any, { 
          days_back: 30, 
          result_limit: limit 
        });

      if (!rpcError && rpcData && Array.isArray(rpcData)) {
        console.log('Utilisation de la fonction RPC pour le classement mensuel');
        const userIds = (rpcData as any[]).map((entry: any) => entry.customer_id);
        
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .in('id', userIds);

        if (profilesError) {
          console.error('Erreur lors de la récupération des profils:', profilesError);
        }

        const leaderboard: LeaderboardEntry[] = (rpcData as any[]).map((entry: any, index: number) => {
          const profile = profiles?.find(p => p.id === entry.customer_id);
          return {
            customer_id: entry.customer_id,
            total_xp: entry.total_xp || 0,
            receipt_count: entry.receipt_count || 0,
            first_name: null,
            last_name: null,
            username: profile?.username,
            avatar_url: profile?.avatar_url,
            rank: index + 1,
          };
        });

        return leaderboard;
      }

      console.log('Fonction RPC non disponible, calcul manuel du classement mensuel');
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyDaysAgoISO = thirtyDaysAgo.toISOString();

      const { data: receipts, error: receiptsError } = await supabase
        .from('receipts')
        .select('id, customer_id, created_at')
        .gte('created_at', thirtyDaysAgoISO);

      if (receiptsError || !receipts || receipts.length === 0) {
        return [];
      }

      const receiptIds = receipts.map(r => r.id);
      const { data: gains, error: gainsError } = await supabase
        .from('gains')
        .select('xp, receipt_id')
        .in('receipt_id', receiptIds);

      if (gainsError || !gains || gains.length === 0) {
        return [];
      }

      const receiptToCustomer = new Map<number, string>();
      receipts.forEach(receipt => {
        receiptToCustomer.set(receipt.id, receipt.customer_id);
      });

      const xpByUser = new Map<string, number>();
      gains.forEach((gain: any) => {
        const customerId = receiptToCustomer.get(gain.receipt_id);
        if (customerId && gain.xp) {
          const currentXP = xpByUser.get(customerId) || 0;
          xpByUser.set(customerId, currentXP + gain.xp);
        }
      });

      const sortedUsers = Array.from(xpByUser.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit);

      if (sortedUsers.length === 0) {
        return [];
      }

      const userIds = sortedUsers.map(([userId]) => userId);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', userIds);

      if (profilesError) {
        console.error('Erreur lors de la récupération des profils:', profilesError);
      }

      const leaderboard: LeaderboardEntry[] = sortedUsers.map(([userId, xp], index) => {
        const profile = profiles?.find(p => p.id === userId);
        return {
          customer_id: userId,
          total_xp: xp,
          receipt_count: 0,
          first_name: null,
          last_name: null,
          username: profile?.username,
          avatar_url: profile?.avatar_url,
          rank: index + 1,
        };
      });

      return leaderboard;
    } catch (error) {
      console.error('Erreur getMonthlyLeaderboard:', error);
      return [];
    }
  }

  /**
   * Récupérer le classement annuel des utilisateurs par XP
   * Basé sur les gains des 365 derniers jours
   */
  static async getYearlyLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
    try {
      // Essayer d'abord d'utiliser la fonction RPC si elle existe
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('get_weekly_leaderboard' as any, { 
          days_back: 365, 
          result_limit: limit 
        });

      if (!rpcError && rpcData && Array.isArray(rpcData)) {
        console.log('Utilisation de la fonction RPC pour le classement annuel');
        const userIds = (rpcData as any[]).map((entry: any) => entry.customer_id);
        
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .in('id', userIds);

        if (profilesError) {
          console.error('Erreur lors de la récupération des profils:', profilesError);
        }

        const leaderboard: LeaderboardEntry[] = (rpcData as any[]).map((entry: any, index: number) => {
          const profile = profiles?.find(p => p.id === entry.customer_id);
          return {
            customer_id: entry.customer_id,
            total_xp: entry.total_xp || 0,
            receipt_count: entry.receipt_count || 0,
            first_name: null,
            last_name: null,
            username: profile?.username,
            avatar_url: profile?.avatar_url,
            rank: index + 1,
          };
        });

        return leaderboard;
      }

      console.log('Fonction RPC non disponible, calcul manuel du classement annuel');
      
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      const oneYearAgoISO = oneYearAgo.toISOString();

      const { data: receipts, error: receiptsError } = await supabase
        .from('receipts')
        .select('id, customer_id, created_at')
        .gte('created_at', oneYearAgoISO);

      if (receiptsError || !receipts || receipts.length === 0) {
        return [];
      }

      const receiptIds = receipts.map(r => r.id);
      const { data: gains, error: gainsError } = await supabase
        .from('gains')
        .select('xp, receipt_id')
        .in('receipt_id', receiptIds);

      if (gainsError || !gains || gains.length === 0) {
        return [];
      }

      const receiptToCustomer = new Map<number, string>();
      receipts.forEach(receipt => {
        receiptToCustomer.set(receipt.id, receipt.customer_id);
      });

      const xpByUser = new Map<string, number>();
      gains.forEach((gain: any) => {
        const customerId = receiptToCustomer.get(gain.receipt_id);
        if (customerId && gain.xp) {
          const currentXP = xpByUser.get(customerId) || 0;
          xpByUser.set(customerId, currentXP + gain.xp);
        }
      });

      const sortedUsers = Array.from(xpByUser.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit);

      if (sortedUsers.length === 0) {
        return [];
      }

      const userIds = sortedUsers.map(([userId]) => userId);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', userIds);

      if (profilesError) {
        console.error('Erreur lors de la récupération des profils:', profilesError);
      }

      const leaderboard: LeaderboardEntry[] = sortedUsers.map(([userId, xp], index) => {
        const profile = profiles?.find(p => p.id === userId);
        return {
          customer_id: userId,
          total_xp: xp,
          receipt_count: 0,
          first_name: null,
          last_name: null,
          username: profile?.username,
          avatar_url: profile?.avatar_url,
          rank: index + 1,
        };
      });

      return leaderboard;
    } catch (error) {
      console.error('Erreur getYearlyLeaderboard:', error);
      return [];
    }
  }

  /**
   * Récupérer le classement global (tous les temps) des utilisateurs par XP
   */
  static async getGlobalLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
    try {
      // Utiliser la vue user_xp_total qui contient les stats globales
      const { data: users, error: usersError } = await supabase
        .from('user_xp_total')
        .select('*')
        .not('total_xp', 'is', null)
        .order('total_xp', { ascending: false })
        .limit(limit);

      if (usersError) {
        console.error('Erreur lors de la récupération du classement global:', usersError);
        throw usersError;
      }

      if (!users || users.length === 0) {
        return [];
      }

      // Récupérer les informations des profils (uniquement username et avatar)
      const userIds = users.map(u => u.customer_id).filter(Boolean) as string[];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .in('id', userIds);

      if (profilesError) {
        console.error('Erreur lors de la récupération des profils:', profilesError);
        // Continuer sans les profils
      }

      // Construire le classement final
      const leaderboard: LeaderboardEntry[] = users.map((user, index) => {
        const profile = profiles?.find(p => p.id === user.customer_id);
        return {
          customer_id: user.customer_id!,
          total_xp: user.total_xp || 0,
          receipt_count: user.receipt_count || 0,
          first_name: null,
          last_name: null,
          username: profile?.username,
          avatar_url: profile?.avatar_url,
          rank: index + 1,
        };
      });

      return leaderboard;
    } catch (error) {
      console.error('Erreur getGlobalLeaderboard:', error);
      return [];
    }
  }

  /**
   * Récupérer le rang d'un utilisateur dans le classement hebdomadaire
   */
  static async getUserWeeklyRank(userId: string): Promise<number | null> {
    try {
      const leaderboard = await this.getWeeklyLeaderboard(1000); // On récupère plus pour trouver l'utilisateur
      const userEntry = leaderboard.find(entry => entry.customer_id === userId);
      return userEntry?.rank || null;
    } catch (error) {
      console.error('Erreur getUserWeeklyRank:', error);
      return null;
    }
  }

  /**
   * Formater le nom d'affichage d'un utilisateur
   */
  static formatDisplayName(entry: LeaderboardEntry): string {
    if (entry.username) {
      return entry.username;
    }
    return 'Utilisateur anonyme';
  }
}
