import { UserAvatar } from '@/components/common';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { BlurView } from 'expo-blur';

interface HeaderProps {
  onProfilePress?: () => void;
  onNotificationPress?: () => void;
  onQrCodePress?: () => void;
  profileImageUrl?: string | null;
  userName?: string;
  scrollY?: Animated.Value;
}

export function Header({ 
  onProfilePress, 
  onNotificationPress, 
  onQrCodePress,
  profileImageUrl,
  userName,
  scrollY
}: HeaderProps) {
  const iconColor = useThemeColor({ light: '#11181C', dark: '#FFFFFF' }, 'text');
  
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const lastScrollY = useRef(0);
  const headerOffset = useRef(0);
  const scrollDirection = useRef<'down' | 'up' | null>(null);
  const scrollAccumulated = useRef(0);
  const isAnimating = useRef(false); // Indique si le header est en cours d'animation

  useEffect(() => {
    if (!scrollY) return;

    const listenerId = scrollY.addListener(({ value }) => {
      const diff = value - lastScrollY.current;
      const SCROLL_RANGE = 100; // Distance pour cacher/montrer complètement le header
      const TOP_THRESHOLD = 30; // Header toujours visible en haut
      const SCROLL_DOWN_THRESHOLD = 100; // Seuil pour commencer à cacher en scroll down
      const SCROLL_UP_THRESHOLD = 50; // Seuil pour commencer à afficher en scroll up
      
      // Si on est tout en haut de la page (0-30px), afficher le header
      if (value <= TOP_THRESHOLD) {
        translateY.setValue(0);
        opacity.setValue(1);
        headerOffset.current = 0;
        scrollAccumulated.current = 0;
        scrollDirection.current = null;
        isAnimating.current = false;
        lastScrollY.current = value;
        return;
      }
      
      // Détecter changement de direction
      const currentDirection = diff > 0 ? 'down' : diff < 0 ? 'up' : scrollDirection.current;
      
      if (currentDirection !== scrollDirection.current && currentDirection !== null) {
        // Changement de direction
        scrollDirection.current = currentDirection;
        
        // Réinitialiser l'accumulateur seulement si on n'est pas en cours d'animation
        if (!isAnimating.current) {
          scrollAccumulated.current = 0;
        }
      }
      
      // Accumuler le scroll
      scrollAccumulated.current += Math.abs(diff);
      
      // Déterminer le seuil en fonction de la direction
      const threshold = currentDirection === 'down' ? SCROLL_DOWN_THRESHOLD : SCROLL_UP_THRESHOLD;
      
      // Appliquer le comportement : soit on a dépassé le seuil, soit on est déjà en animation
      if (scrollAccumulated.current > threshold || isAnimating.current) {
        if (currentDirection === 'down') {
          // Scroll vers le bas : cacher le header progressivement
          headerOffset.current = Math.min(headerOffset.current + Math.abs(diff), SCROLL_RANGE);
          isAnimating.current = headerOffset.current > 0 && headerOffset.current < SCROLL_RANGE;
        } else if (currentDirection === 'up') {
          // Scroll vers le haut : montrer le header progressivement
          headerOffset.current = Math.max(headerOffset.current - Math.abs(diff), 0);
          isAnimating.current = headerOffset.current > 0 && headerOffset.current < SCROLL_RANGE;
        }
      }
      
      // Calculer le progress entre 0 (visible) et 1 (caché)
      const progress = headerOffset.current / SCROLL_RANGE;
      
      // Appliquer la transformation et l'opacité
      const newTranslateY = -100 * progress;
      const newOpacity = 1 - progress;
      
      translateY.setValue(newTranslateY);
      opacity.setValue(newOpacity);
      
      lastScrollY.current = value;
    });

    return () => {
      scrollY.removeListener(listenerId);
    };
  }, [scrollY, translateY, opacity]);

  return (
    <Animated.View 
      style={[
        styles.header,
        {
          transform: [{ translateY }],
          opacity,
        }
      ]}
    >
      <BlurView intensity={80} tint="light" style={styles.blurContainer}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.profileButton} onPress={onProfilePress}>
            <UserAvatar
              avatarUrl={profileImageUrl}
              userName={userName}
              size="small"
            />
          </TouchableOpacity>
          
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notificationButton} onPress={onNotificationPress}>
              <IconSymbol name="bell" size={24} color={iconColor} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.qrCodeButton} onPress={onQrCodePress}>
              <IconSymbol name="qrcode" size={24} color={iconColor} />
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    overflow: 'hidden',
  },
  blurContainer: {
    flex: 1,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 45, // Account for status bar
    paddingBottom: 5,
  },
  profileButton: {
    padding: 4,
  },
  headerProfileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  notificationButton: {
    padding: 8,
  },
  qrCodeButton: {
    padding: 8,
  },
});