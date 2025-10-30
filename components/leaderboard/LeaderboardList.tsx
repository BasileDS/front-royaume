import React, { useCallback } from 'react';
import { 
  ScrollView,
  StyleSheet, 
  Text, 
  View, 
  RefreshControl, 
  ActivityIndicator,
  Image 
} from 'react-native';

import { UserAvatar } from '@/components/common';
import { useAuth } from '@/features/auth';
import { LeaderboardEntry, LeaderboardService } from '@/src/features/gains/services/leaderboardService';
import { useThemeColor } from '@/hooks/useThemeColor';

interface LeaderboardListProps {
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => Promise<void>;
  emptyMessage?: string;
  emptySubtitle?: string;
}

export function LeaderboardList({
  leaderboard,
  loading,
  refreshing,
  onRefresh,
  emptyMessage = "Aucun classement disponible",
  emptySubtitle = "Soyez le premier à gagner des XP !"
}: LeaderboardListProps) {
  const { user } = useAuth();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardBackgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1C1C1E' }, 'background');

  const currentUserEntry = leaderboard.find(entry => entry.customer_id === user?.id);

  const handleRefresh = useCallback(async () => {
    await onRefresh();
  }, [onRefresh]);

  if (loading && !refreshing) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor }]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={[styles.loadingText, { color: textColor }]}>
          Chargement du classement...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.scrollView, { backgroundColor }]} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor="#007AFF"
          colors={['#007AFF']}
        />
      }>

      {/* Current User Rank (si dans le top 50) */}
      {currentUserEntry && (
        <View style={[styles.currentUserCard, { backgroundColor: '#007AFF' }]}>
          <View style={styles.currentUserContent}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankBadgeText}>#{currentUserEntry.rank}</Text>
            </View>
            <View style={styles.currentUserInfo}>
              <Text style={styles.currentUserName}>Vous</Text>
              <View style={styles.xpContainer}>
                <Image
                  source={require('@/assets/images/icon_xp_small.png')}
                  style={styles.xpIcon}
                />
                <Text style={styles.currentUserXP}>
                  {currentUserEntry.total_xp.toLocaleString('fr-FR')} XP
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Podium (Top 3) */}
      {leaderboard.length >= 3 && (
        <View style={styles.podiumContainer}>
          {/* 2nd Place */}
          <View style={[styles.podiumPlace, styles.secondPlace]}>
            <View style={[styles.podiumRank, { backgroundColor: '#C0C0C0' }]}>
              <Text style={styles.podiumRankText}>2</Text>
            </View>
            <UserAvatar
              avatarUrl={leaderboard[1].avatar_url}
              userName={LeaderboardService.formatDisplayName(leaderboard[1])}
              size="large"
            />
            <Text style={[styles.podiumName, { color: textColor }]} numberOfLines={1}>
              {LeaderboardService.formatDisplayName(leaderboard[1])}
            </Text>
            <View style={styles.xpContainer}>
              <Image
                source={require('@/assets/images/icon_xp_small.png')}
                style={styles.xpIconSmall}
              />
              <Text style={[styles.podiumXP, { color: textColor }]}>
                {leaderboard[1].total_xp.toLocaleString('fr-FR')}
              </Text>
            </View>
          </View>

          {/* 1st Place */}
          <View style={[styles.podiumPlace, styles.firstPlace]}>
            <View style={[styles.podiumRank, { backgroundColor: '#FFD700' }]}>
              <Text style={styles.podiumRankText}>1</Text>
            </View>
            <UserAvatar
              avatarUrl={leaderboard[0].avatar_url}
              userName={LeaderboardService.formatDisplayName(leaderboard[0])}
              size="xlarge"
            />
            <Text style={[styles.podiumName, { color: textColor, fontWeight: 'bold' }]} numberOfLines={1}>
              {LeaderboardService.formatDisplayName(leaderboard[0])}
            </Text>
            <View style={styles.xpContainer}>
              <Image
                source={require('@/assets/images/icon_xp_small.png')}
                style={styles.xpIconSmall}
              />
              <Text style={[styles.podiumXP, { color: textColor, fontWeight: 'bold' }]}>
                {leaderboard[0].total_xp.toLocaleString('fr-FR')}
              </Text>
            </View>
          </View>

          {/* 3rd Place */}
          <View style={[styles.podiumPlace, styles.thirdPlace]}>
            <View style={[styles.podiumRank, { backgroundColor: '#CD7F32' }]}>
              <Text style={styles.podiumRankText}>3</Text>
            </View>
            <UserAvatar
              avatarUrl={leaderboard[2].avatar_url}
              userName={LeaderboardService.formatDisplayName(leaderboard[2])}
              size="large"
            />
            <Text style={[styles.podiumName, { color: textColor }]} numberOfLines={1}>
              {LeaderboardService.formatDisplayName(leaderboard[2])}
            </Text>
            <View style={styles.xpContainer}>
              <Image
                source={require('@/assets/images/icon_xp_small.png')}
                style={styles.xpIconSmall}
              />
              <Text style={[styles.podiumXP, { color: textColor }]}>
                {leaderboard[2].total_xp.toLocaleString('fr-FR')}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Rest of Leaderboard */}
      <View style={styles.listContainer}>
        {leaderboard.slice(3).map((entry) => (
          <View 
            key={entry.customer_id} 
            style={[
              styles.leaderboardItem, 
              { backgroundColor: cardBackgroundColor },
              entry.customer_id === user?.id && styles.currentUserItem
            ]}
          >
            <View style={styles.itemLeft}>
              <Text style={[styles.rankNumber, { color: textColor }]}>
                {entry.rank}
              </Text>
              <UserAvatar
                avatarUrl={entry.avatar_url}
                userName={LeaderboardService.formatDisplayName(entry)}
                size="medium"
              />
              <View style={styles.itemInfo}>
                <Text style={[styles.itemName, { color: textColor }]} numberOfLines={1}>
                  {LeaderboardService.formatDisplayName(entry)}
                </Text>
                {entry.customer_id === user?.id && (
                  <Text style={styles.youLabel}>C&apos;est vous</Text>
                )}
              </View>
            </View>
            <View style={styles.itemRight}>
              <View style={styles.xpContainer}>
                <Image
                  source={require('@/assets/images/icon_xp_small.png')}
                  style={styles.xpIconSmall}
                />
                <Text style={[styles.itemXP, { color: textColor }]}>
                  {entry.total_xp.toLocaleString('fr-FR')}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Empty State */}
      {leaderboard.length === 0 && !loading && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🏆</Text>
          <Text style={[styles.emptyText, { color: textColor }]}>
            {emptyMessage}
          </Text>
          <Text style={[styles.emptySubtext, { color: textColor, opacity: 0.6 }]}>
            {emptySubtitle}
          </Text>
        </View>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  currentUserCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  currentUserContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 16,
  },
  rankBadgeText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  currentUserInfo: {
    flex: 1,
  },
  currentUserName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  currentUserXP: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  podiumPlace: {
    alignItems: 'center',
    flex: 1,
    maxWidth: 120,
  },
  firstPlace: {
    marginBottom: 20,
  },
  secondPlace: {
    marginRight: 8,
  },
  thirdPlace: {
    marginLeft: 8,
  },
  podiumRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  podiumRankText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  crownContainer: {
    position: 'absolute',
    top: -10,
    right: '50%',
    transform: [{ translateX: 12 }],
  },
  crown: {
    fontSize: 28,
  },
  podiumName: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    width: '100%',
  },
  podiumXP: {
    fontSize: 14,
    marginTop: 4,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  leaderboardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  currentUserItem: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    width: 40,
    textAlign: 'center',
  },
  itemInfo: {
    marginLeft: 12,
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
  },
  youLabel: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 2,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  xpIcon: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
  xpIconSmall: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  itemXP: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});
