import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

// Ancre de démarrage : l'app s'ouvre sur le groupe (home)
export const unstable_settings = {
  anchor: '(home)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Page d'accueil avec onglets */}
        <Stack.Screen name="(home)" options={{ headerShown: false }} />

        {/* Flux Withdrawal — stack navigation sans header */}
        <Stack.Screen name="(withdrawal)" options={{ headerShown: false }} />

        {/* Flux Transfer — stack navigation sans header */}
        <Stack.Screen name="(transfer)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
