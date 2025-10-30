import React, { useState, useEffect } from 'react';
import { 
  ScrollView,
  StyleSheet, 
  Text, 
  View,
} from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export function RewardsTab() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1C1C1E' }, 'background');
  
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const nextMonday = new Date(now);
      
      // Calculate days until next Monday (1 = Monday)
      const daysUntilMonday = (8 - now.getDay()) % 7 || 7;
      nextMonday.setDate(now.getDate() + daysUntilMonday);
      nextMonday.setHours(0, 0, 0, 0); // Set to midnight
      
      const diff = nextMonday.getTime() - now.getTime();
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeRemaining(`${days}j ${hours}h ${minutes}m`);
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const rewards = [
    {
      rank: '1er',
      icon: '🥇',
      gradient: ['#FFD700', '#FFA500'],
      title: 'Champion de la semaine',
      rewards: [
        '🎟️ 1 bière premium offerte',
        '⭐ Badge exclusif "Champion"',
        '🎁 Surprise mystère',
      ],
    },
    {
      rank: 'Top 3',
      icon: '🥈',
      gradient: ['#C0C0C0', '#A0A0A0'],
      title: 'Podium d\'excellence',
      rewards: [
        '🎟️ 1 bière offerte',
        '⭐ Badge "Elite"',
        '💎 +500 XP bonus',
      ],
    },
    {
      rank: 'Top 10',
      icon: '🏅',
      gradient: ['#CD7F32', '#A0522D'],
      title: 'Les meilleurs joueurs',
      rewards: [
        '🎟️ 1 boisson offerte',
        '💎 +200 XP bonus',
      ],
    },
    {
      rank: 'Top 20',
      icon: '🎖️',
      gradient: ['#4A90E2', '#357ABD'],
      title: 'Les challengers',
      rewards: [
        '💎 +100 XP bonus',
        '🎯 Défi spécial débloqué',
      ],
    },
  ];

  return (
    <ScrollView 
      style={[styles.scrollView, { backgroundColor }]} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      
      {/* Header */}
      <View style={styles.headerSection}>
        <Text style={styles.headerIcon}>🏆</Text>
        <Text style={[styles.title, { color: textColor }]}>Récompenses Hebdomadaires</Text>
        <Text style={[styles.subtitle, { color: textColor, opacity: 0.7 }]}>
          Terminez dans le top pour gagner des récompenses exclusives !
        </Text>
      </View>

      {/* Timer Section */}
      <View style={[styles.timerCard, { backgroundColor: cardBackgroundColor }]}>
        <Text style={[styles.timerLabel, { color: textColor, opacity: 0.7 }]}>
          ⏰ Temps restant cette semaine
        </Text>
        <Text style={[styles.timerText, { color: '#007AFF' }]}>
          {timeRemaining || 'Calcul...'}
        </Text>
        <Text style={[styles.timerSubtext, { color: textColor, opacity: 0.6 }]}>
          Les récompenses seront distribuées lundi matin
        </Text>
      </View>

      {/* Rewards List */}
      <View style={styles.rewardsContainer}>
        {rewards.map((reward, index) => (
          <View 
            key={index} 
            style={[styles.rewardCard, { backgroundColor: cardBackgroundColor }]}
          >
            <View style={styles.rewardHeader}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankIcon}>{reward.icon}</Text>
                <Text style={[styles.rankText, { color: textColor }]}>{reward.rank}</Text>
              </View>
              <Text style={[styles.rewardTitle, { color: textColor }]}>
                {reward.title}
              </Text>
            </View>
            
            <View style={styles.rewardsList}>
              {reward.rewards.map((item, idx) => (
                <View key={idx} style={styles.rewardItem}>
                  <Text style={styles.rewardBullet}>•</Text>
                  <Text style={[styles.rewardText, { color: textColor }]}>
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Info Section */}
      <View style={[styles.infoCard, { backgroundColor: cardBackgroundColor }]}>
        <Text style={[styles.infoTitle, { color: textColor }]}>
          💡 Comment gagner des XP ?
        </Text>
        <View style={styles.infoList}>
          <Text style={[styles.infoItem, { color: textColor, opacity: 0.8 }]}>
            • Scanner vos tickets de bières
          </Text>
          <Text style={[styles.infoItem, { color: textColor, opacity: 0.8 }]}>
            • Visiter de nouveaux établissements
          </Text>
          <Text style={[styles.infoItem, { color: textColor, opacity: 0.8 }]}>
            • Compléter des quêtes spéciales
          </Text>
          <Text style={[styles.infoItem, { color: textColor, opacity: 0.8 }]}>
            • Partager vos découvertes
          </Text>
        </View>
      </View>

      {/* CTA */}
      <View style={styles.ctaSection}>
        <Text style={[styles.ctaText, { color: textColor, opacity: 0.7 }]}>
          Les récompenses sont cumulables avec vos gains habituels !
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  headerSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  timerCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  timerLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  timerText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  timerSubtext: {
    fontSize: 13,
    textAlign: 'center',
  },
  rewardsContainer: {
    paddingHorizontal: 20,
  },
  rewardCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 12,
  },
  rankIcon: {
    fontSize: 20,
    marginRight: 6,
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  rewardsList: {
    marginTop: 8,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  rewardBullet: {
    fontSize: 16,
    marginRight: 8,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  rewardText: {
    fontSize: 15,
    flex: 1,
    lineHeight: 22,
  },
  infoCard: {
    marginHorizontal: 20,
    marginTop: 8,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoList: {
    gap: 8,
  },
  infoItem: {
    fontSize: 15,
    lineHeight: 22,
  },
  ctaSection: {
    paddingHorizontal: 40,
    marginTop: 24,
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
