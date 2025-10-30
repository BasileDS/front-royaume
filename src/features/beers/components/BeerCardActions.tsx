import { useAuth } from '@/src/features/auth';
import { CommentService } from '@/src/features/comments';
import { LikeService } from '@/src/features/likes';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BeerCardActionsProps {
  beerId: number;
  onCommentPress?: () => void;
}

/**
 * Composant compact pour les actions (like/comment) sur les cartes de bière
 */
export function BeerCardActions({ beerId, onCommentPress }: BeerCardActionsProps) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const loadInfo = React.useCallback(async () => {
    try {
      setLoading(true);
      const [likeInfo, commentsTotal] = await Promise.all([
        LikeService.getBeerLikeInfo(user?.id || null, beerId),
        CommentService.getBeerCommentsCount(beerId),
      ]);
      setLiked(likeInfo.liked);
      setLikesCount(likeInfo.count);
      setCommentsCount(commentsTotal);
    } catch (error) {
      console.error('Erreur lors du chargement des infos:', error);
    } finally {
      setLoading(false);
    }
  }, [beerId, user]);

  useEffect(() => {
    loadInfo();
  }, [loadInfo]);

  const handleToggleLike = async (e: any) => {
    e.stopPropagation(); // Empêcher la navigation vers la page de détail
    
    if (!user) {
      Alert.alert('Connexion requise', 'Vous devez être connecté pour liker une bière.');
      return;
    }

    if (processing) return;

    setProcessing(true);

    try {
      const result = await LikeService.toggleBeerLike(user.id, beerId);
      setLiked(result.liked);
      setLikesCount(result.count);
    } catch (error) {
      console.error('Erreur lors du toggle du like:', error);
      Alert.alert('Erreur', 'Impossible de liker la bière.');
    } finally {
      setProcessing(false);
    }
  };

  const handleCommentPress = (e: any) => {
    e.stopPropagation(); // Empêcher la navigation vers la page de détail
    onCommentPress?.();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#FFA500" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Bouton Commentaires */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={handleCommentPress}
        activeOpacity={0.7}
      >
        <Text style={styles.icon}>💬</Text>
        <Text style={styles.count}>{commentsCount}</Text>
      </TouchableOpacity>

      {/* Bouton Like */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={handleToggleLike}
        disabled={processing}
        activeOpacity={0.7}
      >
        {processing ? (
          <ActivityIndicator size="small" color="#FFA500" />
        ) : (
          <>
            <Text style={styles.icon}>{liked ? '❤️' : '🤍'}</Text>
            <Text style={[styles.count, liked && styles.countActive]}>
              {likesCount}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  icon: {
    fontSize: 16,
  },
  count: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  countActive: {
    color: '#FFA500',
  },
});
