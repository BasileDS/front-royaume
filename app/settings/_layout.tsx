import { BackButton } from '@/components/common';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Stack } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

function SettingsHeader() {
  const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#1A1A1A' }, 'background');
  const iconColor = useThemeColor({ light: '#11181C', dark: '#FFFFFF' }, 'text');
  const textColor = useThemeColor({ light: '#11181C', dark: '#FFFFFF' }, 'text');

  return (
    <View style={[styles.header, { backgroundColor }]}>
      <Text style={[styles.headerTitle, { color: textColor }]}>Paramètres</Text>
      <BackButton 
        color={iconColor}
        size={24}
        style={styles.backButton}
      />
    </View>
  );
}

export default function SettingsLayout() {
  return (
    <>
      <SettingsHeader />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Paramètres',
          }}
        />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    height: Platform.OS === 'ios' ? 110 : 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
});
