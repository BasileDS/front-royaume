import { ThemedText } from '@/components/common';
import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { establishmentService } from '../services';
import type { Establishment } from '../types';

interface EstablishmentCardProps {
  establishment: Establishment;
  onPress?: (establishment: Establishment) => void;
}

/**
 * Carte d'affichage d'un établissement (version horizontale)
 */
export function EstablishmentCard({ establishment, onPress }: EstablishmentCardProps) {
  const borderColor = useThemeColor({}, 'border');

  const imageUrl = establishmentService.getImageUrl(establishment, {
    width: 120,
    height: 120,
    fit: 'cover',
    quality: 80,
  });

  const address = establishmentService.getFullAddress(establishment);

  const handlePress = () => {
    if (onPress) {
      onPress(establishment);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: '#fff',
          borderColor,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      {/* Image */}
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: '#e0e0e0' }]}>
            <ThemedText style={styles.placeholderIcon}>🏪</ThemedText>
          </View>
        )}
      </View>

      {/* Contenu */}
      <View style={styles.content}>
        <ThemedText style={styles.name} numberOfLines={1}>
          {establishment.title}
        </ThemedText>

        {establishment.type && (
          <View style={styles.typeContainer}>
            <ThemedText style={styles.typeText}>
              {establishment.type}
            </ThemedText>
          </View>
        )}

        {address && (
          <ThemedText style={styles.address} numberOfLines={2}>
            📍 {address}
          </ThemedText>
        )}

        {establishment.phone && (
          <ThemedText style={styles.phone} numberOfLines={1}>
            📞 {establishment.phone}
          </ThemedText>
        )}
      </View>

      {/* Flèche */}
      <View style={styles.arrow}>
        <ThemedText style={styles.arrowIcon}>›</ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: 120,
    height: 120,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 40,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  typeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#4A90E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 6,
  },
  typeText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  address: {
    fontSize: 13,
    opacity: 0.8,
    marginBottom: 4,
  },
  phone: {
    fontSize: 12,
    opacity: 0.7,
  },
  arrow: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  arrowIcon: {
    fontSize: 32,
    opacity: 0.3,
  },
});
