import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface QuestStat {
  icon: any;
  value: string;
  iconType?: 'symbol' | 'image'; // Type d'icône
}

interface QuestCardProps {
  title: string;
  imageUrl: string;
  stats: QuestStat[];
  onPress?: () => void;
}

export function QuestCard({ title, imageUrl, stats, onPress }: QuestCardProps) {
  const overlayColor = useThemeColor({}, 'overlay');
  const textColor = useThemeColor({ light: '#FFFFFF', dark: '#FFFFFF' }, 'text');

  return (
    <TouchableOpacity style={styles.questCard} onPress={onPress}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.questImage}
      />
      <View style={[styles.questOverlay, { backgroundColor: overlayColor }]}>
        <Text style={[styles.questTitle, { color: textColor }]}>{title}</Text>
        <View style={styles.questStats}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.questStat}>
              {stat.iconType === 'image' ? (
                <Image source={stat.icon} style={styles.statIconImage} />
              ) : (
                <IconSymbol name={stat.icon} size={16} color={textColor} />
              )}
              <Text style={[styles.questStatText, { color: textColor }]}>{stat.value}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  questCard: {
    width: 200,
    height: 150,
    marginRight: 15,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  questImage: {
    width: '100%',
    height: '100%',
  },
  questOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
  },
  questTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  questStats: {
    flexDirection: 'row',
    gap: 15,
  },
  questStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  questStatText: {
    fontSize: 12,
  },
  statIconImage: {
    width: 16,
    height: 16,
  },
});