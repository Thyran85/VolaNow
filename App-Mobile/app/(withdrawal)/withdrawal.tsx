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
import { useTranslation } from 'react-i18next';
import { useVibration } from '@/context/VibrationContext';
import { createTransactionStyles } from '@/styles/transaction.styles';

export default function WithdrawalPage() {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();
  const { t } = useTranslation();
  const { triggerVibration } = useVibration();
  const { addHistoryItem } = useHistory();
  const styles = createTransactionStyles(theme);
  
  const [cashPoint, setCashPoint] = useState('');
  const [amount, setAmount] = useState('');
  const [operator, setOperator] = useState<OperatorId>('mvola');
  const [transactionDone, setTransactionDone] = useState(false);

  const operators: { id: OperatorId, name: string, color: string }[] = [
    { id: 'mvola', name: 'MVola', color: '#e6e200ff' }, //#e6e200ff  004de6ff
    { id: 'orange', name: 'Orange', color: '#FF7900' },
    { id: 'airtel', name: 'Airtel', color: '#ED1C24' },
  ];

  const handleWithdrawal = async () => {
    if (!isValidCashPointId(cashPoint)) {
      triggerVibration('warning');
      Alert.alert(t('common.error'), t('withdrawal.errorId'));
      return;
    }
    if (!isValidAmount(amount)) {
      triggerVibration('warning');
      Alert.alert(t('common.error'), `${t('withdrawal.errorAmount')} (max ${TRANSACTION_CONFIG.maxAmount.toLocaleString()} ${t('common.ar')})`);
      return;
    }

    const ussdCode = generateWithdrawalCode(operator, cashPoint, amount);
    
    try {
      triggerVibration('success');
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
      setTransactionDone(true);

    } catch (error) {
      triggerVibration('error');
      Alert.alert(t('common.error'), 'Impossible d\'exécuter l\'appel');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { triggerVibration('light'); router.back(); }}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('withdrawal.title')}</Text>
      </View>

      {transactionDone ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 20 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#CCFF0030', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="checkmark-circle" size={56} color="#86D12E" />
          </View>
          <Text style={[styles.headerTitle, { textAlign: 'center' }]}>Transaction envoyée !</Text>
          <Text style={{ color: theme.textSecondary, textAlign: 'center', fontSize: 14 }}>
            Montant : {parseInt(amount).toLocaleString()} {t('common.ar')}{`\n`}Point de retrait : {cashPoint}
          </Text>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.tint, marginTop: 12 }]}
            onPress={() => {
              triggerVibration('light');
              setCashPoint('');
              setAmount('');
              setOperator('mvola');
              setTransactionDone(false);
            }}
          >
            <Text style={styles.actionButtonText}>Nouvelle transaction</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }]}
            onPress={() => { triggerVibration('light'); router.back(); }}
          >
            <Text style={[styles.actionButtonText, { color: theme.text }]}>Retour accueil</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>{t('withdrawal.step1')}</Text>
        <View style={styles.operatorGrid}>
          {operators.map((op) => (
            <TouchableOpacity
              key={op.id}
              style={[
                styles.operatorCard,
                operator === op.id && { borderColor: op.color, backgroundColor: op.color + '15' }
              ]}
              onPress={() => { triggerVibration('light'); setOperator(op.id); }}
            >
              <Text style={[
                styles.operatorText,
                operator === op.id && { color: op.color }
              ]}>{op.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>{t('withdrawal.step2')}</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('withdrawal.cashPointLabel')}</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="storefront-outline" size={20} color={theme.icon} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={t('withdrawal.cashPointPlaceholder')}
              placeholderTextColor={theme.icon}
              keyboardType="numeric"
              value={cashPoint}
              onChangeText={setCashPoint}
              maxLength={10}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('withdrawal.amountLabel')}</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="cash-outline" size={20} color={theme.icon} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={t('withdrawal.amountPlaceholder')}
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
                onPress={() => { triggerVibration('light'); setAmount(val); }}
              >
                <Text style={styles.suggestionText}>{parseInt(val).toLocaleString()} {t('common.ar')}</Text>
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
          <Text style={styles.actionButtonText}>{t('withdrawal.confirmBtn')}</Text>
        </TouchableOpacity>

        <Text style={styles.helperText}>
          {t('withdrawal.helper')}
        </Text>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
