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
import { Camera } from 'expo-camera';
import { requestMediaLibraryPermissionsAsync } from 'expo-image-picker';
import { initI18n } from '@/constants/i18n';
import * as SplashScreen from 'expo-splash-screen';
import * as Updates from 'expo-updates';
import { useState } from 'react';

// Empêcher le splash screen de se masquer automatiquement
SplashScreen.preventAutoHideAsync();

// Ancre de démarrage : l'app s'ouvre sur le groupe (home)
export const unstable_settings = {
  anchor: '(home)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        // 0. Vérifier les mises à jour (uniquement en dehors du développement)
        if (!__DEV__) {
          const update = await Updates.checkForUpdateAsync();
          if (update.isAvailable) {
            await Updates.fetchUpdateAsync();
            await Updates.reloadAsync();
          }
        }

        // 1. Initialiser les traductions
        await initI18n();

        // 2. Permission Appels (Android uniquement)
        if (Platform.OS === 'android') {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CALL_PHONE,
            {
              title: "Permission d'appel",
              message: "VolaNow a besoin d'accéder aux appels pour exécuter les codes USSD.",
              buttonNeutral: "Plus tard",
              buttonNegative: "Annuler",
              buttonPositive: "OK"
            }
          );
        }

        // 3. Permission Caméra & Galerie (iOS et Android)
        await Camera.requestCameraPermissionsAsync();
        await requestMediaLibraryPermissionsAsync();

      } catch (err) {
        console.warn("Preparation error:", err);
      } finally {
        setIsLoaded(true);
        await SplashScreen.hideAsync();
      }
    };
    
    prepare();
  }, []);

  if (!isLoaded) return null;

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

              {/* Flux Recharge — stack navigation sans header */}
              <Stack.Screen name="(recharge)" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </HistoryProvider>
      </AppThemeProvider>
    </VibrationProvider>
  );
}
