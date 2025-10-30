import type { PropsWithChildren, ReactElement } from 'react';
import { Animated as RNAnimated, StyleSheet } from 'react-native';

import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';
import { useScroll } from '@/contexts/ScrollContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedView } from './ThemedView';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage?: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const bottom = useBottomTabOverflow();
  const { scrollY } = useScroll();
  
  const headerAnimatedStyle = {
    transform: [
      {
        translateY: scrollY.interpolate({
          inputRange: [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
          outputRange: [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75],
          extrapolate: 'clamp',
        }),
      },
      {
        scale: scrollY.interpolate({
          inputRange: [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
          outputRange: [2, 1, 1],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  const handleScroll = RNAnimated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  return (
    <ThemedView style={styles.container}>
      <RNAnimated.ScrollView
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{ paddingBottom: bottom, paddingTop: 100 }}
        onScroll={handleScroll}>
        {headerImage && (
          <RNAnimated.View
            style={[
              styles.header,
              { backgroundColor: headerBackgroundColor[colorScheme] },
              headerAnimatedStyle,
            ]}>
            {headerImage}
          </RNAnimated.View>
        )}
        <ThemedView style={styles.content}>{children}</ThemedView>
      </RNAnimated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  },
});
