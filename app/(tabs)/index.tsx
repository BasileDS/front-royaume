import React, { useState, useCallback } from 'react';
import { ScrollView, StyleSheet, RefreshControl, View } from 'react-native';

import { ProfileSection } from '@/components/layout';
import {
    DashboardAttachedEstablishmentSection,
    DashboardBeersSection,
    DashboardEstablishmentsSection,
    DashboardNewsSection,
    DashboardStatsSection
} from '@/components/sections';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuth } from '@/features/auth';
import { useUserStats, useUserLevel } from '@/src/features/gains';
import { useEstablishment } from '@/src/features/establishments';

export default function HomeScreen() {
  const { user, userProfile } = useAuth();
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, 'background');
  const [refreshing, setRefreshing] = useState(false);
  const [statsRefreshTrigger, setStatsRefreshTrigger] = useState(0);

  // Récupérer les stats et le niveau de l'utilisateur
  const { totalXP } = useUserStats();
  const { currentLevel } = useUserLevel(totalXP);

  // Récupérer l'établissement de référence
  const attachedEstablishmentId = userProfile?.attached_establishment_id;
  const { establishment } = useEstablishment(attachedEstablishmentId || 0);

  // Nom d'affichage : first_name + last_name > username > email > "Utilisateur"
  const displayName = userProfile?.first_name && userProfile?.last_name
    ? `${userProfile.first_name} ${userProfile.last_name}`
    : userProfile?.username || user?.email?.split('@')[0] || 'Utilisateur';
  const avatarUrl = userProfile?.avatar_url || null;
  const establishmentName = establishment?.title || undefined;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Trigger refresh dans DashboardStatsSection
    setStatsRefreshTrigger(prev => prev + 1);
    // Simuler un délai minimum pour une meilleure UX
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors[colorScheme ?? 'light'].tint}
            colors={[Colors[colorScheme ?? 'light'].tint]}
          />
        }>
        <ProfileSection 
          userName={displayName}
          profileImageUrl={avatarUrl}
          userLevel={currentLevel?.name}
          userEstablishment={establishmentName}
        />
              
        <DashboardStatsSection refreshTrigger={statsRefreshTrigger} />
        
        <DashboardNewsSection limit={3} />
        
        <DashboardBeersSection limit={6} />
        
        <DashboardAttachedEstablishmentSection 
          establishment={establishment}
        />
        
        <DashboardEstablishmentsSection />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 100, // Account for header height
    paddingBottom: 100, // Account for tab bar height
    paddingHorizontal: 10, // Standard horizontal padding
  },
});