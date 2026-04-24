import React from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Opérations</Text>
        <Text style={styles.subtitle}>Sélectionnez un service</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Service 01: Withdrawal */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconBox}>
              <Ionicons name="wallet-outline" size={22} color="#CCFF00" />
            </View>
            <Text style={styles.serviceText}>SERVICE 01</Text>
          </View>
          <Text style={styles.cardTitle}>Withdrawal</Text>
          <Text style={styles.cardDesc}>Securely move your local assets to an external hardware wallet.</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/withdrawal')}
          >
            <Text style={styles.buttonText}>Initialize Withdrawal</Text>
            <Ionicons name="arrow-forward" size={18} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Service 02: Transfer */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconBox}>
              <Ionicons name="swap-horizontal" size={22} color="#CCFF00" />
            </View>
            <Text style={styles.serviceText}>SERVICE 02</Text>
          </View>
          <Text style={styles.cardTitle}>Transfer</Text>
          <Text style={styles.cardDesc}>Move assets between internal accounts or peer-to-peer encrypted channels.</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/transfer')}
          >
            <Text style={styles.buttonText}>Quick Transfer</Text>
            <Ionicons name="swap-horizontal" size={18} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Service 03: Recharge */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconBox}>
              <Ionicons name="flash-outline" size={22} color="#CCFF00" />
            </View>
            <Text style={styles.serviceText}>SERVICE 03</Text>
          </View>
          <Text style={styles.cardTitle}>Recharge</Text>
          <Text style={styles.cardDesc}>Top up your utility credits or balance using lightning-fast protocols.</Text>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.buttonText}>Top Up Balance</Text>
            <Ionicons name="add" size={18} color="#000" />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0E0E0E' },
  header: { marginTop: 40, marginBottom: 20, paddingHorizontal: 24 },
  title: { color: '#FFF', fontSize: 32, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { color: '#666', fontSize: 16, marginTop: 4 },

  content: { paddingHorizontal: 20, gap: 20, paddingBottom: 40 },

  card: {
    backgroundColor: '#18191C',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  iconBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1E241B', justifyContent: 'center', alignItems: 'center' },
  serviceText: { color: '#666', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  cardTitle: { color: '#FFF', fontSize: 22, fontWeight: '800', marginBottom: 8 },
  cardDesc: { color: '#8e8e93', fontSize: 14, marginBottom: 20, lineHeight: 20 },

  actionButton: {
    backgroundColor: '#CCFF00',
    borderRadius: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: { color: '#000', fontWeight: '800', fontSize: 14 },
});