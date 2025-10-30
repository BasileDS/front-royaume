/**
 * Core Module
 * 
 * Ce module contient les services centraux de l'application :
 * - API clients (Supabase, Directus)
 * - Store Redux avec hooks typés
 * 
 * Usage:
 * ```typescript
 * import { supabase, directus } from '@/core/api';
 * import { useAppDispatch, useAppSelector } from '@/core/store';
 * ```
 */

export * from './api';
export * from './store';

