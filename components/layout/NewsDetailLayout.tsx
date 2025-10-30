import { BackButton, HtmlContent } from '@/components/common';
import type { NewsItem } from '@/features/news';
import { newsService } from '@/features/news';
import { useThemeColor } from '@/hooks/useThemeColor';
import { CommentsSection } from '@/src/features/comments';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ProfileAvatar } from './ProfileAvatar';
import { ProfileSidebar } from './ProfileSidebar';
import { useAuth } from '@/features/auth';
import { useRouter } from 'expo-router';

interface NewsDetailLayoutProps {
  news: NewsItem;
}

export function NewsDetailLayout({ news }: NewsDetailLayoutProps) {
  const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'background');
  const textColor = useThemeColor({}, 'text');
  const subtextColor = useThemeColor({ light: '#666666', dark: '#AAAAAA' }, 'textSecondary');
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [sidebarVisible, setSidebarVisible] = useState(false);

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

  const imageUrl = newsService.getImageUrl(news, {
    width: 800,
    height: 400,
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
            <Text style={styles.placeholderText}>📰</Text>
          </View>
        )}

        {/* Contenu */}
        <View style={styles.content}>
          {/* Titre */}
          <Text style={[styles.title, { color: textColor }]}>
            {news.title}
          </Text>

          {/* Contenu principal HTML */}
          {news.content && (
            <HtmlContent 
              html={news.content}
              baseStyle={{
                fontSize: 16,
                lineHeight: 26,
              }}
            />
          )}

          {/* Métadonnées */}
          <View style={styles.metadata}>
            <Text style={[styles.metadataText, { color: subtextColor }]}>
              ID: {news.id}
            </Text>
          </View>

          {/* Section des commentaires */}
          <CommentsSection newsId={news.id} />
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
    height: 300,
    backgroundColor: '#f0f0f0',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  placeholderText: {
    fontSize: 80,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    lineHeight: 36,
  },
  body: {
    fontSize: 16,
    lineHeight: 26,
    marginBottom: 30,
  },
  metadata: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  metadataText: {
    fontSize: 14,
  },
});
