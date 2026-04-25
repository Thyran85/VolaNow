import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router'; // Import nécessaire pour la navigation

export default function HomeScreen() {
  const router = useRouter(); // Initialisation du routeur

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Opérations</Text>
        <Text style={styles.subtitle}>Sélectionnez un service</Text>
      </View>

      <View style={styles.content}>
        
        {/* Transfert */}
        <TouchableOpacity style={styles.card}>
          <LinearGradient colors={['#1e1e1e', '#121212']} style={styles.cardGradient}>
            <View style={styles.iconBox}>
              <Ionicons name="swap-horizontal" size={28} color="#CCFF00" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>Transfert d'argent</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Retrait */}
        <TouchableOpacity style={styles.card}>
          <LinearGradient colors={['#1e1e1e', '#121212']} style={styles.cardGradient}>
            <View style={styles.iconBox}>
              <Ionicons name="cash-outline" size={28} color="#CCFF00" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>Retrait d'argent</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Scanner - Lien vers la page scanner */}
        <TouchableOpacity 
          style={styles.heroButton} 
          activeOpacity={0.8}
          onPress={() => router.push('/scanner')} 
        >
          <LinearGradient colors={['#CCFF00', '#99CC00']} style={styles.heroGradient}>
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Scanner Crédit</Text>
              <Text style={styles.heroSub}>Recharger via caméra</Text>
            </View>
            <View style={styles.heroIcon}>
              <Ionicons name="scan-outline" size={32} color="#000" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  header: { marginTop: 60, marginBottom: 30, paddingHorizontal: '5%' },
  title: { color: '#FFF', fontSize: 36, fontWeight: '900', letterSpacing: -1 },
  subtitle: { color: '#666', fontSize: 16, marginTop: 8 },
  
  content: { 
    paddingHorizontal: '5%', 
    gap: 16 
  },
  
  card: { height: 100, borderRadius: 28, overflow: 'hidden' },
  cardGradient: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 20 },
  iconBox: { width: 50, height: 50, borderRadius: 16, backgroundColor: '#252525', justifyContent: 'center', alignItems: 'center', marginRight: 20 },
  
  textContainer: { flex: 1 }, 
  cardTitle: { color: '#FFF', fontSize: 18, fontWeight: '700', flexShrink: 1 },
  
  heroButton: { height: 130, borderRadius: 28, overflow: 'hidden', marginTop: 10 },
  heroGradient: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: '6%', justifyContent: 'space-between' },
  heroContent: { flex: 1, marginRight: 10 },
  heroTitle: { color: '#000', fontSize: 22, fontWeight: '900' },
  heroSub: { color: 'rgba(0,0,0,0.6)', fontSize: 14, fontWeight: '600' },
  heroIcon: { backgroundColor: 'rgba(255,255,255,0.4)', padding: 12, borderRadius: 20 }
});