import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '@/context/ThemeContext';
import { createStyles } from './settings.styles';

export default function SettingsPage() {
  const { theme, setMode, isDark } = useAppTheme();
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const styles = createStyles(theme);

  const toggleNotifications = () => setIsNotificationsEnabled(previousState => !previousState);
  
  const toggleDarkMode = () => {
    const newMode = isDark ? 'light' : 'dark';
    setMode(newMode);
  };

  const showHelp = () => {
    Alert.alert(
      "Aide & Support",
      "Pour toute assistance, veuillez contacter le service client de votre opérateur :\n\n• MVola : 807\n• Orange : 204\n• Airtel : 121",
      [{ text: "OK" }]
    );
  };

  const showAbout = () => {
    Alert.alert(
      "À propos",
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
          <Text style={styles.headerTitle}>Paramètres</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Préférences</Text>
          <SettingItem 
            icon="bell" 
            title="Notifications" 
            subtitle={isNotificationsEnabled ? "Activées" : "Désactivées"} 
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
            title="Mode Sombre" 
            subtitle={isDark ? "Activé" : "Désactivé"} 
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
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Infos</Text>
          <SettingItem 
            icon="help-circle" 
            title="Aide" 
            color="#8B5CF6" 
            onPress={showHelp}
          />
          <SettingItem 
            icon="info" 
            title="À propos" 
            color="#6B7280" 
            onPress={showAbout}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Application Hors-Ligne</Text>
          <Text style={styles.versionText}>v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
