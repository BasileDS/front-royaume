import { NewsCard } from '@/components/cards';
import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface NewsItem {
  id: string;
  title: string;
  imageUrl: string;
}

interface NewsSectionProps {
  title?: string;
  newsItems?: NewsItem[];
}

export function NewsSection({ 
  title = 'Nouveautés', 
  newsItems = [] 
}: NewsSectionProps) {
  const textColor = useThemeColor({}, 'text');

  if (!newsItems || newsItems.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>{title}</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.horizontalScroll}
      >
        {newsItems.map((item) => (
          <NewsCard
            key={item.id}
            newsId={item.id}
            title={item.title}
            imageUrl={item.imageUrl}
            onPress={() => {}} // TODO: Implement news detail navigation
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