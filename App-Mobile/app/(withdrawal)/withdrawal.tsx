import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Linking, ScrollView, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import { generateWithdrawalCode, OperatorId } from '@/constants/ussd';
import { isValidCashPointId, isValidAmount } from '@/security/validation';
import { TRANSACTION_CONFIG } from '@/constants/config';
import { useHistory } from '@/context/HistoryContext';
import { useAppTheme } from '@/context/ThemeContext';
import { createTransactionStyles } from '@/constants/transaction.styles';

export default function WithdrawalPage() {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();
  const { addHistoryItem } = useHistory();
  const styles = createTransactionStyles(theme);
  
  const [cashPoint, setCashPoint] = useState('');
  const [amount, setAmount] = useState('');
  const [operator, setOperator] = useState<OperatorId>('mvola');

  const operators: { id: OperatorId, name: string, color: string }[] = [
    { id: 'mvola', name: 'MVola', color: '#E60000' },
    { id: 'orange', name: 'Orange', color: '#FF7900' },
    { id: 'airtel', name: 'Airtel', color: '#ED1C24' },
  ];

  const handleWithdrawal = async () => {
    if (!isValidCashPointId(cashPoint)) {
      Alert.alert('Erreur', 'ID du point de retrait invalide (10 chiffres attendus)');
      return;
    }
    if (!isValidAmount(amount)) {
      Alert.alert('Erreur', `Montant invalide (max ${TRANSACTION_CONFIG.maxAmount.toLocaleString()} Ar)`);
      return;
    }

    const ussdCode = generateWithdrawalCode(operator, cashPoint, amount);
    
    try {
      if (Platform.OS === 'android') {
        RNImmediatePhoneCall.immediatePhoneCall(ussdCode);
      } else {
        Linking.openURL(`tel:${ussdCode}`);
      }
      
      addHistoryItem({
        type: 'withdrawal',
        amount,
        target: cashPoint,
        operator,
      });

    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'exécuter l\'appel');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Retrait d'argent</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>1. Choisir l'opérateur</Text>
        <View style={styles.operatorGrid}>
          {operators.map((op) => (
            <TouchableOpacity
              key={op.id}
              style={[
                styles.operatorCard,
                operator === op.id && { borderColor: op.color, backgroundColor: op.color + '15' }
              ]}
              onPress={() => setOperator(op.id)}
            >
              <Text style={[
                styles.operatorText,
                operator === op.id && { color: op.color }
              ]}>{op.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>2. Informations de retrait</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>ID du Point de Retrait</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="storefront-outline" size={20} color={theme.icon} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Ex: 0340000000"
              placeholderTextColor={theme.icon}
              keyboardType="numeric"
              value={cashPoint}
              onChangeText={setCashPoint}
              maxLength={10}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Montant (Ar)</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="cash-outline" size={20} color={theme.icon} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Ex: 10000"
              placeholderTextColor={theme.icon}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
          
          <View style={styles.suggestionRow}>
            {TRANSACTION_CONFIG.amountSuggestions.map((val: string) => (
              <TouchableOpacity
                key={val}
                style={styles.suggestionChip}
                onPress={() => setAmount(val)}
              >
                <Text style={styles.suggestionText}>{parseInt(val).toLocaleString()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={[
            styles.actionButton, 
            { backgroundColor: (isValidAmount(amount) && isValidCashPointId(cashPoint)) ? theme.tint : theme.border }
          ]}
          onPress={handleWithdrawal}
          disabled={!isValidAmount(amount) || !isValidCashPointId(cashPoint)}
        >
          <Text style={styles.actionButtonText}>Confirmer le retrait</Text>
        </TouchableOpacity>

        <Text style={styles.helperText}>
          L'appel USSD sera lancé automatiquement. Vous devrez saisir votre code secret pour valider.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
