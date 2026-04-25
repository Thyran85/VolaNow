import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Linking, StyleSheet, ScrollView, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import { generateWithdrawalCode, OperatorId } from '@/constants/ussd';
import { isValidCashPointId, isValidAmount } from '@/security/validation';
import { TRANSACTION_CONFIG } from '@/constants/config';

export default function WithdrawalPage() {
  const router = useRouter();
  const [cashPoint, setCashPoint] = useState('');
  const [amount, setAmount] = useState('');
  const [operator, setOperator] = useState<OperatorId>('mvola');

  const executeUssd = () => {
    if (!isValidCashPointId(cashPoint) || !isValidAmount(amount)) {
      Alert.alert("Sécurité", "Veuillez entrer un ID valide (10 chiffres) et un montant correct.");
      return;
    }
    
    const code = generateWithdrawalCode(operator, cashPoint, amount);
    
    if (Platform.OS === 'android') {
      // Exécute l'appel immédiatement sans passer par le dialer
      RNImmediatePhoneCall.immediatePhoneCall(code);
    } else {
      // Sur iOS, l'appel direct est interdit, on utilise Linking
      const url = `tel:${code.replace('#', '%23')}`;
      Linking.openURL(url).catch(() => Alert.alert("Erreur", "Impossible d'exécuter"));
    }
  };

  const isButtonDisabled = !isValidCashPointId(cashPoint) || !isValidAmount(amount);

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
            {(['mvola', 'orange', 'airtel'] as OperatorId[]).map((op) => (
              <TouchableOpacity key={op} onPress={() => setOperator(op)} style={[styles.opBtn, operator === op && styles.opActive]}>
                <Text style={{color: '#FFF', textTransform: 'capitalize', fontWeight: '600'}}>{op}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Cash Point ID</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter the number of the cash point" 
            placeholderTextColor="#444" 
            keyboardType="numeric" 
            value={cashPoint}
            onChangeText={(text) => setCashPoint(text)} 
          />

          <Text style={styles.label}>Amount (Ar)</Text>
          <TextInput 
            style={styles.input} 
            placeholder="0.00" 
            placeholderTextColor="#444" 
            keyboardType="numeric" 
            value={amount}
            onChangeText={(text) => setAmount(text)} 
          />

          {/* Amount Suggestions */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionList}>
            {TRANSACTION_CONFIG.amountSuggestions.map((suggestion) => (
              <TouchableOpacity 
                key={suggestion} 
                style={styles.suggestionBtn} 
                onPress={() => setAmount(suggestion)}
              >
                <Text style={styles.suggestionText}>{parseInt(suggestion).toLocaleString()} Ar</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <TouchableOpacity 
          style={[styles.confirmBtn, isButtonDisabled && { opacity: 0.5 }]} 
          onPress={executeUssd}
          disabled={isButtonDisabled}
        >
          <Text style={styles.confirmText}>CONFIRMER LA TRANSACTION</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  confirmText: { fontWeight: '900', fontSize: 16, color: '#000' },
  suggestionList: {
    marginTop: -10,
    marginBottom: 20,
    flexDirection: 'row',
  },
  suggestionBtn: {
    backgroundColor: '#1E241B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#CCFF0033',
  },
  suggestionText: {
    color: '#CCFF00',
    fontSize: 13,
    fontWeight: '600',
  },
});
