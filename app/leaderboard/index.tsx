import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  useWindowDimensions,
  Pressable,
  ScrollView,
} from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';

import { useWeeklyLeaderboard, useMonthlyLeaderboard, useYearlyLeaderboard } from '@/src/features/gains/hooks/useLeaderboard';
import { useThemeColor } from '@/hooks/useThemeColor';
import { LeaderboardList } from '@/components/leaderboard/LeaderboardList';
import { LeaderboardTimer } from '@/components/leaderboard/LeaderboardTimer';
import { RewardsTab } from '@/components/leaderboard/RewardsTab';

function WeeklyRoute() {
  const { leaderboard, loading, refreshing, refresh } = useWeeklyLeaderboard(50);
  
  return (
    <>
      <LeaderboardTimer />
      <LeaderboardList
        leaderboard={leaderboard}
        loading={loading}
        refreshing={refreshing}
        onRefresh={refresh}
        emptyMessage="Aucun classement disponible"
        emptySubtitle="Soyez le premier à gagner des XP cette semaine !"
      />
    </>
  );
}

function MonthlyRoute() {
  const { leaderboard, loading, refreshing, refresh } = useMonthlyLeaderboard(50);
  
  return (
    <LeaderboardList
      leaderboard={leaderboard}
      loading={loading}
      refreshing={refreshing}
      onRefresh={refresh}
      emptyMessage="Aucun classement disponible"
      emptySubtitle="Soyez le premier à gagner des XP ce mois !"
    />
  );
}

function YearlyRoute() {
  const { leaderboard, loading, refreshing, refresh } = useYearlyLeaderboard(50);
  
  return (
    <LeaderboardList
      leaderboard={leaderboard}
      loading={loading}
      refreshing={refreshing}
      onRefresh={refresh}
      emptyMessage="Aucun classement disponible"
      emptySubtitle="Soyez le premier à gagner des XP cette année !"
    />
  );
}

function RewardsRoute() {
  return <RewardsTab />;
}

const renderScene = SceneMap({
  weekly: WeeklyRoute,
  monthly: MonthlyRoute,
  yearly: YearlyRoute,
  rewards: RewardsRoute,
});

export default function LeaderboardScreen() {
  const layout = useWindowDimensions();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tabBarBackground = useThemeColor({ light: '#F8F9FA', dark: '#1C1C1E' }, 'background');

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'weekly', title: 'Semaine' },
    { key: 'monthly', title: 'Mois' },
    { key: 'yearly', title: 'Année' },
    { key: 'rewards', title: 'Récompenses' },
  ]);

  const scrollViewRef = useRef<ScrollView>(null);
  const tabWidth = layout.width * 0.35;

  useEffect(() => {
    // Scroll to position the active tab at the left
    scrollViewRef.current?.scrollTo({
      x: index * tabWidth,
      animated: true,
    });
  }, [index, tabWidth]);

  const renderTabBar = (props: any) => {
    return (
      <View style={[styles.tabBar, { backgroundColor: tabBarBackground }]}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          contentContainerStyle={styles.tabContainer}
        >
          {props.navigationState.routes.map((route: any, i: number) => {
            const isActive = index === i;
            
            return (
              <Pressable
                key={route.key}
                style={[
                  styles.tabItem,
                  { width: tabWidth },
                  isActive && styles.tabItemActive,
                ]}
                onPress={() => setIndex(i)}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: textColor },
                    isActive && styles.tabTextActive,
                  ]}
                >
                  {route.title}
                </Text>
                {isActive && <View style={styles.tabIndicator} />}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        swipeEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  tabContainer: {
    paddingHorizontal: 4,
    paddingTop: 8,
  },
  tabItem: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    position: 'relative',
  },
  tabItemActive: {
    // Active state handled by text color and indicator
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.6,
  },
  tabTextActive: {
    fontWeight: '700',
    opacity: 1,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 8,
    right: 8,
    height: 3,
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
});
