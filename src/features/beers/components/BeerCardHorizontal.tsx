import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { beerService } from '../services';
import type { Beer } from '../types';
import { BeerCardActions } from './BeerCardActions';

interface BeerCardHorizontalProps {
  beer: Beer;
  onPress?: (beer: Beer) => void;
  showActions?: boolean;
}

const IMAGE_SIZE = 120;

/**
 * Composant pour afficher une carte de bière en format horizontal
 * Photo à gauche, informations à droite
 */
export function BeerCardHorizontal({ beer, onPress, showActions = true }: BeerCardHorizontalProps) {
  const router = useRouter();
  const cardBg = useThemeColor({}, 'cardBackground');
  const textColor = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const placeholderBg = useThemeColor({ light: '#e0e0e0', dark: '#3A3D41' }, 'border');
  
  const imageUrl = beerService.getImageUrl(beer, {
    width: 300,
    height: 400,
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
      {/* Image à gauche */}
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
      
      {/* Contenu à droite */}
      <View style={styles.content}>
        <View style={styles.textContent}>
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
          
          {beer.description && (
            <Text style={[styles.description, { color: textSecondary }]} numberOfLines={3}>
              {beerService.getShortDescription(beer, 120)}
            </Text>
          )}
        </View>

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
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 15,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    height: IMAGE_SIZE + 20,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE + 20,
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 50,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
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
  description: {
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
});
