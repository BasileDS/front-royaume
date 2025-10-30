import { BackButton, ThemedText, ThemedView } from '@/components/common';
import { establishmentService, useEstablishment } from '@/src/features/establishments';
import { useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';

/**
 * Page de détail d'un établissement
 */
export default function EstablishmentDetail() {
  const { id } = useLocalSearchParams();
  const establishmentId = parseInt(id as string, 10);
  const { establishment, loading, error } = useEstablishment(establishmentId);

  const handleCall = () => {
    if (establishment?.phone) {
      const phoneNumber = establishment.phone.replace(/\s/g, '');
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleEmail = () => {
    if (establishment?.email) {
      Linking.openURL(`mailto:${establishment.email}`);
    }
  };

  const handleWebsite = () => {
    if (establishment?.website) {
      Linking.openURL(establishment.website);
    }
  };

  const handleOpenMap = () => {
    if (establishment?.latitude && establishment?.longitude) {
      const scheme = Platform.select({
        ios: 'maps:',
        android: 'geo:',
      });
      const url = Platform.select({
        ios: `${scheme}?q=${establishment.latitude},${establishment.longitude}`,
        android: `${scheme}${establishment.latitude},${establishment.longitude}`,
      });
      if (url) {
        Linking.openURL(url);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <BackButton fixed color="#fff" />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <ThemedText style={styles.loadingText}>Chargement...</ThemedText>
        </View>
      </View>
    );
  }

  if (error || !establishment) {
    return (
      <View style={styles.loadingContainer}>
        <BackButton fixed color="#fff" />
        <View style={styles.centerContainer}>
          <ThemedText style={styles.errorText}>
            ❌ {error?.message || 'Établissement introuvable'}
          </ThemedText>
          <Pressable style={styles.backButton}>
            <ThemedText style={styles.backButtonText}>← Retour</ThemedText>
          </Pressable>
        </View>
      </View>
    );
  }

  const imageUrl = establishment.featured_image
    ? establishmentService.getImageUrl(establishment, {
        width: 800,
        height: 400,
        fit: 'cover',
        quality: 80,
      })
    : null;

  return (
    <View style={styles.container}>
      {/* Bouton retour fixe en haut à gauche */}
      <BackButton fixed color="#fff" />
      
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {/* Image principale */}
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.headerImage} />
        ) : (
          <View style={[styles.headerImage, styles.placeholderImage]}>
            <ThemedText style={styles.placeholderIcon}>🏪</ThemedText>
          </View>
        )}

        {/* Contenu */}
        <ThemedView style={styles.content}>
          {/* Nom et type */}
          <View style={styles.headerSection}>
            <ThemedText type="title" style={styles.name}>
              {establishment.title}
            </ThemedText>
            {establishment.type && (
              <View style={styles.typeBadge}>
                <ThemedText style={styles.typeText}>{establishment.type}</ThemedText>
              </View>
            )}
          </View>

          {/* Description */}
          {establishment.description && (
            <View style={styles.section}>
              <ThemedText style={styles.description}>{establishment.description}</ThemedText>
            </View>
          )}

          {/* Informations de contact */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>📞 Contact</ThemedText>

            {establishment.phone && (
              <Pressable style={styles.contactItem} onPress={handleCall}>
                <ThemedText style={styles.contactLabel}>Téléphone</ThemedText>
                <ThemedText style={styles.contactValue}>{establishment.phone}</ThemedText>
              </Pressable>
            )}

            {establishment.email && (
              <Pressable style={styles.contactItem} onPress={handleEmail}>
                <ThemedText style={styles.contactLabel}>Email</ThemedText>
                <ThemedText style={styles.contactValue}>{establishment.email}</ThemedText>
              </Pressable>
            )}

            {establishment.website && (
              <Pressable style={styles.contactItem} onPress={handleWebsite}>
                <ThemedText style={styles.contactLabel}>Site web</ThemedText>
                <ThemedText style={[styles.contactValue, styles.linkText]}>
                  Visiter le site →
                </ThemedText>
              </Pressable>
            )}
          </View>

          {/* Adresse */}
          {(establishment.line_address_1 || establishment.line_address_2 || establishment.city) && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>📍 Adresse</ThemedText>
              <View style={styles.addressContainer}>
                {establishment.line_address_1 && (
                  <ThemedText style={styles.addressLine}>{establishment.line_address_1}</ThemedText>
                )}
                {establishment.line_address_2 && (
                  <ThemedText style={styles.addressLine}>{establishment.line_address_2}</ThemedText>
                )}
                {(establishment.zipcode || establishment.city) && (
                  <ThemedText style={styles.addressLine}>
                    {establishment.zipcode} {establishment.city}
                  </ThemedText>
                )}
                {establishment.latitude && establishment.longitude && (
                  <Pressable style={styles.mapButton} onPress={handleOpenMap}>
                    <ThemedText style={styles.mapButtonText}>🗺️ Ouvrir dans Maps</ThemedText>
                  </Pressable>
                )}
              </View>
            </View>
          )}

          {/* Horaires */}
          {establishment.opening_hours && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>🕐 Horaires d&apos;ouverture</ThemedText>
              <ThemedText style={styles.openingHours}>{establishment.opening_hours}</ThemedText>
            </View>
          )}
        </ThemedView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  backButtonFixed: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 16,
    zIndex: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 120,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  headerImage: {
    width: '100%',
    height: 250,
  },
  placeholderImage: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 80,
  },
  content: {
    padding: 20,
  },
  headerSection: {
    marginBottom: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#4A90E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  typeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    opacity: 0.8,
  },
  contactItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  contactLabel: {
    fontSize: 13,
    opacity: 0.6,
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  linkText: {
    color: '#4A90E2',
  },
  addressContainer: {
    padding: 15,
    backgroundColor: 'rgba(74, 144, 226, 0.05)',
    borderRadius: 8,
  },
  addressLine: {
    fontSize: 15,
    marginBottom: 4,
  },
  mapButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#4A90E2',
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  mapButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  openingHours: {
    fontSize: 15,
    lineHeight: 24,
    padding: 15,
    backgroundColor: 'rgba(74, 144, 226, 0.05)',
    borderRadius: 8,
  },
});
