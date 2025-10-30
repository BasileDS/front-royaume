import { Stack } from 'expo-router';

/**
 * Layout pour les pages d'établissements
 */
export default function EstablishmentsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Établissements',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Détail',
          presentation: 'card',
        }}
      />
    </Stack>
  );
}
