import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export function LeaderboardTimer() {
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

  return (
    <View style={[styles.timerCard, { backgroundColor: cardBackgroundColor }]}>
      <Text style={[styles.timerLabel, { color: textColor, opacity: 0.7 }]}>
        ⏰ Temps restant
      </Text>
      <Text style={[styles.timerText, { color: '#007AFF' }]}>
        {timeRemaining || 'Calcul...'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  timerCard: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  timerLabel: {
    fontSize: 13,
    marginBottom: 6,
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
