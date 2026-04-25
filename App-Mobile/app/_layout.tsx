import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { HistoryProvider } from '@/context/HistoryContext';
import { ThemeProvider as AppThemeProvider } from '@/context/ThemeContext';
import { VibrationProvider } from '@/context/VibrationContext';
import '@/constants/i18n';

// Ancre de démarrage : l'app s'ouvre sur le groupe (home)
export const unstable_settings = {
  anchor: '(home)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CALL_PHONE,
            {
              title: "Permission",
              message: "USSD Permission",
              buttonNeutral: "Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );
        } catch (err) {
          console.warn(err);
        }
      }
    };
    requestPermission();
  }, []);

  return (
    <VibrationProvider>
      <AppThemeProvider>
        <HistoryProvider>
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
        </HistoryProvider>
      </AppThemeProvider>
    </VibrationProvider>
  );
}
