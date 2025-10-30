import { supabase } from '@/src/core/api/supabase';

/**
 * Service pour uploader des fichiers vers Supabase Storage
 */
export class UploadService {
  /**
   * Upload une image de profil vers Supabase Storage
   * @param uri - URI locale de l'image
   * @param userId - ID de l'utilisateur
   * @returns URL publique de l'image uploadée
   */
  static async uploadAvatar(uri: string, userId: string): Promise<string> {
    try {
      // Extraire l'extension du fichier
      const ext = uri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${userId}-${Date.now()}.${ext}`;
      const filePath = `${fileName}`;

      // Obtenir le type MIME
      const mimeType = this.getMimeType(ext);

      // Pour React Native, on lit le fichier en ArrayBuffer
      const response = await fetch(uri);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
      }

      // Utiliser arrayBuffer() au lieu de blob() pour React Native
      const arrayBuffer = await response.arrayBuffer();

      const { error } = await supabase.storage
        .from('avatars')
        .upload(filePath, arrayBuffer, {
          contentType: mimeType,
          upsert: false,
          cacheControl: '3600',
        });

      if (error) {
        console.error('Erreur upload Supabase:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Obtenir l'URL publique
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (error: any) {
      console.error('Erreur uploadAvatar:', error);
      throw new Error(`Impossible d'uploader l'avatar: ${error?.message || 'Erreur inconnue'}`);
    }
  }

  /**
   * Supprimer un ancien avatar
   * @param avatarUrl - URL de l'avatar à supprimer
   */
  static async deleteAvatar(avatarUrl: string): Promise<void> {
    try {
      // Extraire le chemin du fichier depuis l'URL
      const urlParts = avatarUrl.split('/storage/v1/object/public/avatars/');
      if (urlParts.length < 2) return;

      const filePath = urlParts[1];

      const { error } = await supabase.storage
        .from('avatars')
        .remove([filePath]);

      if (error) {
        console.error('Erreur suppression avatar:', error);
      }
    } catch (error) {
      console.error('Erreur deleteAvatar:', error);
    }
  }

  /**
   * Obtenir le type MIME depuis l'extension
   */
  private static getMimeType(ext: string): string {
    const mimeTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
    };
    return mimeTypes[ext] || 'image/jpeg';
  }
}
