import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

interface VibrationContextType {
  isVibrationEnabled: boolean;
  setVibrationEnabled: (enabled: boolean) => void;
  triggerVibration: (type?: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error') => void;
}

const VibrationContext = createContext<VibrationContextType | undefined>(undefined);

const VIBRATION_STORAGE_KEY = '@app_vibration_enabled';

export const VibrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVibrationEnabled, setIsVibrationEnabled] = useState(true);

  useEffect(() => {
    const loadVibrationSetting = async () => {
      try {
        const saved = await AsyncStorage.getItem(VIBRATION_STORAGE_KEY);
        if (saved !== null) {
          setIsVibrationEnabled(saved === 'true');
        }
      } catch (e) {
        console.error('Failed to load vibration setting', e);
      }
    };
    loadVibrationSetting();
  }, []);

  const setVibrationEnabled = async (enabled: boolean) => {
    setIsVibrationEnabled(enabled);
    try {
      await AsyncStorage.setItem(VIBRATION_STORAGE_KEY, enabled.toString());
    } catch (e) {
      console.error('Failed to save vibration setting', e);
    }
  };

  const triggerVibration = (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'medium') => {
    if (!isVibrationEnabled) return;

    switch (type) {
      case 'light':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'success':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'warning':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'error':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
    }
  };

  return (
    <VibrationContext.Provider value={{ isVibrationEnabled, setVibrationEnabled, triggerVibration }}>
      {children}
    </VibrationContext.Provider>
  );
};

export const useVibration = () => {
  const context = useContext(VibrationContext);
  if (context === undefined) {
    throw new Error('useVibration must be used within a VibrationProvider');
  }
  return context;
};
