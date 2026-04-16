import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Linking, StyleSheet, ScrollView } from 'react-native';
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
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#FFF" />
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>Withdrawal</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Operator</Text>
          <View style={styles.operatorRow}>
            {['mvola', 'orange', 'airtel'].map((op) => (
              <TouchableOpacity key={op} onPress={() => setOperator(op)} style={[styles.opBtn, operator === op && styles.opActive]}>
                <Text style={{color: '#FFF', textTransform: 'capitalize'}}>{op}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Cash Point ID</Text>
          <TextInput style={styles.input} placeholder="Enter 5-digit ID" placeholderTextColor="#444" keyboardType="numeric" onChangeText={setCashPoint} />

          <Text style={styles.label}>Amount (Ar)</Text>
          <TextInput style={styles.input} placeholder="0.00" placeholderTextColor="#444" keyboardType="numeric" onChangeText={setAmount} />
        </View>

        <TouchableOpacity style={styles.confirmBtn} onPress={executeUssd}>
          <Text style={styles.confirmText}>CONFIRM WITHDRAWAL</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0E0E0E', padding: 20, paddingTop: 60 },
  backButton: { marginBottom: 20 },
  headerTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
  inputContainer: { marginBottom: 20 },
  label: { color: '#888', marginBottom: 10 },
  input: { backgroundColor: '#18191C', padding: 20, borderRadius: 16, color: '#FFF', marginBottom: 20 },
  operatorRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  opBtn: { flex: 1, padding: 15, borderRadius: 12, backgroundColor: '#18191C', alignItems: 'center' },
  opActive: { borderColor: '#CCFF00', borderWidth: 2 },
  confirmBtn: { backgroundColor: '#CCFF00', padding: 20, borderRadius: 20, alignItems: 'center' },
  confirmText: { fontWeight: '900', fontSize: 16 }
});