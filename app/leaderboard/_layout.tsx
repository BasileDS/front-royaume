import { Stack } from 'expo-router';
import { BackButton } from '@/components/common';

export default function LeaderboardLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Classement',
          headerShown: true,
          headerLeft: () => <BackButton />,
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack>
  );
}
