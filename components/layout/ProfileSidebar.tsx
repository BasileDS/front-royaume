import { UserAvatar } from '@/components/common';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/features/auth';
import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useEffect } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

interface ProfileSidebarProps {
  visible: boolean;
  onClose: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToOrders?: () => void;
  userName?: string;
  userEmail?: string;
  profileImageUrl?: string | null;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.8; // 80% de la largeur de l'écran

export function ProfileSidebar({
  visible,
  onClose,
  onNavigateToProfile,
  onNavigateToOrders,
  userName = 'Utilisateur',
  userEmail,
  profileImageUrl,
}: ProfileSidebarProps) {
  const { signOut } = useAuth();
  const slideAnim = React.useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const overlayOpacity = React.useRef(new Animated.Value(0)).current;
  const wasVisible = React.useRef(false);

  const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'background');
  const textColor = useThemeColor({}, 'text');
  const subtextColor = useThemeColor({ light: '#666666', dark: '#AAAAAA' }, 'textSecondary');
  const borderColor = useThemeColor({ light: '#E0E0E0', dark: '#333333' }, 'border');

  useEffect(() => {
    if (visible) {
      // Réinitialiser les valeurs avant l'ouverture
      slideAnim.setValue(-SIDEBAR_WIDTH);
      overlayOpacity.setValue(0);
      
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      
      wasVisible.current = true;
    } else if (wasVisible.current) {
      // Animer la fermeture seulement si on était ouvert
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -SIDEBAR_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
      
      wasVisible.current = false;
    }
  }, [visible, slideAnim, overlayOpacity]);

  const handleLogout = async () => {
    try {
      await signOut();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const menuItems = [
    {
      icon: 'person.circle' as const,
      label: 'Mon Profil',
      onPress: () => {
        onNavigateToProfile?.();
        onClose();
      },
    },
    {
      icon: 'doc.text' as const,
      label: 'Mes commandes',
      onPress: () => {
        onNavigateToOrders?.();
        onClose();
      },
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.container}>
        {/* Overlay semi-transparent */}
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={[
              styles.overlay,
              {
                opacity: overlayOpacity,
              },
            ]}
          />
        </TouchableWithoutFeedback>

        {/* Sidebar */}
        <Animated.View
          style={[
            styles.sidebar,
            {
              backgroundColor,
              width: SIDEBAR_WIDTH,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {/* Header avec bouton de fermeture */}
          <View style={styles.sidebarHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <IconSymbol name="xmark" size={24} color={textColor} />
            </TouchableOpacity>
          </View>

          {/* Section Profil */}
          <View style={styles.profileSection}>
            <UserAvatar
              avatarUrl={profileImageUrl}
              userName={userName}
              size="large"
            />
            <Text style={[styles.userName, { color: textColor }]}>{userName}</Text>
            {userEmail && (
              <Text style={[styles.userEmail, { color: subtextColor }]}>{userEmail}</Text>
            )}
          </View>

          {/* Séparateur */}
          <View style={[styles.separator, { backgroundColor: borderColor }]} />

          {/* Menu items */}
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.menuItem, { borderBottomColor: borderColor }]}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <IconSymbol name={item.icon} size={24} color={textColor} />
                <Text style={[styles.menuLabel, { color: textColor }]}>{item.label}</Text>
                <IconSymbol name="chevron.right" size={18} color={subtextColor} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Séparateur */}
          <View style={[styles.separator, { backgroundColor: borderColor }]} />

          {/* Bouton de déconnexion */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <IconSymbol name="rectangle.portrait.and.arrow.right" size={24} color="#FF3B30" />
            <Text style={styles.logoutText}>Déconnexion</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 8,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 15,
    backgroundColor: '#E0E0E0',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
  },
  separator: {
    height: 1,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  menuContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 15,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: 10,
    gap: 15,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
});
