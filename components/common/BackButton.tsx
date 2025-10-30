import { IconSymbol } from '@/components/ui/IconSymbol';
import { useNavigationHistory } from '@/contexts/NavigationHistoryContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface BackButtonProps {
  /**
   * Couleur de l'icône (par défaut: noir)
   */
  color?: string;
  /**
   * Taille de l'icône (par défaut: 28)
   */
  size?: number;
  /**
   * Route de destination spécifique (si non définie, utilise router.back())
   */
  route?: string;
  /**
   * Position fixe en haut à gauche (par défaut: false)
   */
  fixed?: boolean;
  /**
   * Style personnalisé
   */
  style?: any;
  /**
   * Callback personnalisé au lieu du comportement par défaut
   */
  onPress?: () => void;
}

/**
 * Composant de bouton retour réutilisable
 * Utilise l'historique de navigation pour retourner à la page précédente
 * Fallback vers /(tabs)/ si pas d'historique disponible
 */
export function BackButton({
  color = '#000',
  size = 28,
  route,
  fixed = false,
  style,
  onPress,
}: BackButtonProps) {
  const router = useRouter();
  const { canGoBack, previousRoute } = useNavigationHistory();

  const handlePress = () => {
    if (onPress) {
      // Callback personnalisé prioritaire
      onPress();
    } else if (route) {
      // Route spécifique fournie
      router.push(route as any);
    } else if (canGoBack && previousRoute) {
      // Utiliser l'historique de navigation personnalisé
      router.push(previousRoute as any);
    } else {
      // Fallback: essayer router.back() natif ou rediriger vers dashboard
      try {
        if (router.canGoBack && router.canGoBack()) {
          router.back();
        } else {
          router.push('/(tabs)/' as any);
        }
      } catch {
        // En cas d'erreur, rediriger vers le dashboard
        router.push('/(tabs)/' as any);
      }
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.backButton,
        fixed && styles.backButtonFixed,
        style,
      ]}
    >
      <IconSymbol name="chevron.left" size={size} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  backButtonFixed: {
    position: 'absolute',
    top: 50,
    right: 16,
    zIndex: 1000,
  },
});
