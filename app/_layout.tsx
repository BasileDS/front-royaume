import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { useServiceWorker } from '@/hooks/useServiceWorker';
import { AuthProvider, useAuth } from '@/src/features/auth';
import { Provider } from 'react-redux';
import { store } from '../store';
import { NavigationHistoryProvider } from '@/contexts/NavigationHistoryContext';

/**
 * Composant de protection des routes
 * Redirige vers login si non authentifié
 * Redirige vers tabs si authentifié
 */
function RootLayoutNav() {
  const { user, loading, initialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (!initialized || loading) return;

    // Petit délai pour laisser le temps aux composants de faire leur propre navigation
    const timeoutId = setTimeout(() => {
      const inAuthGroup = segments[0] === '(auth)';
      const isCompleteProfile = segments[1] === 'complete-profile';
      const isSignup = segments[1] === 'signup';

      if (!user && !inAuthGroup) {
        // Rediriger vers login si non connecté et pas dans le groupe auth
        router.replace('/(auth)/login');
        setHasRedirected(true);
      } else if (user && inAuthGroup && !isCompleteProfile && !isSignup) {
        // Rediriger vers tabs si connecté et dans le groupe auth 
        // (sauf complete-profile ET signup pour permettre la navigation)
        router.replace('/(tabs)' as any);
        setHasRedirected(true);
      }
    }, 50); // Petit délai pour permettre la navigation depuis signup

    return () => clearTimeout(timeoutId);
  }, [user, segments, initialized, loading, router, hasRedirected]);

  return <Slot />;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Enregistrer le Service Worker pour PWA
  useServiceWorker();

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <Provider store={store}>
      <AuthProvider>
        <NavigationHistoryProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <RootLayoutNav />
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          </ThemeProvider>
        </NavigationHistoryProvider>
      </AuthProvider>
    </Provider>
  );
}
