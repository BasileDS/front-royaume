import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { CommentService } from '../services/commentService';
import type { Comment } from '../types';
import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem';

interface CommentsSectionProps {
  newsId: number;
}

/**
 * Section complète des commentaires avec liste et formulaire
 */
export function CommentsSection({ newsId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({ light: '#666', dark: '#AAA' }, 'textSecondary');

  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await CommentService.getNewsComments(newsId);
        setComments(data);
      } catch (err) {
        console.error('Erreur lors du chargement des commentaires:', err);
        setError('Impossible de charger les commentaires');
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [newsId]);

  const handleCommentAdded = async () => {
    // Recharger les commentaires après ajout
    try {
      const data = await CommentService.getNewsComments(newsId);
      setComments(data);
    } catch (err) {
      console.error('Erreur lors du rechargement des commentaires:', err);
    }
  };

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <Text style={[styles.title, { color: textColor }]}>
        Commentaires ({comments.length})
      </Text>

      {/* Formulaire d'ajout */}
      <CommentForm newsId={newsId} onCommentAdded={handleCommentAdded} />

      {/* Liste des commentaires */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
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
