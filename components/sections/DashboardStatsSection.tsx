import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Animated, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { useUserStats, useUserLevel } from '@/src/features/gains';
import { useThemeColor } from '@/hooks/useThemeColor';

interface StatCardProps {
  icon: any;
  label: string;
  value: string | number;
  color: string;
  backgroundColor: string;
  subtitle?: string;
  refreshing?: boolean;
}

function StatCard({ icon, label, value, color, backgroundColor, subtitle, refreshing }: StatCardProps) {
  const textColor = useThemeColor({}, 'text');
  const subtitleColor = useThemeColor({ light: '#666666', dark: '#999999' }, 'textSecondary');
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (refreshing) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.6,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [refreshing, pulseAnim]);

  return (
    <View style={[styles.statCard, { backgroundColor }]}>
      <Animated.Image 
        source={icon} 
        style={[
          styles.statIcon,
          { opacity: pulseAnim }
        ]} 
      />
      <Animated.Text style={[styles.statValue, { color, opacity: pulseAnim }]}>
        {value}
      </Animated.Text>
      <Text style={[styles.statLabel, { color: textColor }]}>{label}</Text>
      {subtitle && (
        <Text style={[styles.statSubtitle, { color: subtitleColor }]}>{subtitle}</Text>
      )}
    </View>
  );
}

interface LevelCardProps {
  levelName: string;
  levelNumber: number;
  progressPercent: number;
  xpToNextLevel: number;
  currentXP: number;
  nextLevelXP: number;
  nextLevelNumber: number;
  loading: boolean;
  refreshing?: boolean;
  onLeaderboardPress?: () => void;
}

function LevelCard({ levelName, levelNumber, progressPercent, xpToNextLevel, currentXP, nextLevelXP, nextLevelNumber, loading, refreshing, onLeaderboardPress }: LevelCardProps) {
  const textColor = useThemeColor({}, 'text');
  const progressBgColor = useThemeColor({ light: '#E5E5EA', dark: '#2C2C2E' }, 'background');
  const progressFillColor = '#007AFF'; // Même bleu que la carte XP
  const buttonColor = useThemeColor({ light: '#007AFF', dark: '#0A84FF' }, 'tint');
  const shimmerAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (refreshing) {
      const shimmer = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      shimmer.start();
      return () => shimmer.stop();
    } else {
      shimmerAnim.setValue(0);
    }
  }, [refreshing, shimmerAnim]);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.5],
  });

  return (
    <View style={[styles.levelCard, { backgroundColor: 'rgba(0, 122, 255, 0.1)' }]}>
      {/* Header avec titre et bouton classement */}
      <View style={styles.levelHeader}>
        <Animated.Text style={[styles.levelTitle, { color: textColor, opacity: shimmerOpacity }]}>
          {loading ? '...' : `Niveau ${levelNumber}`}
        </Animated.Text>
        
        {!loading && onLeaderboardPress && (
          <TouchableOpacity 
            style={[styles.leaderboardButton, { backgroundColor: buttonColor }]}
            onPress={onLeaderboardPress}
            activeOpacity={0.7}
          >
            <Text style={styles.leaderboardButtonText}>🏆</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Barre de progression avec tag prochain niveau */}
      <View style={styles.progressWrapper}>
        <View style={styles.progressContainer}>
          <Animated.View style={[styles.progressBar, { backgroundColor: progressBgColor, opacity: shimmerOpacity }]}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${progressPercent}%`,
                  backgroundColor: progressFillColor 
                }
              ]} 
            />
            {/* XP actuel affiché sur la barre */}
            {!loading && (
              <Text style={styles.progressXpText}>
                {currentXP.toLocaleString('fr-FR')} XP
              </Text>
            )}
            {!loading && (
              <View style={styles.progressTargetContainer}>
                <Animated.Text style={[styles.progressTargetText, { color: textColor, opacity: shimmerOpacity }]}>
                  {nextLevelXP.toLocaleString('fr-FR')} XP
                </Animated.Text>
              </View>
            )}
            {/* Tag prochain niveau en position absolue */}
            {!loading && (
              <View style={[styles.nextLevelTag, { backgroundColor: progressBgColor }]}>
                <Text style={[styles.nextLevelTagText]}>
                  {nextLevelNumber}
                </Text>
              </View>
            )}
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

interface DashboardStatsSectionProps {
  refreshTrigger?: number;
}

/**
 * Section de statistiques pour le dashboard
 * Affiche XP, niveau et cashback de l'utilisateur
 */
export function DashboardStatsSection({ refreshTrigger }: DashboardStatsSectionProps) {
  const router = useRouter();
  const { totalXP, totalCashback, loading: statsLoading, refreshing, refresh } = useUserStats();
  const { 
    currentLevel,
    nextLevel,
    progressPercent, 
    xpToNextLevel,
    currentXP,
    nextLevelXP,
    loading: levelLoading 
  } = useUserLevel(totalXP);

  const loading = statsLoading || levelLoading;

  // Rafraîchir les stats quand le trigger change
  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      refresh();
    }
  }, [refreshTrigger, refresh]);

  const handleLeaderboardPress = () => {
    router.push('/leaderboard/' as any);
  };

  const stats = [
    {
      icon: require('@/assets/images/icon_xp_small.png'),
      label: 'XP Total',
      value: loading ? '...' : totalXP.toLocaleString('fr-FR'),
      color: '#007AFF',
      backgroundColor: 'rgba(0, 122, 255, 0.1)',
    },
    {
      icon: require('@/assets/images/icon_paraiges_small.png'),
      label: 'Paraiges de Bronze',
      value: loading ? '...' : `${totalCashback.toFixed(2)}€`,
      color: '#FF9500',
      backgroundColor: 'rgba(255, 149, 0, 0.1)',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Carte de niveau - Pleine largeur */}
      {currentLevel && (
        <LevelCard
          levelName={currentLevel.name || 'Aventurier'}
          levelNumber={currentLevel.level || 1}
          progressPercent={progressPercent}
          xpToNextLevel={xpToNextLevel}
          currentXP={currentXP}
          nextLevelXP={nextLevelXP}
          nextLevelNumber={nextLevel?.level || (currentLevel.level || 1) + 1}
          loading={loading}
          refreshing={refreshing}
          onLeaderboardPress={handleLeaderboardPress}
        />
      )}

      {/* Cartes de stats - Côte à côte */}
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          color={stat.color}
          backgroundColor={stat.backgroundColor}
          refreshing={refreshing}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    paddingVertical: 15,
    gap: 10,
    marginBottom: 10,
  },
  statCard: {
    width: '48%',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statIcon: {
    width: 24,
    height: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    opacity: 0.7,
    textAlign: 'center',
  },
  statSubtitle: {
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
  levelCard: {
    width: '100%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  leaderboardButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leaderboardButtonText: {
    fontSize: 20,
  },
  progressWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  progressBar: {
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 16,
  },
  progressXpText: {
    position: 'absolute',
    left: 16,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    zIndex: 1,
  },
  progressTargetContainer: {
    alignItems: 'flex-end',
    marginRight: 40,
    opacity: 0.5,
    color: '#444444ff',
  },
  progressTargetText: {
    fontSize: 12,
    fontWeight: '600',
  },
  nextLevelTag: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: '100%',
    aspectRatio: 1,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#c0c0c0ff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    opacity: 0.5,
  },
  nextLevelTagText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#444444ff',
  },
});
