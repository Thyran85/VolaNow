import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Linking, ScrollView, SafeAreaView, Platform } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import { generateTransferCode, OperatorId } from '@/constants/ussd';
import { isValidPhoneNumber, isValidAmount } from '@/security/validation';
import { TRANSACTION_CONFIG } from '@/constants/config';
import { useHistory } from '@/context/HistoryContext';
import { useAppTheme } from '@/context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useVibration } from '@/context/VibrationContext';
import { createTransactionStyles } from '@/styles/transaction.styles';

export default function TransferPage() {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();
  const { t } = useTranslation();
  const { triggerVibration } = useVibration();
  const { addHistoryItem } = useHistory();
  const styles = createTransactionStyles(theme);

  const [senderOperator, setSenderOperator] = useState<OperatorId>("mvola");
  const [recipientOperator, setRecipientOperator] = useState<OperatorId>("mvola");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionDone, setTransactionDone] = useState(false);

  const operators: { id: OperatorId, name: string, color: string }[] = [
    { id: "mvola", name: "MVola", color: "#e6e200ff" },
    { id: "orange", name: "Orange", color: "#FF7900" },
    { id: "airtel", name: "Airtel", color: "#ED1C24" },
  ];

  const handleTransfer = async () => {
    if (!isValidPhoneNumber(phone)) {
      triggerVibration('warning');
      Alert.alert(t('common.error'), t('transfer.errorPhone'));
      return;
    }
    if (!isValidAmount(amount)) {
      triggerVibration('warning');
      Alert.alert(t('common.error'), `${t('withdrawal.errorAmount')} (max ${TRANSACTION_CONFIG.maxAmount.toLocaleString()} ${t('common.ar')})`);
      return;
    }

    const ussdCode = generateTransferCode(senderOperator, recipientOperator, phone, amount);
    
    try {
      triggerVibration('success');
      if (Platform.OS === 'android') {
        RNImmediatePhoneCall.immediatePhoneCall(ussdCode);
      } else {
        Linking.openURL(`tel:${ussdCode}`);
      }
      
      addHistoryItem({
        type: 'transfer',
        amount,
        target: phone,
        operator: senderOperator,
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
        <Text style={styles.headerTitle}>{t('transfer.title')}</Text>
      </View>

      {transactionDone ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 20 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#CCFF0030', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="checkmark-circle" size={56} color="#86D12E" />
          </View>
          <Text style={[styles.headerTitle, { textAlign: 'center' }]}>Transfert envoyé !</Text>
          <Text style={{ color: theme.textSecondary, textAlign: 'center', fontSize: 14 }}>
            Montant : {parseInt(amount).toLocaleString()} {t('common.ar')}{`\n`}Destinataire : {phone}
          </Text>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.tint, marginTop: 12 }]}
            onPress={() => {
              triggerVibration('light');
              setPhone('');
              setAmount('');
              setSenderOperator('mvola');
              setRecipientOperator('mvola');
              setTransactionDone(false);
            }}
          >
            <Text style={styles.actionButtonText}>Nouveau transfert</Text>
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
        <Text style={styles.sectionTitle}>{t('transfer.step1')}</Text>
        <View style={styles.operatorGrid}>
          {operators.map((op) => (
            <TouchableOpacity
              key={op.id}
              style={[
                styles.operatorCard,
                senderOperator === op.id && { borderColor: op.color, backgroundColor: op.color + '15' }
              ]}
              onPress={() => { triggerVibration('light'); setSenderOperator(op.id); }}
            >
              <Text style={[
                styles.operatorText,
                senderOperator === op.id && { color: op.color }
              ]}>{op.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>{t('transfer.step2')}</Text>
        <View style={styles.operatorGrid}>
          {operators.map((op) => (
            <TouchableOpacity
              key={op.id}
              style={[
                styles.operatorCard,
                recipientOperator === op.id && { borderColor: op.color, backgroundColor: op.color + '15' }
              ]}
              onPress={() => { triggerVibration('light'); setRecipientOperator(op.id); }}
            >
              <Text style={[
                styles.operatorText,
                recipientOperator === op.id && { color: op.color }
              ]}>{op.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>{t('transfer.step3')}</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('transfer.recipientPhone')}</Text>
          <View style={styles.inputWrapper}>
            <Feather name="phone" size={20} color={theme.icon} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Ex: 0340000000"
              placeholderTextColor={theme.icon}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
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
              placeholder="Ex: 5000"
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
            { backgroundColor: (isValidAmount(amount) && isValidPhoneNumber(phone)) ? theme.tint : theme.border }
          ]}
          onPress={handleTransfer}
          disabled={!isValidAmount(amount) || !isValidPhoneNumber(phone)}
        >
          <Text style={styles.actionButtonText}>{t('transfer.confirmBtn')}</Text>
        </TouchableOpacity>

        <Text style={styles.helperText}>
          {t('transfer.helper', { from: senderOperator.toUpperCase(), to: recipientOperator.toUpperCase() })}
        </Text>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
