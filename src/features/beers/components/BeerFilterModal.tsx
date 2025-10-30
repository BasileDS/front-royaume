import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Switch,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import type { BeerFilterState } from '../types';

interface BeerFilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: BeerFilterState;
  onApplyFilters: (filters: BeerFilterState) => void;
  hasEstablishment: boolean;
}

export function BeerFilterModal({
  visible,
  onClose,
  filters,
  onApplyFilters,
  hasEstablishment,
}: BeerFilterModalProps) {
  const colorScheme = useColorScheme();
  const [slideAnim] = useState(new Animated.Value(500));
  const [overlayOpacity] = useState(new Animated.Value(0));

  // État local pour les filtres (en édition)
  const [localFilters, setLocalFilters] = useState<BeerFilterState>(filters);

  // Synchroniser les filtres locaux quand la modale s'ouvre
  useEffect(() => {
    if (visible) {
      setLocalFilters(filters);
    }
  }, [visible, filters]);

  // Animation d'ouverture/fermeture
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 500,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, overlayOpacity]);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: BeerFilterState = {
      styleSearch: '',
      brewerySearch: '',
      sortByLikes: false,
      availableInMyEstablishment: false,
    };
    setLocalFilters(resetFilters);
  };

  const backgroundColor = Colors[colorScheme ?? 'light'].background;
  const textColor = Colors[colorScheme ?? 'light'].text;
  const subtextColor = colorScheme === 'dark' ? '#AAAAAA' : '#666666';
  const borderColor = colorScheme === 'dark' ? '#333333' : '#E0E0E0';
  const inputBgColor = colorScheme === 'dark' ? '#2A2A2A' : '#F5F5F5';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Overlay */}
        <Animated.View
          style={[
            styles.overlay,
            { opacity: overlayOpacity },
          ]}
        >
          <TouchableOpacity
            style={styles.overlayTouchable}
            activeOpacity={1}
            onPress={onClose}
          />
        </Animated.View>

        {/* Modal content */}
        <Animated.View
          style={[
            styles.modalContent,
            {
              backgroundColor,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: borderColor }]}>
              <Text style={[styles.title, { color: textColor }]}>
                Filtrer les bières
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={[styles.closeButtonText, { color: textColor }]}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Body */}
            <ScrollView
              style={styles.body}
              contentContainerStyle={styles.bodyContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Style Search */}
              <View style={styles.filterSection}>
                <Text style={[styles.label, { color: textColor }]}>Style de bière</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: inputBgColor,
                      color: textColor,
                      borderColor,
                    },
                  ]}
                  placeholder="Ex: IPA, Lager, Stout..."
                  placeholderTextColor={subtextColor}
                  value={localFilters.styleSearch}
                  onChangeText={(text) =>
                    setLocalFilters({ ...localFilters, styleSearch: text })
                  }
                />
              </View>

              {/* Brewery Search */}
              <View style={styles.filterSection}>
                <Text style={[styles.label, { color: textColor }]}>Brasserie</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: inputBgColor,
                      color: textColor,
                      borderColor,
                    },
                  ]}
                  placeholder="Ex: Brasserie du Royaume..."
                  placeholderTextColor={subtextColor}
                  value={localFilters.brewerySearch}
                  onChangeText={(text) =>
                    setLocalFilters({ ...localFilters, brewerySearch: text })
                  }
                />
              </View>

              {/* Sort by Likes */}
              <View style={styles.filterSection}>
                <View style={styles.switchRow}>
                  <View style={styles.switchLabel}>
                    <Text style={[styles.label, { color: textColor }]}>
                      Trier par popularité
                    </Text>
                    <Text style={[styles.helperText, { color: subtextColor }]}>
                      Afficher les bières les plus likées en premier
                    </Text>
                  </View>
                  <Switch
                    value={localFilters.sortByLikes}
                    onValueChange={(value) =>
                      setLocalFilters({ ...localFilters, sortByLikes: value })
                    }
                    trackColor={{
                      false: borderColor,
                      true: Colors[colorScheme ?? 'light'].tint,
                    }}
                    thumbColor="#fff"
                  />
                </View>
              </View>

              {/* Available in My Establishment */}
              {hasEstablishment && (
                <View style={styles.filterSection}>
                  <View style={styles.switchRow}>
                    <View style={styles.switchLabel}>
                      <Text style={[styles.label, { color: textColor }]}>
                        Dans mon établissement
                      </Text>
                      <Text style={[styles.helperText, { color: subtextColor }]}>
                        Uniquement les bières disponibles dans votre bar
                      </Text>
                    </View>
                    <Switch
                      value={localFilters.availableInMyEstablishment}
                      onValueChange={(value) =>
                        setLocalFilters({
                          ...localFilters,
                          availableInMyEstablishment: value,
                        })
                      }
                      trackColor={{
                        false: borderColor,
                        true: Colors[colorScheme ?? 'light'].tint,
                      }}
                      thumbColor="#fff"
                    />
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Footer */}
            <View style={[styles.footer, { borderTopColor: borderColor }]}>
              <TouchableOpacity
                style={[styles.button, styles.resetButton, { borderColor }]}
                onPress={handleReset}
              >
                <Text style={[styles.resetButtonText, { color: textColor }]}>
                  Réinitialiser
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.applyButton,
                  { backgroundColor: Colors[colorScheme ?? 'light'].tint },
                ]}
                onPress={handleApply}
              >
                <Text style={styles.applyButtonText}>Appliquer</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlayTouchable: {
    flex: 1,
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: '300',
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
  },
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    flex: 1,
    marginRight: 12,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    borderWidth: 1,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {},
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
