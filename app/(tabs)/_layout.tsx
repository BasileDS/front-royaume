import { Tabs, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { HapticTab } from '@/components/interactions';
import { Header, ProfileSidebar, QrCodeModal } from '@/components/layout';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { ScrollProvider, useScroll } from '@/contexts/ScrollContext';
import { useAuth } from '@/features/auth';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  return (
    <ScrollProvider>
      <TabLayoutContent />
    </ScrollProvider>
  );
}

function TabLayoutContent() {
  const colorScheme = useColorScheme();
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const { scrollY } = useScroll();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [qrCodeVisible, setQrCodeVisible] = useState(false);

  // Nom d'affichage : first_name + last_name > username > email > "Utilisateur"
  const displayName = userProfile?.first_name && userProfile?.last_name
    ? `${userProfile.first_name} ${userProfile.last_name}`
    : userProfile?.username || user?.email?.split('@')[0] || 'Utilisateur';
  const avatarUrl = userProfile?.avatar_url || null;

  const handleNotificationPress = () => {
    // TODO: Implement notifications
  };

  const handleProfilePress = () => {
    setSidebarVisible(true);
  };

  const handleQrCodePress = () => {
    setQrCodeVisible(true);
  };

  const handleNavigateToProfile = () => {
    setSidebarVisible(false);
    router.push('/settings/' as any);
  };

  const handleNavigateToOrders = () => {
    setSidebarVisible(false);
    router.push('/orders/' as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 0,
            borderTopWidth: 0,
            ...Platform.select({
              ios: {
                // Use a transparent background on iOS to show the blur effect
              },
              default: {},
            }),
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Tableau de bord',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="news"
          options={{
            title: 'La Gazette',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="newspaper.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="establishments"
          options={{
            title: 'Établissements',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="mappin.circle.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="tavern"
          options={{
            title: 'Bières',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="wineglass.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="quest"
          options={{
            title: 'Quêtes',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="compass.drawing" color={color} />,
          }}
        />
      </Tabs>
      
      <Header 
        onProfilePress={handleProfilePress}
        onNotificationPress={handleNotificationPress}
        onQrCodePress={handleQrCodePress}
        profileImageUrl={avatarUrl}
        userName={displayName}
        scrollY={scrollY}
      />

      <ProfileSidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        onNavigateToProfile={handleNavigateToProfile}
        onNavigateToOrders={handleNavigateToOrders}
        userName={displayName}
        userEmail={user?.email}
        profileImageUrl={avatarUrl}
      />

      <QrCodeModal
        visible={qrCodeVisible}
        onClose={() => setQrCodeVisible(false)}
        qrCodeData={`${user?.id || 'guest'}`}
        title="Ma carte du Royaume"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
