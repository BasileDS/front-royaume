import { BackButton } from '@/components/common';
import type { Beer, Brewery, BeerStyle } from '@/features/beers';
import { BeerCommentsSection, BeerLikeButton, beerService } from '@/features/beers';
import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ProfileAvatar } from './ProfileAvatar';
import { ProfileSidebar } from './ProfileSidebar';
import { useAuth } from '@/features/auth';
import { useRouter } from 'expo-router';

interface BeerDetailLayoutProps {
  beer: Beer;
}

export function BeerDetailLayout({ beer }: BeerDetailLayoutProps) {
  const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'background');
  const textColor = useThemeColor({}, 'text');
  const subtextColor = useThemeColor({ light: '#666666', dark: '#AAAAAA' }, 'textSecondary');
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Helper pour obtenir le nom de la brasserie
  const getBreweryName = (): string => {
    if (!beer.brewery) return '';
    if (typeof beer.brewery === 'number') return `ID: ${beer.brewery}`;
    return (beer.brewery as Brewery).title || 'N/A';
  };

  // Helper pour obtenir le nom du style
  const getStyleName = (): string => {
    if (!beer.style) return '';
    if (typeof beer.style === 'number') return `ID: ${beer.style}`;
    return (beer.style as BeerStyle).title || 'N/A';
  };

  const displayName = userProfile?.first_name && userProfile?.last_name
    ? `${userProfile.first_name} ${userProfile.last_name}`
    : userProfile?.username || user?.email?.split('@')[0] || 'Utilisateur';
  const avatarUrl = userProfile?.avatar_url || null;

  const handleNavigateToProfile = () => {
    setSidebarVisible(false);
    router.push('/settings/' as any);
  };

  const handleNavigateToOrders = () => {
    setSidebarVisible(false);
    router.push('/orders/' as any);
  };

  const imageUrl = beerService.getImageUrl(beer, {
    width: 800,
    height: 600,
    fit: 'cover',
    quality: 90,
  });

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Avatar fixe en haut à gauche */}
      <ProfileAvatar
        onPress={() => setSidebarVisible(true)}
        profileImageUrl={avatarUrl}
        userName={displayName}
        fixed
      />
      
      {/* Header avec bouton retour */}
      <View style={styles.header}>
        <BackButton 
          color="#000"
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Image principale */}
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.featuredImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.featuredImage, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>🍺</Text>
          </View>
        )}

        {/* Contenu */}
        <View style={styles.content}>
          {/* Titre */}
          <Text style={[styles.title, { color: textColor }]}>
            {beer.title}
          </Text>

          {/* Actions: Like button */}
          {beer.id && (
            <View style={styles.actionsContainer}>
              <BeerLikeButton beerId={beer.id} />
            </View>
          )}

          {/* IBU Badge */}
          {beer.ibu !== undefined && (
            <View style={styles.ibuContainer}>
              <View style={styles.ibuBadge}>
                <Text style={styles.ibuLabel}>IBU</Text>
                <Text style={styles.ibuValue}>{beer.ibu}</Text>
              </View>
              <Text style={[styles.ibuDescription, { color: subtextColor }]}>
                {beer.ibu < 20 && 'Amertume légère'}
                {beer.ibu >= 20 && beer.ibu < 40 && 'Amertume modérée'}
                {beer.ibu >= 40 && beer.ibu < 60 && 'Amertume marquée'}
                {beer.ibu >= 60 && 'Très amère'}
              </Text>
            </View>
          )}

          {/* Description */}
          {beer.description && (
            <View style={styles.descriptionContainer}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                Description
              </Text>
              <Text style={[styles.description, { color: textColor }]}>
                {beer.description}
              </Text>
            </View>
          )}

          {/* Métadonnées */}
          <View style={styles.metadata}>
            {beer.brewery && (
              <View style={styles.metadataItem}>
                <Text style={[styles.metadataLabel, { color: subtextColor }]}>
                  Brasserie
                </Text>
                <Text style={[styles.metadataValue, { color: textColor }]}>
                  {getBreweryName()}
                </Text>
              </View>
            )}
            
            {beer.style && (
              <View style={styles.metadataItem}>
                <Text style={[styles.metadataLabel, { color: subtextColor }]}>
                  Style
                </Text>
                <Text style={[styles.metadataValue, { color: textColor }]}>
                  {getStyleName()}
                </Text>
              </View>
            )}

            {beer.available_at && beer.available_at.length > 0 && (
              <View style={styles.metadataItem}>
                <Text style={[styles.metadataLabel, { color: subtextColor }]}>
                  Disponible dans {beer.available_at.length} établissement(s)
                </Text>
              </View>
            )}
          </View>

          {/* Section des commentaires */}
          {beer.id && <BeerCommentsSection beerId={beer.id} />}
        </View>
      </ScrollView>

      {/* Sidebar */}
      <ProfileSidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        onNavigateToProfile={handleNavigateToProfile}
        onNavigateToOrders={handleNavigateToOrders}
        userName={displayName}
        userEmail={user?.email}
        profileImageUrl={avatarUrl}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    zIndex: 1000,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  featuredImage: {
    width: '100%',
    height: 400,
    backgroundColor: '#f0f0f0',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  placeholderText: {
    fontSize: 100,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    lineHeight: 40,
  },
  actionsContainer: {
    marginBottom: 20,
  },
  ibuContainer: {
    marginBottom: 25,
  },
  ibuBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFA500',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  ibuLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    marginRight: 8,
  },
  ibuValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  ibuDescription: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  descriptionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
  },
  metadata: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  metadataItem: {
    marginBottom: 15,
  },
  metadataLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  metadataValue: {
    fontSize: 16,
  },
});
