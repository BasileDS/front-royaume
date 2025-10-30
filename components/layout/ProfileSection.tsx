import { UserAvatar } from '@/components/common';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ProfileSectionProps {
  userName?: string;
  userTitle?: string;
  userLevel?: string;
  userEstablishment?: string;
  profileImageUrl?: string | null;
  badgeImageUrl?: string;
}

export function ProfileSection({ 
  userName,
  userTitle,
  userLevel,
  userEstablishment,
  profileImageUrl,
  badgeImageUrl = 'https://via.placeholder.com/32x32'
}: ProfileSectionProps) {
  // Utiliser le niveau comme titre s'il est fourni, sinon utiliser userTitle
  const displayTitle = userLevel || userTitle;
  const textColor = useThemeColor({}, 'text');
  const accentColor = useThemeColor({}, 'accent');
  const secondaryTextColor = useThemeColor({ light: '#666666', dark: '#999999' }, 'text');
  const badgeBackground = useThemeColor({ light: '#cdcdcdff', dark: '#3A3D41' }, 'backgroundSecondary');

  return (
    <View style={styles.profileSection}>
      <View style={styles.profileImageContainer}>
        <UserAvatar
          avatarUrl={profileImageUrl}
          userName={userName}
          size="xlarge"
          showStrokes={true}
        />
        <View style={[styles.profileBadge, { backgroundColor: badgeBackground }]}>
          <Image
            source={{ uri: badgeImageUrl }}
            style={styles.badgeImage}
          />
        </View>
      </View>
      
      {userName && <Text style={[styles.userName, { color: textColor }]}>{userName}</Text>}
      {(displayTitle || userEstablishment) && (
        <View style={styles.infoContainer}>
          {displayTitle && <Text style={[styles.userTitle, { color: accentColor }]}>{displayTitle}</Text>}
          {displayTitle && userEstablishment && <Text style={[styles.separator, { color: secondaryTextColor }]}> • </Text>}
          {userEstablishment && <Text style={[styles.userEstablishment, { color: secondaryTextColor }]}>{userEstablishment}</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  profileImageContainer: {
    alignItems: 'center',
    position: 'relative',
    marginBottom: 15,
    justifyContent: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
  },
  profileBadge: {
    marginTop: -16,
    width: 32,
    aspectRatio: 1,
    borderRadius: 16,
    padding: 2,
  },
  badgeImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  userTitle: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  separator: {
    fontSize: 16,
  },
  userEstablishment: {
    fontSize: 16,
  },
});