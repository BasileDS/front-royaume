import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { CommentForm } from '../../comments/components/CommentForm';
import { CommentItem } from '../../comments/components/CommentItem';
import { CommentService } from '../../comments/services/commentService';
import type { CommentWithUser } from '../../comments/types';

interface BeerCommentsSectionProps {
  beerId: number;
}

/**
 * Section complète des commentaires pour une bière
 */
export function BeerCommentsSection({ beerId }: BeerCommentsSectionProps) {
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({ light: '#666', dark: '#AAA' }, 'textSecondary');

  const loadComments = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await CommentService.getBeerComments(beerId);
      setComments(data);
    } catch (err) {
      console.error('Erreur lors du chargement des commentaires:', err);
      setError('Impossible de charger les commentaires');
    } finally {
      setLoading(false);
    }
  }, [beerId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleCommentAdded = async () => {
    // Recharger les commentaires après ajout
    await loadComments();
  };

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <Text style={[styles.title, { color: textColor }]}>
        Commentaires ({comments.length})
      </Text>

      {/* Formulaire d'ajout */}
      <CommentForm 
        beerId={beerId} 
        onCommentAdded={handleCommentAdded}
      />

      {/* Liste des commentaires */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFA500" />
          <Text style={[styles.loadingText, { color: secondaryTextColor }]}>
            Chargement des commentaires...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ {error}</Text>
        </View>
      ) : comments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: secondaryTextColor }]}>
            💬 Aucun commentaire pour le moment.{'\n'}
            Soyez le premier à commenter !
          </Text>
        </View>
      ) : (
        <View style={styles.commentsList}>
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 15,
    color: '#d32f2f',
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  commentsList: {
    marginTop: 8,
  },
});
