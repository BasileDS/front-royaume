import { directus, readItems } from '@/core/api';
import type { LevelThresholds } from '@/core/api';

/**
 * Service pour gérer les niveaux et seuils XP depuis Directus
 */
export class LevelService {
  /**
   * Récupérer tous les seuils de niveau depuis Directus
   * Triés par ordre croissant de XP requis
   */
  static async getLevelThresholds(): Promise<LevelThresholds[]> {
    try {
      const levels = await directus.request(
        readItems('level_thresholds', {
          sort: ['sort_order', 'level'],
          limit: -1, // Récupérer tous les niveaux
        })
      );

      return levels as LevelThresholds[];
    } catch (error) {
      console.error('Erreur lors de la récupération des level thresholds:', error);
      return [];
    }
  }

  /**
   * Calculer le niveau actuel d'un utilisateur en fonction de son XP
   */
  static async getCurrentLevel(userXP: number): Promise<{
    currentLevel: LevelThresholds | null;
    nextLevel: LevelThresholds | null;
    progressPercent: number;
    xpToNextLevel: number;
    currentXP: number;
    nextLevelXP: number;
  }> {
    try {
      const levels = await this.getLevelThresholds();

      if (levels.length === 0) {
        return {
          currentLevel: null,
          nextLevel: null,
          progressPercent: 0,
          xpToNextLevel: 0,
          currentXP: userXP,
          nextLevelXP: 0,
        };
      }

      // Trouver le niveau actuel (dernier niveau dont le seuil est atteint)
      let currentLevel: LevelThresholds | null = null;
      let nextLevel: LevelThresholds | null = null;

      for (let i = 0; i < levels.length; i++) {
        const level = levels[i];
        if (userXP >= (level.xp_required || 0)) {
          currentLevel = level;
        } else {
          nextLevel = level;
          break;
        }
      }

      // Si on n'a pas de niveau actuel, on prend le premier
      if (!currentLevel && levels.length > 0) {
        currentLevel = levels[0];
        nextLevel = levels[1] || null;
      }

      // Si on a atteint le niveau max
      if (currentLevel && !nextLevel) {
        return {
          currentLevel,
          nextLevel: null,
          progressPercent: 100,
          xpToNextLevel: 0,
          currentXP: userXP,
          nextLevelXP: currentLevel.xp_required || 0,
        };
      }

      // Calculer la progression vers le prochain niveau
      const currentXP = currentLevel?.xp_required || 0;
      const nextXP = nextLevel?.xp_required || 0;
      const xpInCurrentLevel = userXP - currentXP;
      const xpNeededForNextLevel = nextXP - currentXP;
      const progressPercent = xpNeededForNextLevel > 0
        ? Math.min(100, (xpInCurrentLevel / xpNeededForNextLevel) * 100)
        : 0;
      const xpToNextLevel = Math.max(0, nextXP - userXP);

      return {
        currentLevel,
        nextLevel,
        progressPercent,
        xpToNextLevel,
        currentXP: userXP,
        nextLevelXP: nextXP,
      };
    } catch (error) {
      console.error('Erreur lors du calcul du niveau:', error);
      return {
        currentLevel: null,
        nextLevel: null,
        progressPercent: 0,
        xpToNextLevel: 0,
        currentXP: userXP,
        nextLevelXP: 0,
      };
    }
  }

  /**
   * Récupérer un niveau spécifique par son ID
   */
  static async getLevelById(levelId: number): Promise<LevelThresholds | null> {
    try {
      const levels = await this.getLevelThresholds();
      return levels.find(l => l.id === levelId) || null;
    } catch (error) {
      console.error('Erreur lors de la récupération du niveau:', error);
      return null;
    }
  }

  /**
   * Récupérer un niveau par son numéro
   */
  static async getLevelByNumber(levelNumber: number): Promise<LevelThresholds | null> {
    try {
      const levels = await this.getLevelThresholds();
      return levels.find(l => l.level === levelNumber) || null;
    } catch (error) {
      console.error('Erreur lors de la récupération du niveau:', error);
      return null;
    }
  }
}
