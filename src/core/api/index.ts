/**
 * Core API Module
 * 
 * Ce module centralise tous les clients API de l'application.
 * 
 * Architecture:
 * - Supabase: Backend pour les données utilisateur (READ/WRITE)
 * - Directus: CMS Headless pour le contenu statique (READ ONLY)
 */

export * from './directus';
export * from './supabase';

