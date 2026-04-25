import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '@/context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { createStyles } from '@/styles/settings.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsPage() {
  const { theme, setMode, isDark } = useAppTheme();
  const { t, i18n } = useTranslation();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const styles = createStyles(theme);

  const toggleNotifications = () => setIsNotificationsEnabled(previousState => !previousState);
  
  const toggleDarkMode = () => {
    const newMode = isDark ? 'light' : 'dark';
    setMode(newMode);
  };

  const toggleLanguage = async () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    await i18n.changeLanguage(newLang);
    await AsyncStorage.setItem('@app_language', newLang);
  };

  const showHelp = () => {
    Alert.alert(
      t('settings.help'),
      "Pour toute assistance, veuillez contacter le service client de votre opérateur :\n\n• MVola : 807\n• Orange : 204\n• Airtel : 121",
      [{ text: "OK" }]
    );
  };

  const showAbout = () => {
    Alert.alert(
      t('settings.about'),
      "Application de Services USSD Madagascar\nVersion 1.0.0\n\nDéveloppé pour simplifier vos transactions quotidiennes sans connexion internet.",
      [{ text: "Fermer" }]
    );
  };

  const SettingItem = ({ icon, title, subtitle, color = '#888', onPress, rightElement }: any) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={!onPress}>
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
        <Feather name={icon} size={20} color={color} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement ? rightElement : <Feather name="chevron-right" size={18} color={theme.icon} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('settings.title')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.preferences')}</Text>
          <SettingItem 
            icon="bell" 
            title={t('settings.notifications')} 
            subtitle={isNotificationsEnabled ? t('settings.enabled') : t('settings.disabled')} 
            color="#3B82F6" 
            rightElement={
              <Switch
                trackColor={{ false: theme.border, true: "#3B82F655" }}
                thumbColor={isNotificationsEnabled ? "#3B82F6" : "#888"}
                onValueChange={toggleNotifications}
                value={isNotificationsEnabled}
              />
            }
          />
          <SettingItem 
            icon="moon" 
            title={t('settings.darkMode')} 
            subtitle={isDark ? t('settings.on') : t('settings.off')} 
            color="#CCFF00" 
            rightElement={
              <Switch
                trackColor={{ false: theme.border, true: "#CCFF0055" }}
                thumbColor={isDark ? "#CCFF00" : "#888"}
                onValueChange={toggleDarkMode}
                value={isDark}
              />
            }
          />
          <SettingItem 
            icon="globe" 
            title={t('settings.language')} 
            subtitle={i18n.language === 'fr' ? "Français" : "English"} 
            color="#F59E0B" 
            onPress={toggleLanguage}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.support')}</Text>
          <SettingItem 
            icon="help-circle" 
            title={t('settings.help')} 
            color="#8B5CF6" 
            onPress={showHelp}
          />
          <SettingItem 
            icon="info" 
            title={t('settings.about')} 
            color="#6B7280" 
            onPress={showAbout}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('settings.offline')}</Text>
          <Text style={styles.versionText}>v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
