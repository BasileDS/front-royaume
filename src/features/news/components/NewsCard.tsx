import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { newsService } from '../services';
import type { NewsItem } from '../types';

interface NewsCardProps {
  news: NewsItem;
  onPress?: (news: NewsItem) => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

/**
 * Composant pour afficher une carte d'actualité
 */
export function NewsCard({ news, onPress }: NewsCardProps) {
  const cardBackground = useThemeColor({ light: '#ffffff', dark: '#1c1c1e' }, 'background');
  const titleColor = useThemeColor({ light: '#333333', dark: '#ffffff' }, 'text');
  const excerptColor = useThemeColor({ light: '#666666', dark: '#a0a0a0' }, 'text');
  const dateColor = useThemeColor({ light: '#999999', dark: '#6e6e70' }, 'text');
  const placeholderBg = useThemeColor({ light: '#e0e0e0', dark: '#2c2c2e' }, 'background');
  const imageBg = useThemeColor({ light: '#f0f0f0', dark: '#3a3a3c' }, 'background');
  
  const imageUrl = newsService.getImageUrl(news, {
    width: 300,
    height: 200,
    fit: 'cover',
    quality: 80,
  });

  const handlePress = () => {
    onPress?.(news);
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: cardBackground }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={[styles.image, { backgroundColor: imageBg }]}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.image, styles.placeholderImage, { backgroundColor: placeholderBg }]}>
          <Text style={styles.placeholderText}>📰</Text>
        </View>
      )}
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: titleColor }]} numberOfLines={2}>
          {news.title}
        </Text>
        
        {news.content && (
          <Text style={[styles.excerpt, { color: excerptColor }]} numberOfLines={2}>
            {newsService.getExcerpt(news, 100)}
          </Text>
        )}
        
        <Text style={[styles.date, { color: dateColor }]}>
          ID: {news.id}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: 12,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 40,
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  excerpt: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    marginTop: 4,
  },
});
