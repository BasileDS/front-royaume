import { AvatarPicker, useAuth } from '@/src/features/auth';
import { ProfileService } from '@/src/features/auth/services/profileService';
import { AuthError, UpdateProfileData, UserProfile } from '@/src/features/auth/types';
import { useEstablishments } from '@/src/features/establishments';
import { UploadService } from '@/src/shared/services/uploadService';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActionSheetIOS,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProfileSettingsScreen() {
  const { signOut, userProfile: contextProfile, refreshProfile } = useAuth();
  const { establishments, loading: loadingEstablishments } = useEstablishments();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showEstablishmentModal, setShowEstablishmentModal] = useState(false);

  // Champs du formulaire
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [phone, setPhone] = useState('');
  const [establishmentId, setEstablishmentId] = useState<number | null>(null);

  /**
   * Chargement des données du profil
   */
  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      // Utiliser le profil du contexte si disponible, sinon charger depuis la DB
      const userProfile = contextProfile || await ProfileService.getUserProfile();
      
      if (userProfile) {
        setProfile(userProfile);
        
        const firstName = userProfile.first_name || '';
        const lastName = userProfile.last_name || '';
        const username = userProfile.username || '';
        const phone = userProfile.phone || '';
        const establishmentId = userProfile.attached_establishment_id || null;
        
        setFirstName(firstName);
        setLastName(lastName);
        setUsername(username);
        setPhone(phone);
        setEstablishmentId(establishmentId);
        
        // Formater la date si elle existe
        if (userProfile.birthdate) {
          const date = new Date(userProfile.birthdate);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          const formatted = `${day}/${month}/${year}`;
          setBirthdate(formatted);
        }
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement du profil:', error);
      Alert.alert('Erreur', 'Impossible de charger les données du profil');
    } finally {
      setIsLoading(false);
    }
  }, [contextProfile]);

  /**
   * Chargement du profil au montage
   */
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  /**
   * Gestion du changement d'avatar
   */
  const handleAvatarChange = async (localUri: string) => {
    try {
      if (!profile?.id) {
        throw new Error('Profil non chargé');
      }

      // Upload de l'image vers Supabase Storage
      const avatarUrl = await UploadService.uploadAvatar(localUri, profile.id);

      // Supprimer l'ancien avatar si existant
      if (profile.avatar_url) {
        await UploadService.deleteAvatar(profile.avatar_url);
      }

      // Mettre à jour le profil avec la nouvelle URL
      const updatedProfile = await ProfileService.updateProfile({
        avatar_url: avatarUrl,
      });

      setProfile(updatedProfile);
      // Rafraîchir le profil dans le contexte
      await refreshProfile();
      Alert.alert('Succès', 'Votre photo de profil a été mise à jour');
    } catch (error) {
      console.error('Erreur handleAvatarChange:', error);
      throw error;
    }
  };

  /**
   * Formatter la date au format JJ/MM/AAAA
   */
  const formatBirthdate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const limited = cleaned.substring(0, 8);
    
    let formatted = '';
    if (limited.length > 0) {
      formatted = limited.substring(0, 2);
    }
    if (limited.length >= 3) {
      formatted += '/' + limited.substring(2, 4);
    }
    if (limited.length >= 5) {
      formatted += '/' + limited.substring(4, 8);
    }
    
    setBirthdate(formatted);
  };

  /**
   * Convertir JJ/MM/AAAA en AAAA-MM-JJ
   */
  const convertBirthdateToISO = (formatted: string): string | undefined => {
    if (!formatted || formatted.length < 10) return undefined;
    
    const parts = formatted.split('/');
    if (parts.length !== 3) return undefined;
    
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  };

  /**
   * Afficher le sélecteur d'établissement
   */
  const showEstablishmentPicker = () => {
    if (Platform.OS === 'web') {
      // Sur le web, ouvrir le modal personnalisé
      setShowEstablishmentModal(true);
    } else if (Platform.OS === 'ios') {
      const options = ['Annuler', 'Aucun établissement', ...establishments.map(e => e.title || '')];
      const cancelButtonIndex = 0;

      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) return;
          if (buttonIndex === 1) {
            setEstablishmentId(null);
          } else {
            const selectedEstablishment = establishments[buttonIndex - 2];
            if (selectedEstablishment?.id) {
              setEstablishmentId(selectedEstablishment.id);
            }
          }
        }
      );
    } else {
      Alert.alert(
        'Choisir un établissement',
        'Sélectionnez votre bar préféré',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Aucun établissement', onPress: () => setEstablishmentId(null) },
          ...establishments.map((establishment) => ({
            text: establishment.title || '',
            onPress: () => {
              if (establishment.id) {
                setEstablishmentId(establishment.id);
              }
            },
          })),
        ]
      );
    }
  };

  /**
   * Obtenir le nom de l'établissement sélectionné
   */
  const getSelectedEstablishmentName = () => {
    if (!establishmentId) return 'Aucun établissement';
    const establishment = establishments.find(e => e.id === establishmentId);
    return establishment?.title || 'Aucun établissement';
  };

  /**
   * Sauvegarde du profil
   */
  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);

      // Validation du format du username si modifié
      if (username) {
        const usernameRegex = /^[a-z0-9._-]{3,30}$/;
        if (!usernameRegex.test(username)) {
          Alert.alert(
            'Username invalide',
            'Le nom d\'utilisateur doit contenir entre 3 et 30 caractères et uniquement des lettres minuscules, chiffres, points, tirets et underscores.'
          );
          setIsSaving(false);
          return;
        }
      }

      // Préparer les données à mettre à jour
      const updateData: UpdateProfileData = {};

      if (firstName) updateData.first_name = firstName;
      if (lastName) updateData.last_name = lastName;
      if (username) updateData.username = username;
      if (phone) updateData.phone = phone;
      if (establishmentId !== null) updateData.attached_establishment_id = establishmentId;
      
      // Convertir la date si fournie
      if (birthdate) {
        const isoDate = convertBirthdateToISO(birthdate);
        if (isoDate) {
          updateData.birthdate = isoDate;
        }
      }

      // Mettre à jour le profil
      const updatedProfile = await ProfileService.updateProfile(updateData);
      setProfile(updatedProfile);
      // Rafraîchir le profil dans le contexte
      await refreshProfile();

      Alert.alert('Succès', 'Votre profil a été mis à jour avec succès');
    } catch (error) {
      if (error instanceof AuthError) {
        Alert.alert('Erreur', error.message);
      } else {
        Alert.alert('Erreur', 'Une erreur est survenue lors de la mise à jour du profil');
      }
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Changement de mot de passe
   */
  const handleChangePassword = () => {
    router.push('/(auth)/forgot-password');
  };

  /**
   * Déconnexion
   */
  const handleSignOut = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/(auth)/login');
            } catch (error) {
              console.error('Erreur lors de la déconnexion:', error);
              Alert.alert('Erreur', 'Une erreur est survenue lors de la déconnexion');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement du profil...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Paramètres du profil</Text>
          <Text style={styles.subtitle}>Gérez vos informations personnelles</Text>

          {/* Photo de profil */}
          <AvatarPicker
            currentAvatarUrl={profile?.avatar_url}
            userName={profile?.username || `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || profile?.email || ''}
            onAvatarChange={handleAvatarChange}
          />

          {/* Section Informations personnelles */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations personnelles</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Prénom</Text>
              <TextInput
                style={styles.input}
                placeholder="Jean"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                editable={!isSaving}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nom</Text>
              <TextInput
                style={styles.input}
                placeholder="Dupont"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                editable={!isSaving}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nom d&apos;utilisateur</Text>
              <TextInput
                style={styles.input}
                placeholder="jeandupont"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                editable={!isSaving}
              />
              <Text style={styles.helperText}>3-30 caractères : lettres minuscules, chiffres, . _ -</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Date de naissance</Text>
              <TextInput
                style={styles.input}
                placeholder="JJ/MM/AAAA"
                value={birthdate}
                onChangeText={formatBirthdate}
                keyboardType="number-pad"
                maxLength={10}
                editable={!isSaving}
              />
              <Text style={styles.helperText}>Format: JJ/MM/AAAA</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Numéro de téléphone</Text>
              <TextInput
                style={styles.input}
                placeholder="+33 6 12 34 56 78"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                editable={!isSaving}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Établissement de référence</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={showEstablishmentPicker}
                disabled={isSaving || loadingEstablishments}
              >
                <Text style={[
                  styles.pickerButtonText,
                  !establishmentId && styles.pickerButtonPlaceholder
                ]}>
                  {loadingEstablishments ? 'Chargement...' : getSelectedEstablishmentName()}
                </Text>
                <Text style={styles.pickerButtonArrow}>▼</Text>
              </TouchableOpacity>
              <Text style={styles.helperText}>Votre bar préféré du Royaume</Text>
            </View>

            <TouchableOpacity
              style={[styles.button, styles.primaryButton, isSaving && styles.buttonDisabled]}
              onPress={handleSaveProfile}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sauvegarder les modifications</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Section Compte */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Compte</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={profile?.email || ''}
                editable={false}
              />
              <Text style={styles.helperText}>
                L&apos;email ne peut pas être modifié ici
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleChangePassword}
              disabled={isSaving}
            >
              <Text style={styles.secondaryButtonText}>Changer le mot de passe</Text>
            </TouchableOpacity>
          </View>

          {/* Section Informations du compte */}
          {profile?.created_at && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informations du compte</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Membre depuis</Text>
                <Text style={styles.infoValue}>
                  {new Date(profile.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </Text>
              </View>
              {profile.updated_at && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Dernière modification</Text>
                  <Text style={styles.infoValue}>
                    {new Date(profile.updated_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Section Déconnexion */}
          <View style={styles.section}>
            <TouchableOpacity
              style={[styles.button, styles.dangerButton]}
              onPress={handleSignOut}
              disabled={isSaving}
            >
              <Text style={styles.dangerButtonText}>Se déconnecter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal pour sélectionner l'établissement sur le web */}
      <Modal
        visible={showEstablishmentModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowEstablishmentModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowEstablishmentModal(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choisir un établissement</Text>
              <TouchableOpacity
                onPress={() => setShowEstablishmentModal(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setEstablishmentId(null);
                  setShowEstablishmentModal(false);
                }}
              >
                <Text style={[styles.modalItemText, !establishmentId && styles.modalItemTextSelected]}>
                  Aucun établissement
                </Text>
              </TouchableOpacity>
              {establishments.map((establishment) => (
                <TouchableOpacity
                  key={establishment.id}
                  style={styles.modalItem}
                  onPress={() => {
                    if (establishment.id) {
                      setEstablishmentId(establishment.id);
                    }
                    setShowEstablishmentModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      establishmentId === establishment.id && styles.modalItemTextSelected,
                    ]}
                  >
                    {establishment.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 16,
    paddingBottom: 100,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#999',
  },
  pickerButton: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  pickerButtonPlaceholder: {
    color: '#999',
  },
  pickerButtonArrow: {
    fontSize: 12,
    color: '#999',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  dangerButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dangerButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  // Styles pour le modal web
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalCloseText: {
    fontSize: 24,
    color: '#666',
    lineHeight: 24,
  },
  modalList: {
    maxHeight: 400,
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  modalItemTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

