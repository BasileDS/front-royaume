import { useAuth } from '@/features/auth';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useNewsLike } from '@/src/features/news/hooks';
import { Image } from 'expo-image';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NewsCardProps {
  title: string;
  imageUrl: string;
  newsId: string;
  onPress?: () => void;
}

export function NewsCard({ title, imageUrl, newsId, onPress }: NewsCardProps) {
  const cardBackground = useThemeColor({}, 'cardBackground');
  const cardText = useThemeColor({}, 'cardText');
  const { user } = useAuth();
  const { liked, likesCount, loading, toggleLike } = useNewsLike(newsId);

  const handleLikePress = (e: any) => {
    e.stopPropagation();
    toggleLike();
  };

  return (
    <TouchableOpacity 
      style={[styles.newsCard, { backgroundColor: cardBackground }]} 
      onPress={onPress}
    >
      <Image
        source={{ uri: imageUrl }}
        style={styles.newsImage}
      />
      <View style={styles.newsContent}>
        <Text style={[styles.newsTitle, { color: cardText }]} numberOfLines={2}>
          {title}
        </Text>
        
        {user?.id && (
          <TouchableOpacity 
            style={styles.likeButton} 
            onPress={handleLikePress}
            disabled={loading}
          >
            <Text style={styles.likeIcon}>{liked ? '❤️' : '🤍'}</Text>
            {likesCount > 0 && (
              <Text style={[styles.likesCount, { color: cardText }]}>
                {likesCount}
              </Text>
            )}
            {loading && <ActivityIndicator size="small" style={styles.loader} />}
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  newsCard: {
    width: 150,
    marginRight: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  newsImage: {
    width: '100%',
    height: 100,
  },
  newsContent: {
    padding: 10,
  },
  newsTitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  likeIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  likesCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  loader: {
    marginLeft: 4,
  },
});