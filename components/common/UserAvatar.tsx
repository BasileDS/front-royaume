import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { Image, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface UserAvatarProps {
  avatarUrl?: string | null;
  userName?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  style?: ViewStyle;
  showStrokes?: boolean;
}

/**
 * Composant réutilisable pour afficher l'avatar d'un utilisateur
 * Affiche l'image si disponible, sinon affiche l'initiale du nom
 */
export function UserAvatar({ 
  avatarUrl, 
  userName, 
  size = 'medium',
  style,
  showStrokes = false
}: UserAvatarProps) {
  const backgroundColor = useThemeColor({ light: '#F5F5F5', dark: '#2A2A2A' }, 'backgroundSecondary');
  const accentColor = '#FF6B35';

  // Obtenir l'initiale pour l'avatar par défaut
  const getInitial = () => {
    if (userName) {
      return userName.charAt(0).toUpperCase();
    }
    return '?';
  };

  // Définir les dimensions selon la taille
  const dimensions = {
    small: 32,
    medium: 48,
    large: 80,
    xlarge: 120,
  };

  const fontSize = {
    small: 14,
    medium: 20,
    large: 32,
    xlarge: 48,
  };

  const avatarSize = dimensions[size];
  const textSize = fontSize[size];
  const borderRadius = avatarSize / 2;

  // Tailles pour les strokes (bordures concentriques)
  const outerStrokeSize = avatarSize + 8; // 4px de chaque côté
  const innerStrokeSize = avatarSize + 4; // 2px de chaque côté

  // Rendu de l'avatar sans strokes
  const avatarContent = (
    <View 
      style={[
        styles.container,
        { 
          width: avatarSize, 
          height: avatarSize, 
          borderRadius 
        }
      ]}
    >
      {avatarUrl ? (
        <Image 
          source={{ uri: avatarUrl }} 
          style={[
            styles.image,
            { 
              width: avatarSize, 
              height: avatarSize, 
              borderRadius 
            }
          ]}
          resizeMode="cover"
        />
      ) : (
        <View 
          style={[
            styles.placeholder,
            { 
              width: avatarSize, 
              height: avatarSize, 
              borderRadius,
              backgroundColor 
            }
          ]}
        >
          <Text 
            style={[
              styles.initial,
              { 
                color: accentColor,
                fontSize: textSize 
              }
            ]}
          >
            {getInitial()}
          </Text>
        </View>
      )}
    </View>
  );

  // Si showStrokes est false, retourner seulement l'avatar
  if (!showStrokes) {
    return <View style={style}>{avatarContent}</View>;
  }

  // Sinon, retourner l'avatar avec les strokes
  return (
    <View 
      style={[
        styles.outerStroke,
        { 
          width: outerStrokeSize, 
          height: outerStrokeSize, 
          borderRadius: outerStrokeSize / 2,
        },
        style
      ]}
    >
      <View 
        style={[
          styles.innerStroke,
          { 
            width: innerStrokeSize, 
            height: innerStrokeSize, 
            borderRadius: innerStrokeSize / 2,
          }
        ]}
      >
        {avatarContent}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerStroke: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(55, 55, 55, 0.94)', // #474C50 at 94% opacity
  },
  innerStroke: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(101, 101, 101, 0.94)', // #2B2F30 at 94% opacity
  },
  container: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    // resizeMode is now set inline
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initial: {
    fontWeight: 'bold',
  },
});
