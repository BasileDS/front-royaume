import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

interface DashboardEstablishmentsSectionProps {
  title?: string;
}

/**
 * Section Call to Action pour découvrir les établissements
 * Affiche une invitation à explorer les établissements du Royaume
 */
export function DashboardEstablishmentsSection({ 
  title = 'Découvrez le Royaume' 
}: DashboardEstablishmentsSectionProps) {
  const textColor = useThemeColor({}, 'text');
  const cardBgColor = useThemeColor({ light: '#ffffff', dark: '#2c2c2e' }, 'background');
  const router = useRouter();

  const handleExplore = () => {
    router.push('/(tabs)/establishments');
  };

  return (
    <View style={[styles.section]}>
      <View style={styles.header}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>{title}</Text>
      </View>

      <View style={[styles.ctaCard, { backgroundColor: cardBgColor }]}>
        <View style={styles.content}>
          <Text style={[styles.ctaTitle, { color: textColor }]}>
            Explorez nos établissements
          </Text>
          <Text style={[styles.ctaDescription, { color: textColor }]}>
            Découvrez tous les bars, restaurants et lieux partenaires du Royaume des Paraiges
          </Text>
          
          <TouchableOpacity 
            style={styles.ctaButton}
            onPress={handleExplore}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaButtonText}>Découvrir maintenant</Text>
            <Text style={styles.ctaButtonArrow}>→</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
    paddingVertical: 15,
    borderRadius: 12,
  },
  header: {
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  ctaCard: {
    marginHorizontal: 10,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  icon: {
    fontSize: 30,
  },
  content: {
    gap: 10,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  ctaDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
    marginBottom: 10,
  },
  ctaButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 5,
  },
  ctaButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  ctaButtonArrow: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
