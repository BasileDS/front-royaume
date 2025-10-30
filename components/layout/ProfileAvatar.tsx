import { UserAvatar } from '@/components/common';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface ProfileAvatarProps {
  onPress?: () => void;
  profileImageUrl?: string | null;
  userName?: string;
  fixed?: boolean;
}

/**
 * Avatar de profil cliquable pour ouvrir la sidebar
 * Peut être en position fixe ou relative
 */
export function ProfileAvatar({
  onPress,
  profileImageUrl,
  userName,
  fixed = true,
}: ProfileAvatarProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        fixed && styles.containerFixed,
      ]}
      onPress={onPress}
    >
      <UserAvatar
        avatarUrl={profileImageUrl}
        userName={userName}
        size="small"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 32,
    height: 32,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  containerFixed: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 1001,
  },
});
