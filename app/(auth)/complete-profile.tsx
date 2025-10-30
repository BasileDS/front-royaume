import { useAuth } from '@/src/features/auth';
import { useEstablishments } from '@/src/features/establishments';
import { UploadService } from '@/src/shared/services/uploadService';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActionSheetIOS,
    ActivityIndicator,
    Alert,
    Image,
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

export default function CompleteProfileScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [phone, setPhone] = useState('');
  const [establishmentId, setEstablishmentId] = useState<number | null>(null);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showEstablishmentModal, setShowEstablishmentModal] = useState(false);
  const { user } = useAuth();
  const { establishments, loading: loadingEstablishments } = useEstablishments();

  // Formatter la date au format JJ/MM/AAAA avec insertion automatique des /
  const formatBirthdate = (text: string) => {
    // Retirer tous les caractères non numériques
    const cleaned = text.replace(/\D/g, '');
    
    // Limiter à 8 chiffres (JJMMAAAA)
    const limited = cleaned.substring(0, 8);
    
    // Ajouter les / automatiquement
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

  // Convertir JJ/MM/AAAA en AAAA-MM-JJ pour Supabase
  const convertBirthdateToISO = (formatted: string): string | undefined => {
    if (!formatted || formatted.length < 10) return undefined;
    
    const parts = formatted.split('/');
    if (parts.length !== 3) return undefined;
    
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  };

  // Afficher le sélecteur d'établissement
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
          if (buttonIndex === 0) return; // Annuler
          if (buttonIndex === 1) {
            setEstablishmentId(null); // Aucun établissement
          } else {
            const selectedEstablishment = establishments[buttonIndex - 2];
            if (selectedEstablishment?.id) {
              setEstablishmentId(selectedEstablishment.id);
            }
          }
        }
      );
    } else {
      // Pour Android, on peut utiliser une Alert simple
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

  // Obtenir le nom de l'établissement sélectionné
  const getSelectedEstablishmentName = () => {
    if (!establishmentId) return 'Aucun établissement';
    const establishment = establishments.find(e => e.id === establishmentId);
    return establishment?.title || 'Aucun établissement';
  };

  // Sélectionner une image depuis la galerie ou prendre une photo
  const pickImage = async () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Annuler', 'Prendre une photo', 'Choisir depuis la galerie'],
          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          if (buttonIndex === 1) {
            await takePhoto();
          } else if (buttonIndex === 2) {
            await chooseFromGallery();
          }
        }
      );
    } else {
      Alert.alert(
        'Photo de profil',
        'Choisissez une option',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Prendre une photo', onPress: takePhoto },
          { text: 'Choisir depuis la galerie', onPress: chooseFromGallery },
        ]
      );
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de votre permission pour accéder à la caméra.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const chooseFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de votre permission pour accéder à la galerie.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const uploadAvatarToSupabase = async (uri: string): Promise<string | null> => {
    try {
      setIsUploadingImage(true);
      
      if (!user?.id) {
        Alert.alert('Erreur', 'Utilisateur non connecté');
        return null;
      }

      // Utiliser le service d'upload
      const avatarUrl = await UploadService.uploadAvatar(uri, user.id);
      return avatarUrl;
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      
      // Messages d'erreur plus explicites
      let errorMessage = 'Une erreur est survenue lors du téléchargement de la photo.';
      
      if (error?.message?.includes('Network request failed')) {
        errorMessage = 'Erreur de connexion. Vérifiez votre connexion Internet et réessayez.';
      } else if (error?.message?.includes('Unauthorized') || error?.message?.includes('403')) {
        errorMessage = 'Vous n\'avez pas les permissions nécessaires pour uploader une photo.';
      } else if (error?.message?.includes('Bucket not found')) {
        errorMessage = 'Configuration du stockage incorrecte. Contactez le support.';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Erreur', errorMessage);
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleCompleteProfile = async () => {
    if (!user) {
      Alert.alert('Erreur', 'Utilisateur non connecté');
      return;
    }

    // Validation des champs obligatoires
    if (!firstName || !lastName || !username) {
      Alert.alert('Erreur', 'Veuillez remplir votre prénom, nom et nom d\'utilisateur');
      return;
    }

    // Validation du format du username
    const usernameRegex = /^[a-z0-9._-]{3,30}$/;
    if (!usernameRegex.test(username)) {
      Alert.alert(
        'Username invalide',
        'Le nom d\'utilisateur doit contenir entre 3 et 30 caractères et uniquement des lettres minuscules, chiffres, points, tirets et underscores.'
      );
      return;
    }

    if (!birthdate) {
      Alert.alert('Erreur', 'Veuillez renseigner votre date de naissance');
      return;
    }

    if (birthdate.length < 10) {
      Alert.alert('Erreur', 'La date de naissance doit être au format JJ/MM/AAAA');
      return;
    }

    if (!phone) {
      Alert.alert('Erreur', 'Veuillez renseigner votre numéro de téléphone');
      return;
    }

    if (!establishmentId) {
      Alert.alert('Erreur', 'Veuillez sélectionner un établissement de référence');
      return;
    }

    if (!avatarUri) {
      Alert.alert('Erreur', 'Veuillez ajouter une photo de profil');
      return;
    }

    try {
      setIsLoading(true);
      
      const { supabase } = await import('@/src/core/api/supabase');
      
      // Préparer les données de mise à jour
      const updateData: {
        first_name?: string;
        last_name?: string;
        username?: string;
        birthdate?: string;
        phone?: string;
        attached_establishment_id?: number;
        avatar_url?: string;
      } = {};

      // Ajouter prénom si fourni
      if (firstName) {
        updateData.first_name = firstName;
      }

      // Ajouter nom si fourni
      if (lastName) {
        updateData.last_name = lastName;
      }

      // Ajouter username si fourni
      if (username) {
        updateData.username = username;
      }

      // Convertir la date si fournie
      if (birthdate) {
        const isoDate = convertBirthdateToISO(birthdate);
        if (isoDate) {
          updateData.birthdate = isoDate;
        }
      }

      // Ajouter le téléphone si fourni
      if (phone) {
        updateData.phone = phone;
      }

      // Ajouter l'établissement si sélectionné
      if (establishmentId) {
        updateData.attached_establishment_id = establishmentId;
      }

      // Upload de l'avatar si une image a été sélectionnée
      if (avatarUri) {
        const avatarUrl = await uploadAvatarToSupabase(avatarUri);
        if (avatarUrl) {
          updateData.avatar_url = avatarUrl;
        }
      }

      // Mettre à jour le profil
      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        // Afficher le message d'erreur spécifique de la base de données
        const errorMessage = error.message || 'Impossible de mettre à jour le profil.';
        Alert.alert('Erreur', errorMessage);
        return;
      }

      Alert.alert(
        'Profil complété !',
        'Bienvenue dans Royaume Paraiges',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)' as any),
          },
        ]
      );
    } catch (error: any) {
      console.error('Error completing profile:', error);
      const errorMessage = error?.message || 'Une erreur est survenue lors de la mise à jour du profil.';
      Alert.alert('Erreur', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
          <View style={styles.header}>
            <Text style={styles.badge}>Étape 2/2</Text>
          </View>
          <Text style={styles.title}>Complétez votre profil</Text>
          <Text style={styles.subtitle}>Toutes ces informations sont nécessaires</Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Prénom *</Text>
              <TextInput
                style={styles.input}
                placeholder="Jean"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                autoComplete="given-name"
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nom *</Text>
              <TextInput
                style={styles.input}
                placeholder="Dupont"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                autoComplete="family-name"
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nom d&apos;utilisateur *</Text>
              <TextInput
                style={styles.input}
                placeholder="jeandupont"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoComplete="username"
                editable={!isLoading}
              />
              <Text style={styles.hint}>3-30 caractères : lettres minuscules, chiffres, . _ -</Text>
            </View>

            {/* Photo de profil */}
            <View style={styles.avatarContainer}>
              <Text style={styles.label}>Photo de profil *</Text>
              <TouchableOpacity
                style={styles.avatarButton}
                onPress={pickImage}
                disabled={isLoading || isUploadingImage}
              >
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarPlaceholderText}>📷</Text>
                    <Text style={styles.avatarPlaceholderLabel}>Photo de profil</Text>
                  </View>
                )}
              </TouchableOpacity>
              {isUploadingImage && (
                <ActivityIndicator style={styles.avatarLoader} size="small" color="#007AFF" />
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Date de naissance *</Text>
              <TextInput
                style={styles.input}
                placeholder="JJ/MM/AAAA"
                value={birthdate}
                onChangeText={formatBirthdate}
                autoCapitalize="none"
                keyboardType="number-pad"
                maxLength={10}
                editable={!isLoading}
              />
              <Text style={styles.hint}>Format: JJ/MM/AAAA</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Téléphone *</Text>
              <TextInput
                style={styles.input}
                placeholder="06 12 34 56 78"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                autoComplete="tel"
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Établissement de référence *</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={showEstablishmentPicker}
                disabled={isLoading || loadingEstablishments}
              >
                <Text style={[
                  styles.pickerButtonText,
                  !establishmentId && styles.pickerButtonTextPlaceholder
                ]}>
                  {getSelectedEstablishmentName()}
                </Text>
                <Text style={styles.pickerButtonArrow}>▼</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleCompleteProfile}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Terminer</Text>
              )}
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    backgroundColor: '#007AFF',
    color: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '600',
    overflow: 'hidden',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 8,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    fontSize: 40,
    marginBottom: 4,
  },
  avatarPlaceholderLabel: {
    fontSize: 12,
    color: '#666',
  },
  avatarLoader: {
    position: 'absolute',
    top: 50,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  pickerButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  pickerButtonTextPlaceholder: {
    color: '#999',
  },
  pickerButtonArrow: {
    fontSize: 12,
    color: '#999',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  skipButtonText: {
    color: '#007AFF',
    fontSize: 16,
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
