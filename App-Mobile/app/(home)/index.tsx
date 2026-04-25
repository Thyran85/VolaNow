import React from "react";
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/context/ThemeContext";
import { createStyles } from "./index.styles";

export default function Index() {
  const { theme, isDark } = useAppTheme();
  const styles = createStyles(theme);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>USSD Services</Text>
        <Text style={styles.welcomeText}>Madagascar</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Service 1: Retrait */}
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => router.push('/(withdrawal)/withdrawal')}
        >
          <View style={styles.cardTop}>
            <View style={[styles.actionIcon, { backgroundColor: isDark ? '#CCFF0015' : '#B0FC5133' }]}>
              <Ionicons name="arrow-down-circle" size={24} color={theme.tintDark} />
            </View>
            <Text style={styles.serviceTag}>SERVICE 01</Text>
          </View>
          <Text style={styles.cardTitle}>Retrait Cash</Text>
          <Text style={styles.cardDesc}>Effectuez vos retraits d'argent via MVola, Orange ou Airtel.</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.actionBtnText}>Initialiser</Text>
            <Ionicons name="arrow-forward" size={18} color={theme.tintDark} />
          </View>
        </TouchableOpacity>

        {/* Service 2: Transfert */}
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => router.push('/(transfer)/transfer')}
        >
          <View style={styles.cardTop}>
            <View style={[styles.actionIcon, { backgroundColor: isDark ? '#B0FC5115' : '#86D12E33' }]}>
              <Ionicons name="repeat" size={24} color={theme.tintDark} />
            </View>
            <Text style={styles.serviceTag}>SERVICE 02</Text>
          </View>
          <Text style={styles.cardTitle}>Transfert Rapide</Text>
          <Text style={styles.cardDesc}>Envoyez de l'argent vers n'importe quel numéro local.</Text>
          <View style={styles.cardFooter}>
            <Text style={styles.actionBtnText}>Transférer</Text>
            <Ionicons name="arrow-forward" size={18} color={theme.tintDark} />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}