import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Switch, Alert, Modal, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppTheme } from '@/context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useVibration } from '@/context/VibrationContext';
import { createStyles } from '@/styles/settings.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsPage() {
  const { theme, setMode, isDark } = useAppTheme();
  const { t, i18n } = useTranslation();
  const { isVibrationEnabled, setVibrationEnabled } = useVibration();
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [isHelpModalVisible, setIsHelpModalVisible] = useState(false);
  const [isAboutModalVisible, setIsAboutModalVisible] = useState(false);
  const styles = createStyles(theme);

  const languages = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
  ];

  const developers = [
    { id: 1, name: 'Thyran', role: 'Fullstack Developer', url: 'https://github.com/thyran' },
    { id: 2, name: 'Dev 02', role: 'UI/UX Designer', url: 'https://portfolio-dev2.com' },
    { id: 3, name: 'Dev 03', role: 'Mobile Specialist', url: 'https://portfolio-dev3.com' },
  ];

  const helpSteps = t('settings.helpContent').split('\n');

  const toggleVibration = () => setVibrationEnabled(!isVibrationEnabled);
  
  const toggleDarkMode = () => {
    const newMode = isDark ? 'light' : 'dark';
    setMode(newMode);
  };

  const changeLanguage = async (code: string) => {
    await i18n.changeLanguage(code);
    await AsyncStorage.setItem('@app_language', code);
    setIsLanguageModalVisible(false);
  };

  const showHelp = () => {
    setIsHelpModalVisible(true);
  };

  const showAbout = () => {
    setIsAboutModalVisible(true);
  };

  const openURL = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert("Erreur", "Impossible d'ouvrir ce lien.");
    });
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
            icon="smartphone" 
            title={t('settings.vibration')} 
            subtitle={isVibrationEnabled ? t('settings.enabled') : t('settings.disabled')} 
            color="#3B82F6" 
            rightElement={
              <Switch
                trackColor={{ false: theme.border, true: "#3B82F655" }}
                thumbColor={isVibrationEnabled ? "#3B82F6" : "#888"}
                onValueChange={toggleVibration}
                value={isVibrationEnabled}
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
            onPress={() => setIsLanguageModalVisible(true)}
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

      {/* Language Selection Modal */}
      <Modal
        visible={isLanguageModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsLanguageModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setIsLanguageModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('settings.language')}</Text>
              <TouchableOpacity onPress={() => setIsLanguageModalVisible(false)}>
                <Feather name="x" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.langOption,
                  i18n.language === lang.code && styles.langOptionSelected
                ]}
                onPress={() => changeLanguage(lang.code)}
              >
                <Text style={styles.langOptionText}>{lang.label}</Text>
                {i18n.language === lang.code && (
                  <Feather name="check" size={20} color={theme.tint} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Help & Guideline Modal */}
      <Modal
        visible={isHelpModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsHelpModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setIsHelpModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('settings.help')}</Text>
              <TouchableOpacity onPress={() => setIsHelpModalVisible(false)}>
                <Feather name="x" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
              {helpSteps.map((step, index) => (
                <View key={index} style={styles.helpStep}>
                  <View style={styles.helpStepNumber}>
                    <Text style={styles.helpStepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.helpStepText}>
                    {step.replace(/^\d+\.\s*/, '')}
                  </Text>
                </View>
              ))}

              <View style={styles.whatsappBadge}>
                <Feather name="message-circle" size={24} color="#25D366" />
                <Text style={styles.whatsappBadgeText}>
                  {t('settings.whatsappContact')}
                </Text>
              </View>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* About Modal */}
      <Modal
        visible={isAboutModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsAboutModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setIsAboutModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('settings.about')}</Text>
              <TouchableOpacity onPress={() => setIsAboutModalVisible(false)}>
                <Feather name="x" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
              <Text style={styles.aboutDescription}>
                VolaNow est une application conçue pour simplifier vos transactions USSD quotidiennes à Madagascar, sans avoir besoin de connexion internet.
              </Text>

              {developers.map((dev) => (
                <TouchableOpacity 
                  key={dev.id} 
                  style={styles.devCard}
                  onPress={() => openURL(dev.url)}
                >
                  <View style={[styles.iconContainer, { backgroundColor: theme.tint + '15' }]}>
                    <Feather name="user" size={20} color={theme.tint} />
                  </View>
                  <View style={styles.devInfo}>
                    <Text style={styles.devName}>{dev.name}</Text>
                    <Text style={styles.devRole}>{dev.role}</Text>
                  </View>
                  <View style={styles.devLinkIcon}>
                    <Feather name="external-link" size={16} color={theme.tint} />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
