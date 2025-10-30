import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { beerService } from '../services';
import type { Beer } from '../types';
import { BeerCardActions } from './BeerCardActions';

interface BeerCardVerticalProps {
  beer: Beer;
  onPress?: (beer: Beer) => void;
  showActions?: boolean;
}

/**
 * Composant pour afficher une carte de bière en format vertical
 * Photo en haut, informations en dessous
 */
export function BeerCardVertical({ beer, onPress, showActions = true }: BeerCardVerticalProps) {
  const router = useRouter();
  const cardBg = useThemeColor({}, 'cardBackground');
  const textColor = useThemeColor({}, 'text');
  const placeholderBg = useThemeColor({ light: '#e0e0e0', dark: '#3A3D41' }, 'border');
  
  const imageUrl = beerService.getImageUrl(beer, {
    width: 400,
    height: 500,
    fit: 'cover',
    quality: 80,
  });

  const handlePress = () => {
    if (onPress) {
      onPress(beer);
    } else {
      router.push(`/beers/${beer.id}`);
    }
  };

  const handleCommentPress = () => {
    router.push(`/beers/${beer.id}`);
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: cardBg }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {/* Image en haut */}
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.image, styles.placeholderImage, { backgroundColor: placeholderBg }]}>
          <Text style={styles.placeholderText}>🍺</Text>
        </View>
      )}
      
      {/* Contenu en dessous */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: textColor }]} numberOfLines={2}>
          {beer.title}
        </Text>
        
        {/* Afficher le style */}
        {(() => {
          const styleObj = beer.style && typeof beer.style === 'object' ? beer.style as { title?: string } : null;
          return styleObj?.title ? (
            <View style={styles.styleBadge}>
              <Text style={styles.styleText}>{styleObj.title}</Text>
            </View>
          ) : null;
        })()}

        {/* Actions : Like et Commentaires */}
        {showActions && beer.id && (
          <BeerCardActions 
            beerId={beer.id} 
            onCommentPress={handleCommentPress}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    flex: 1,
  },
  image: {
    width: '100%',
    height: 180,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 50,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  styleBadge: {
    backgroundColor: '#FFA500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  styleText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
});
