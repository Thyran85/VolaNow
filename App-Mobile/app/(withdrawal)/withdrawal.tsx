import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Linking, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function WithdrawalPage() {
  const router = useRouter();
  const [cashPoint, setCashPoint] = useState('');
  const [amount, setAmount] = useState('');
  const [operator, setOperator] = useState('mvola');

  const executeUssd = () => {
    let code = '';
    if (operator === 'mvola') code = `*111*1*4*1*${cashPoint}*${amount}#`;
    else if (operator === 'orange') code = `*144*1*${cashPoint}*${amount}#`;
    else if (operator === 'airtel') code = `*431*1*${cashPoint}*${amount}#`;
    
    const url = `tel:${code.replace('#', '%23')}`;
    Linking.openURL(url).catch(() => Alert.alert("Erreur", "Impossible d'exécuter"));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header personnalisé */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Withdrawal</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Operator</Text>
          <View style={styles.operatorRow}>
            {['mvola', 'orange', 'airtel'].map((op) => (
              <TouchableOpacity key={op} onPress={() => setOperator(op)} style={[styles.opBtn, operator === op && styles.opActive]}>
                <Text style={{color: '#FFF', textTransform: 'capitalize', fontWeight: '600'}}>{op}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Cash Point ID</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter 5-digit ID" 
            placeholderTextColor="#444" 
            keyboardType="numeric" 
            onChangeText={(text) => setCashPoint(text)} // <--- Assure toi que c'est une fonction
          />

          <Text style={styles.label}>Amount (Ar)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="0.00" 
            placeholderTextColor="#444" 
            keyboardType="numeric" 
            onChangeText={(text) => setAmount(text)} 
          />
        </View>

        <TouchableOpacity style={styles.confirmBtn} onPress={executeUssd}>
          <Text style={styles.confirmText}>CONFIRMER LA TRANSACTION</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ... garde le même style.create ...

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0E0E0E' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10 },
  backButton: { padding: 5 },
  headerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  scrollContent: { padding: 20 },
  inputContainer: { marginTop: 20 },
  label: { color: '#888', marginBottom: 10, fontSize: 14 },
  input: { backgroundColor: '#18191C', padding: 20, borderRadius: 16, color: '#FFF', marginBottom: 20, fontSize: 16 },
  operatorRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  opBtn: { flex: 1, padding: 15, borderRadius: 12, backgroundColor: '#18191C', alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
  opActive: { borderColor: '#CCFF00', borderWidth: 1 },
  confirmBtn: { backgroundColor: '#CCFF00', padding: 20, borderRadius: 20, alignItems: 'center', marginTop: 10 },
  confirmText: { fontWeight: '900', fontSize: 16, color: '#000' }
});