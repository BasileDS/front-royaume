import { UserAvatar } from '@/components/common';
import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { CommentWithUser } from '../types';

interface CommentItemProps {
  comment: CommentWithUser;
}

/**
 * Composant pour afficher un commentaire individuel
 */
export function CommentItem({ comment }: CommentItemProps) {
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({ light: '#666', dark: '#AAA' }, 'textSecondary');
  const backgroundColor = useThemeColor({ light: '#F5F5F5', dark: '#2A2A2A' }, 'backgroundSecondary');
  const borderColor = useThemeColor({ light: '#E0E0E0', dark: '#444' }, 'border');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'À l\'instant';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  // Récupérer le nom d'affichage (first_name + last_name > username > email username > "Utilisateur")
  const getDisplayName = () => {
    if (comment.user_first_name && comment.user_last_name) {
      return `${comment.user_first_name} ${comment.user_last_name}`;
    }
    if (comment.user_username) {
      return comment.user_username;
    }
    if (comment.user_email) {
      return comment.user_email.split('@')[0];
    }
    return 'Utilisateur';
  };

  const displayName = getDisplayName();
  const avatarUrl = comment.user_avatar_url || null;

  return (
    <View style={[styles.container, { backgroundColor, borderColor }]}>
      <View style={styles.header}>
        <UserAvatar
          avatarUrl={avatarUrl}
          userName={displayName}
          size="medium"
        />
        
        <View style={styles.headerText}>
          <Text style={[styles.author, { color: textColor }]}>
            {displayName}
          </Text>
          <Text style={[styles.date, { color: secondaryTextColor }]}>
            {formatDate(comment.created_at)}
          </Text>
        </View>
      </View>

      <Text style={[styles.content, { color: textColor }]}>
        {comment.content}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerText: {
    flex: 1,
  },
  author: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  date: {
    fontSize: 13,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
  },
});
