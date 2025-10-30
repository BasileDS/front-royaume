import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, Dimensions, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import { useThemeColor } from '@/hooks/useThemeColor';
import { getDirectusImageUrl } from '@/core/api';
import { establishmentService } from '@/src/features/establishments/services';
import type { Establishment } from '@/src/features/establishments/types';

interface DashboardAttachedEstablishmentSectionProps {
  establishment?: Establishment | null;
  loading?: boolean;
}

const { width } = Dimensions.get('window');

/**
 * Section pour afficher l'établissement du royaume auquel l'utilisateur est rattaché
 */
export function DashboardAttachedEstablishmentSection({ 
  establishment,
  loading = false
}: DashboardAttachedEstablishmentSectionProps) {
  const router = useRouter();
  const textColor = useThemeColor({}, 'text');
  const cardBgColor = useThemeColor({ light: '#ffffff', dark: '#2c2c2e' }, 'background');
  const mutedTextColor = useThemeColor({ light: '#666666', dark: '#999999' }, 'text');

  // Ne pas afficher si pas d'établissement et pas en chargement
  if (!loading && !establishment) {
    return null;
  }

  const handlePress = () => {
    if (establishment?.id) {
      router.push(`/establishments/${establishment.id}`);
    }
  };

  const mainImageUrl = establishment?.featured_image 
    ? establishmentService.getImageUrl(establishment, {
        width: Math.round(width - 80),
        height: 200,
        fit: 'cover',
        quality: 85,
      })
    : null;

  const logoUrl = establishment?.logo 
    ? getDirectusImageUrl(establishment.logo, {
        width: 80,
        height: 80,
        fit: 'contain',
        quality: 90,
      })
    : null;

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          Votre Établissement
        </Text>
      </View>

      {loading ? (
        <View style={[styles.card, { backgroundColor: cardBgColor }]}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : establishment ? (
        <Pressable 
          style={({ pressed }) => [
            styles.card, 
            { 
              backgroundColor: cardBgColor,
              opacity: pressed ? 0.8 : 1,
            }
          ]}
          onPress={handlePress}
        >
          {/* Image principale */}
          {mainImageUrl ? (
            <View style={styles.mainImageContainer}>
              <Image 
                source={{ uri: mainImageUrl }} 
                style={styles.mainImage}
                resizeMode="cover"
              />
              {/* Logo superposé */}
              {logoUrl && (
                <View style={styles.logoOverlay}>
                  <Image 
                    source={{ uri: logoUrl }} 
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </View>
              )}
            </View>
          ) : logoUrl ? (
            /* Logo seul si pas d'image principale */
            <View style={styles.logoOnlyContainer}>
              <Image 
                source={{ uri: logoUrl }} 
                style={styles.logoLarge}
                resizeMode="contain"
              />
            </View>
          ) : (
            /* Placeholder si aucune image */
            <View style={[styles.placeholder, { backgroundColor: '#e0e0e0' }]}>
              <Text style={styles.placeholderIcon}>🏰</Text>
            </View>
          )}

          {/* Contenu */}
          <View style={styles.content}>
            <Text style={[styles.title, { color: textColor }]}>
              {establishment.title}
            </Text>

            {establishment.type && (
              <View style={styles.typeContainer}>
                <Text style={styles.typeText}>
                  {establishment.type}
                </Text>
              </View>
            )}

            {establishment.description && (
              <Text 
                style={[styles.description, { color: mutedTextColor }]} 
                numberOfLines={4}
              >
                {establishment.description}
              </Text>
            )}

            {/* Informations supplémentaires */}
            <View style={styles.infoContainer}>
              {establishment.city && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>📍</Text>
                  <Text style={[styles.infoText, { color: mutedTextColor }]}>
                    {establishmentService.getFullAddress(establishment)}
                  </Text>
                </View>
              )}

              {establishment.phone && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>📞</Text>
                  <Text style={[styles.infoText, { color: mutedTextColor }]}>
                    {establishment.phone}
                  </Text>
                </View>
              )}

              {establishment.opening_hours && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>🕐</Text>
                  <Text style={[styles.infoText, { color: mutedTextColor }]}>
                    {establishment.opening_hours}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  header: {
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    marginHorizontal: 10,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  logoOverlay: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    width: 80,
    height: 80,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  logoOnlyContainer: {
    width: '100%',
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLarge: {
    width: 120,
    height: 120,
  },
  placeholder: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: 60,
  },
  content: {
    padding: 20,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  typeContainer: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  typeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  infoContainer: {
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoIcon: {
    fontSize: 16,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
  },
});
