import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuth } from '@/src/features/auth';
import { CommentService } from '@/src/features/comments/services';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface CommentFormProps {
  newsId?: number;
  beerId?: number;
  questId?: number;
  onCommentAdded: () => void;
}

/**
 * Formulaire pour ajouter un commentaire
 */
export function CommentForm({ newsId, beerId, questId, onCommentAdded }: CommentFormProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const backgroundColor = useThemeColor({ light: '#F5F5F5', dark: '#2A2A2A' }, 'backgroundSecondary');
  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({ light: '#999', dark: '#666' }, 'textSecondary');
  const borderColor = useThemeColor({ light: '#E0E0E0', dark: '#444' }, 'border');
  const buttonColor = beerId ? '#FFA500' : '#FF6B35';

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Connexion requise', 'Vous devez être connecté pour commenter.');
      return;
    }

    if (!content.trim()) {
      Alert.alert('Erreur', 'Le commentaire ne peut pas être vide.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (newsId) {
        await CommentService.addNewsComment(user.id, newsId, content.trim());
      } else if (beerId) {
        await CommentService.addBeerComment(user.id, beerId, content.trim());
      } else if (questId) {
        await CommentService.addQuestComment(user.id, questId, content.trim());
      }
      
      setContent('');
      onCommentAdded();
      Alert.alert('Succès', 'Votre commentaire a été ajouté !');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter le commentaire.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <View style={[styles.loginPrompt, { backgroundColor, borderColor }]}>
        <Text style={[styles.loginPromptText, { color: textColor }]}>
          Connectez-vous pour ajouter un commentaire
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.formContainer, { backgroundColor, borderColor }]}>
      <TextInput
        style={[styles.input, { color: textColor, borderColor }]}
        placeholder="Ajouter un commentaire..."
        placeholderTextColor={placeholderColor}
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={3}
        maxLength={500}
        editable={!isSubmitting}
      />
      
      <View style={styles.footer}>
        <Text style={[styles.charCount, { color: placeholderColor }]}>
          {content.length}/500
        </Text>
        
        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: buttonColor },
            (isSubmitting || !content.trim()) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting || !content.trim()}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.submitButtonText}>Publier</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  input: {
    minHeight: 80,
    fontSize: 15,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  charCount: {
    fontSize: 12,
  },
  submitButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
  loginPrompt: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
    alignItems: 'center',
  },
  loginPromptText: {
    fontSize: 15,
  },
});
