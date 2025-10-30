import { useEffect, useState } from 'react';
import type { LevelThresholds } from '@/core/api';
import { LevelService } from '../services/levelService';

interface UseLevelReturn {
  currentLevel: LevelThresholds | null;
  nextLevel: LevelThresholds | null;
  progressPercent: number;
  xpToNextLevel: number;
  currentXP: number;
  nextLevelXP: number;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook pour récupérer le niveau actuel d'un utilisateur
 * basé sur son XP total
 */
export function useUserLevel(userXP: number): UseLevelReturn {
  const [currentLevel, setCurrentLevel] = useState<LevelThresholds | null>(null);
  const [nextLevel, setNextLevel] = useState<LevelThresholds | null>(null);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [xpToNextLevel, setXpToNextLevel] = useState<number>(0);
  const [currentXP, setCurrentXP] = useState<number>(0);
  const [nextLevelXP, setNextLevelXP] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchLevel = async () => {
      try {
        setLoading(true);
        setError(null);

        const levelData = await LevelService.getCurrentLevel(userXP);

        if (isMounted) {
          setCurrentLevel(levelData.currentLevel);
          setNextLevel(levelData.nextLevel);
          setProgressPercent(levelData.progressPercent);
          setXpToNextLevel(levelData.xpToNextLevel);
          setCurrentXP(levelData.currentXP);
          setNextLevelXP(levelData.nextLevelXP);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Erreur inconnue'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLevel();

    return () => {
      isMounted = false;
    };
  }, [userXP]);

  return {
    currentLevel,
    nextLevel,
    progressPercent,
    xpToNextLevel,
    currentXP,
    nextLevelXP,
    loading,
    error,
  };
}

interface UseAllLevelsReturn {
  levels: LevelThresholds[];
  loading: boolean;
  error: Error | null;
}

/**
 * Hook pour récupérer tous les seuils de niveau
 */
export function useAllLevels(): UseAllLevelsReturn {
  const [levels, setLevels] = useState<LevelThresholds[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchLevels = async () => {
      try {
        setLoading(true);
        setError(null);

        const levelsData = await LevelService.getLevelThresholds();

        if (isMounted) {
          setLevels(levelsData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Erreur inconnue'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLevels();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    levels,
    loading,
    error,
  };
}
