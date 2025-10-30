import { QuestCard } from '@/components/cards';
import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface Quest {
  id: string;
  title: string;
  imageUrl: string;
  stats: {
    icon: any;
    value: string;
    iconType?: 'symbol' | 'image';
  }[];
}

interface QuestSectionProps {
  title?: string;
  quests?: Quest[];
}

const defaultQuests: Quest[] = [
  {
    id: '1',
    title: 'La Randonnée des taverniers',
    imageUrl: 'https://via.placeholder.com/200x150',
    stats: [
      { icon: 'location', value: '+50', iconType: 'symbol' },
      { icon: require('@/assets/images/icon_xp_small.png'), value: '+500', iconType: 'image' }
    ]
  },
  {
    id: '2',
    title: 'Grimper du bégoudi',
    imageUrl: 'https://via.placeholder.com/200x150',
    stats: [
      { icon: 'location', value: '+50', iconType: 'symbol' },
      { icon: require('@/assets/images/icon_xp_small.png'), value: '+500', iconType: 'image' }
    ]
  }
];

export function QuestSection({ 
  title = 'Mes quêtes en cours', 
  quests = defaultQuests 
}: QuestSectionProps) {
  const textColor = useThemeColor({}, 'text');

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>{title}</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.horizontalScroll}
      >
        {quests.map((quest) => (
          <QuestCard
            key={quest.id}
            title={quest.title}
            imageUrl={quest.imageUrl}
            stats={quest.stats}
            onPress={() => {}} // TODO: Implement quest detail navigation
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  horizontalScroll: {
    paddingLeft: 20,
  },
});