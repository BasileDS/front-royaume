import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuth } from '@/src/features/auth';
import { CommentService } from '@/src/features/comments';
import { LikeService } from '@/src/features/likes';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { newsService } from '../services';
import type { NewsItem } from '../types';

interface NewsListVerticalProps {
  news: NewsItem[];
  onPress?: (news: NewsItem) => void;
}

/**
 * Composant pour afficher une liste verticale de news avec séparateurs
 */
export function NewsListVertical({ news, onPress }: NewsListVerticalProps) {
  // Couleurs du thème
  const textColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const separatorColor = useThemeColor({}, 'border');
  const placeholderBgColor = useThemeColor({ light: '#e0e0e0', dark: '#3A3D41' }, 'backgroundSecondary');
  const imageBgColor = useThemeColor({ light: '#f0f0f0', dark: '#2A2D31' }, 'backgroundSecondary');
  const likeActiveColor = '#FF6B35'; // Couleur orange pour le like actif
  const likeInactiveColor = useThemeColor({ light: '#999', dark: '#666' }, 'textSecondary');

  const { user } = useAuth();

  // État pour gérer les likes de chaque news
  const [likesData, setLikesData] = useState<Record<number, { count: number; liked: boolean; loading: boolean }>>({});
  
  // État pour gérer les commentaires de chaque news
  const [commentsData, setCommentsData] = useState<Record<number, number>>({});

  // Charger les données de likes et commentaires au montage
  useEffect(() => {
    const loadData = async () => {
      const initialLikesData: Record<number, { count: number; liked: boolean; loading: boolean }> = {};
      const initialCommentsData: Record<number, number> = {};
      
      await Promise.all(
        news.map(async (item) => {
          if (!item.id) return;
          
          // Charger les likes
          const { count, liked } = await LikeService.getNewsLikeInfo(user?.id || null, item.id);
          initialLikesData[item.id] = { count, liked, loading: false };
          
          // Charger le nombre de commentaires
          const commentsCount = await CommentService.getNewsCommentsCount(item.id);
          initialCommentsData[item.id] = commentsCount;
        })
      );
      
      setLikesData(initialLikesData);
      setCommentsData(initialCommentsData);
    };

    loadData();
  }, [news, user?.id]);

  const handlePress = (newsItem: NewsItem) => {
    onPress?.(newsItem);
  };

  const handleLikePress = async (newsId: number, event: any) => {
    // Empêcher la propagation vers le TouchableOpacity parent
    event.stopPropagation();

    if (!user) {
      Alert.alert(
        'Connexion requise',
        'Vous devez être connecté pour aimer une news.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Marquer comme loading
    setLikesData(prev => ({
      ...prev,
      [newsId]: { ...prev[newsId], loading: true }
    }));

    try {
      const { liked, count } = await LikeService.toggleNewsLike(user.id, newsId);
      
      setLikesData(prev => ({
        ...prev,
        [newsId]: { count, liked, loading: false }
      }));
    } catch (error) {
      console.error('Erreur lors du toggle du like:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la mise à jour du like.');
      
      // Remettre loading à false en cas d'erreur
      setLikesData(prev => ({
        ...prev,
        [newsId]: { ...prev[newsId], loading: false }
      }));
    }
  };

  return (
    <View style={styles.container}>
      {news.map((item, index) => {
        if (!item.id) return null;
        
        const likeInfo = likesData[item.id] || { count: 0, liked: false, loading: false };
        
        return (
          <React.Fragment key={item.id}>
            <TouchableOpacity
              style={styles.newsItem}
              onPress={() => handlePress(item)}
              activeOpacity={0.7}
            >
              {/* Image au-dessus */}
              {(() => {
                const imageUrl = newsService.getImageUrl(item, {
                  width: 400,
                  height: 200,
                  fit: 'cover',
                  quality: 80,
                });
                
                return imageUrl ? (
                  <Image
                    source={{ uri: imageUrl }}
                    style={[styles.image, { backgroundColor: imageBgColor }]}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.image, styles.placeholderImage, { backgroundColor: placeholderBgColor }]}>
                    <Text style={styles.placeholderText}>📰</Text>
                  </View>
                );
              })()}

              {/* Contenu en dessous */}
              <View style={styles.content}>
                <Text style={[styles.title, { color: textColor }]} numberOfLines={2}>
                  {item.title}
                </Text>
                
                {item.content && (
                  <Text style={[styles.excerpt, { color: textSecondaryColor }]} numberOfLines={3}>
                    {newsService.getExcerpt(item, 120)}
                  </Text>
                )}

                {/* Boutons d'interaction (commentaires et like) */}
                <View style={styles.interactionContainer}>
                  {/* Bouton commentaires */}
                  <View style={styles.commentButton}>
                    <Text style={[styles.commentIcon, { color: textSecondaryColor }]}>
                      💬
                    </Text>
                    <Text style={[styles.commentCount, { color: textSecondaryColor }]}>
                      {commentsData[item.id] || 0}
                    </Text>
                  </View>

                  {/* Bouton de like */}
                  <TouchableOpacity
                    style={styles.likeButton}
                    onPress={(e) => item.id && handleLikePress(item.id, e)}
                    disabled={likeInfo.loading}
                    activeOpacity={0.7}
                  >
                    {likeInfo.loading ? (
                      <ActivityIndicator size="small" color={likeActiveColor} />
                    ) : (
                      <>
                        <Text style={[
                          styles.likeIcon,
                          { color: likeInfo.liked ? likeActiveColor : likeInactiveColor }
                        ]}>
                          👍
                        </Text>
                        <Text style={[
                          styles.likeCount,
                          { color: likeInfo.liked ? likeActiveColor : textSecondaryColor }
                        ]}>
                          {likeInfo.count}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>

            {/* Séparateur - ne pas afficher après le dernier élément */}
            {index < news.length - 1 && <View style={[styles.separator, { backgroundColor: separatorColor }]} />}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  newsItem: {
    flexDirection: 'column',
    paddingBottom: 16,
    paddingHorizontal: 0,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
  },
  content: {
    width: '100%',
    marginTop: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    lineHeight: 22,
  },
  excerpt: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  interactionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  commentIcon: {
    fontSize: 18,
    marginRight: 4,
  },
  commentCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  likeIcon: {
    fontSize: 18,
    marginRight: 4,
  },
  likeCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    marginHorizontal: 0,
    opacity: 0.3,
  },
});
