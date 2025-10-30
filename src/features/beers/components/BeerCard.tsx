import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { beerService } from '../services';
import type { Beer } from '../types';
import { BeerCardActions } from './BeerCardActions';

interface BeerCardProps {
  beer: Beer;
  onPress?: (beer: Beer) => void;
  showActions?: boolean; // Option pour afficher ou non les actions
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.45; // Cards plus petites pour affichage en grille

/**
 * Composant pour afficher une carte de bière
 */
export function BeerCard({ beer, onPress, showActions = true }: BeerCardProps) {
  const router = useRouter();
  
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
      // Navigation par défaut vers la page de détail
      router.push(`/beers/${beer.id}`);
    }
  };

  const handleCommentPress = () => {
    // Navigation vers la page de détail avec focus sur les commentaires
    router.push(`/beers/${beer.id}`);
  };

  // Type guards pour les relations
  const styleObj = beer.style && typeof beer.style === 'object' ? beer.style as { title?: string } : null;
  const breweryObj = beer.brewery && typeof beer.brewery === 'object' ? beer.brewery as { title?: string } : null;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.image, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>🍺</Text>
        </View>
      )}
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {beer.title}
        </Text>
        
        {/* Afficher le style et la brasserie */}
        <View style={styles.metaContainer}>
          {styleObj?.title && (
            <View style={styles.styleBadge}>
              <Text style={styles.styleText}>{styleObj.title}</Text>
            </View>
          )}
          
          {breweryObj?.title && (
            <Text style={styles.breweryText} numberOfLines={1}>
              {breweryObj.title}
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
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#f0f0f0',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
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
    color: '#333',
    marginBottom: 6,
  },
  metaContainer: {
    marginBottom: 6,
  },
  styleBadge: {
    backgroundColor: '#FFA500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  styleText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  breweryText: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
  },
  description: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
});
