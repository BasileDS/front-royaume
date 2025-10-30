// import { supabase } from '@/src/core/api/supabase';

/**
 * Types pour la progression des quêtes
 */
export type QuestStatus = 'not_started' | 'in_progress' | 'completed';

export interface QuestProgress {
  id?: number;
  user_id: string;
  quest_id: number;
  status: QuestStatus;
  progress: number;
  started_at?: string;
  completed_at?: string | null;
  updated_at?: string;
  created_at?: string;
}

/**
 * Service pour gérer la progression des quêtes dans Supabase
 * 
 * ⚠️ ATTENTION : Ce service nécessite la création de la table 'quest_progress' dans Supabase
 * 
 * Pour créer la table, exécutez le SQL suivant dans Supabase :
 * 
 * CREATE TABLE quest_progress (
 *   id BIGSERIAL PRIMARY KEY,
 *   user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 *   quest_id INTEGER NOT NULL,
 *   status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
 *   progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
 *   started_at TIMESTAMP WITH TIME ZONE,
 *   completed_at TIMESTAMP WITH TIME ZONE,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   UNIQUE(user_id, quest_id)
 * );
 * 
 * CREATE INDEX idx_quest_progress_user_id ON quest_progress(user_id);
 * CREATE INDEX idx_quest_progress_status ON quest_progress(status);
 * 
 * -- Enable RLS
 * ALTER TABLE quest_progress ENABLE ROW LEVEL SECURITY;
 * 
 * -- Policy: Users can only see their own progress
 * CREATE POLICY "Users can view own quest progress" ON quest_progress
 *   FOR SELECT USING (auth.uid() = user_id);
 * 
 * -- Policy: Users can insert their own progress
 * CREATE POLICY "Users can insert own quest progress" ON quest_progress
 *   FOR INSERT WITH CHECK (auth.uid() = user_id);
 * 
 * -- Policy: Users can update their own progress
 * CREATE POLICY "Users can update own quest progress" ON quest_progress
 *   FOR UPDATE USING (auth.uid() = user_id);
 * 
 * -- Policy: Users can delete their own progress
 * CREATE POLICY "Users can delete own quest progress" ON quest_progress
 *   FOR DELETE USING (auth.uid() = user_id);
 * 
 * Après la création de la table :
 * 1. Régénérez les types TypeScript avec : npx supabase gen types typescript --project-id <votre-project-id> > src/shared/types/database.types.ts
 * 2. Décommentez l'import supabase ci-dessus
 * 3. Les méthodes ci-dessous fonctionneront correctement
 */
export class QuestProgressService {
  private static throwTableNotExistError(): never {
    throw new Error(
      '❌ La table "quest_progress" n\'existe pas encore dans Supabase.\n' +
      'Veuillez créer la table en exécutant le SQL fourni dans les commentaires de ce fichier.'
    );
  }
  /**
   * Récupère la progression de toutes les quêtes d'un utilisateur
   */
  static async getUserQuestProgress(userId: string): Promise<QuestProgress[]> {
    this.throwTableNotExistError();
  }

  /**
   * Récupère la progression d'une quête spécifique
   */
  static async getQuestProgress(
    userId: string,
    questId: number
  ): Promise<QuestProgress | null> {
    this.throwTableNotExistError();
  }

  /**
   * Démarre une nouvelle quête
   */
  static async startQuest(userId: string, questId: number): Promise<QuestProgress> {
    this.throwTableNotExistError();
  }

  /**
   * Met à jour la progression d'une quête
   */
  static async updateProgress(
    userId: string,
    questId: number,
    progress: number
  ): Promise<QuestProgress> {
    this.throwTableNotExistError();
  }

  /**
   * Marque une quête comme complétée
   */
  static async completeQuest(userId: string, questId: number): Promise<QuestProgress> {
    this.throwTableNotExistError();
  }

  /**
   * Récupère les quêtes filtrées par statut
   */
  static async getQuestsByStatus(
    userId: string,
    status: QuestStatus
  ): Promise<QuestProgress[]> {
    this.throwTableNotExistError();
  }

  /**
   * Compte le nombre de quêtes complétées
   */
  static async countCompletedQuests(userId: string): Promise<number> {
    this.throwTableNotExistError();
  }

  /**
   * Compte le nombre de quêtes en cours
   */
  static async countActiveQuests(userId: string): Promise<number> {
    this.throwTableNotExistError();
  }

  /**
   * Réinitialise une quête (remet à zéro)
   */
  static async resetQuest(userId: string, questId: number): Promise<void> {
    this.throwTableNotExistError();
  }
}
