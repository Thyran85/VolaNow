import React from "react";
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useVibration } from "@/context/VibrationContext";
import { createStyles } from "@/styles/index.styles";

export default function Index() {
  const { theme, isDark } = useAppTheme();
  const { t } = useTranslation();
  const { triggerVibration } = useVibration();
  const styles = createStyles(theme);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>{t('home.title')}</Text>
        <Text style={styles.welcomeText}>{t('home.subtitle')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Service 1: Retrait */}
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => {
            triggerVibration('light');
            router.push('/(withdrawal)/withdrawal');
          }}
        >
          <View style={styles.cardTop}>
            <View style={[styles.actionIcon, { backgroundColor: isDark ? '#CCFF0015' : '#B0FC5133' }]}>
              <Ionicons name="arrow-down-circle" size={24} color={theme.tintDark} />
            </View>
            <Text style={styles.serviceTag}>{t('home.service01')}</Text>
          </View>
          <Text style={styles.cardTitle}>{t('home.withdrawalTitle')}</Text>
          <Text style={styles.cardDesc}>{t('home.withdrawalDesc')}</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.actionBtnText}>{t('home.initialize')}</Text>
            <Ionicons name="arrow-forward" size={18} color={theme.tintDark} />
          </View>
        </TouchableOpacity>

        {/* Service 2: Transfert */}
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => {
            triggerVibration('light');
            router.push('/(transfer)/transfer');
          }}
        >
          <View style={styles.cardTop}>
            <View style={[styles.actionIcon, { backgroundColor: isDark ? '#B0FC5115' : '#86D12E33' }]}>
              <Ionicons name="repeat" size={24} color={theme.tintDark} />
            </View>
            <Text style={styles.serviceTag}>{t('home.service02')}</Text>
          </View>
          <Text style={styles.cardTitle}>{t('home.transferTitle')}</Text>
          <Text style={styles.cardDesc}>{t('home.transferDesc')}</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.actionBtnText}>{t('home.transfer')}</Text>
            <Ionicons name="arrow-forward" size={18} color={theme.tintDark} />
          </View>
        </TouchableOpacity>

        {/* Service 3: Recharge */}
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => {
            triggerVibration('light');
            router.push('/(recharge)/recharge');
          }}
        >
          <View style={styles.cardTop}>
            <View style={[styles.actionIcon, { backgroundColor: isDark ? '#00E5FF15' : '#00E5FF33' }]}>
              <Ionicons name="barcode-outline" size={24} color={theme.tintDark} />
            </View>
            <Text style={styles.serviceTag}>{t('home.service03')}</Text>
          </View>
          <Text style={styles.cardTitle}>{t('home.rechargeTitle')}</Text>
          <Text style={styles.cardDesc}>{t('home.rechargeDesc')}</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.actionBtnText}>{t('recharge.scan')}</Text>
            <Ionicons name="arrow-forward" size={18} color={theme.tintDark} />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}