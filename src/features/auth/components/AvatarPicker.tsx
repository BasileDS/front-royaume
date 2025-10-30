import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface AvatarPickerProps {
  currentAvatarUrl?: string | null;
  userName?: string;
  onAvatarChange: (avatarUrl: string) => Promise<void>;
}

/**
 * Composant pour afficher et modifier la photo de profil
 */
export function AvatarPicker({ currentAvatarUrl, userName, onAvatarChange }: AvatarPickerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({ light: '#E0E0E0', dark: '#444' }, 'border');
  const backgroundColor = useThemeColor({ light: '#F5F5F5', dark: '#2A2A2A' }, 'backgroundSecondary');

  // Obtenir l'initiale pour l'avatar par défaut
  const getInitial = () => {
    if (userName) {
      return userName.charAt(0).toUpperCase();
    }
    return '?';
  };

  // Demander les permissions
  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission requise',
          'Nous avons besoin de la permission pour accéder à vos photos.'
        );
        return false;
      }
    }
    return true;
  };

  // Sélectionner une image
  const pickImage = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setIsUploading(true);
        try {
          await onAvatarChange(result.assets[0].uri);
        } catch (error) {
          Alert.alert('Erreur', 'Impossible de mettre à jour la photo de profil');
          console.error('Erreur upload avatar:', error);
        } finally {
          setIsUploading(false);
        }
      }
    } catch (error) {
      console.error('Erreur pickImage:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner une image');
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={pickImage}
        disabled={isUploading}
        style={[styles.avatarContainer, { borderColor }]}
      >
        {currentAvatarUrl ? (
          <Image source={{ uri: currentAvatarUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor }]}>
            <Text style={[styles.avatarInitial, { color: '#FF6B35' }]}>
              {getInitial()}
            </Text>
          </View>
        )}

        {isUploading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#FF6B35" />
          </View>
        )}

        <View style={styles.editBadge}>
          <Ionicons name="camera" size={20} color="white" />
        </View>
      </Pressable>

      <Text style={[styles.helpText, { color: textColor }]}>
        Appuyez pour changer la photo
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 48,
    fontWeight: '600',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  helpText: {
    marginTop: 12,
    fontSize: 14,
    opacity: 0.7,
  },
});
