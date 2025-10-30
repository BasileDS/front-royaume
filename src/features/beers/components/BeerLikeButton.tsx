import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuth } from '@/src/features/auth';
import { LikeService } from '@/src/features/likes';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BeerLikeButtonProps {
  beerId: number;
}

/**
 * Bouton pour liker/unliker une bière
 */
export function BeerLikeButton({ beerId }: BeerLikeButtonProps) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({ light: '#E0E0E0', dark: '#444' }, 'border');
  const buttonColor = liked ? '#FFA500' : borderColor;
  const buttonTextColor = liked ? '#FFF' : textColor;

  const loadLikeInfo = React.useCallback(async () => {
    try {
      setLoading(true);
      const info = await LikeService.getBeerLikeInfo(user?.id || null, beerId);
      setLiked(info.liked);
      setLikesCount(info.count);
    } catch (error) {
      console.error('Erreur lors du chargement des likes:', error);
    } finally {
      setLoading(false);
    }
  }, [beerId, user]);

  useEffect(() => {
    loadLikeInfo();
  }, [loadLikeInfo]);

  const handleToggleLike = async () => {
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

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#FFA500" />
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: buttonColor }]}
      onPress={handleToggleLike}
      disabled={processing}
    >
      {processing ? (
        <ActivityIndicator size="small" color={buttonTextColor} />
      ) : (
        <>
          <Text style={[styles.icon, { color: buttonTextColor }]}>
            {liked ? '❤️' : '🤍'}
          </Text>
          <Text style={[styles.count, { color: buttonTextColor }]}>
            {likesCount}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    gap: 8,
  },
  icon: {
    fontSize: 20,
  },
  count: {
    fontSize: 16,
    fontWeight: '600',
  },
});
