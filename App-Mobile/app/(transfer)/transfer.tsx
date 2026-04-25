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
import { createTransactionStyles } from '@/constants/transaction.styles';

export default function TransferPage() {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();
  const { addHistoryItem } = useHistory();
  const styles = createTransactionStyles(theme);

  const [senderOperator, setSenderOperator] = useState<OperatorId>("mvola");
  const [recipientOperator, setRecipientOperator] = useState<OperatorId>("mvola");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");

  const operators: { id: OperatorId, name: string, color: string }[] = [
    { id: "mvola", name: "MVola", color: "#E60000" },
    { id: "orange", name: "Orange", color: "#FF7900" },
    { id: "airtel", name: "Airtel", color: "#ED1C24" },
  ];

  const handleTransfer = async () => {
    if (!isValidPhoneNumber(phone)) {
      Alert.alert("Erreur", "Numéro de téléphone invalide (10 chiffres attendus)");
      return;
    }
    if (!isValidAmount(amount)) {
      Alert.alert("Erreur", `Montant invalide (max ${TRANSACTION_CONFIG.maxAmount.toLocaleString()} Ar)`);
      return;
    }

    const ussdCode = generateTransferCode(senderOperator, recipientOperator, phone, amount);
    
    try {
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

    } catch (error) {
      Alert.alert("Erreur", "Impossible d'exécuter l'appel");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transfert d'argent</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>1. Mon Opérateur (Envoi)</Text>
        <View style={styles.operatorGrid}>
          {operators.map((op) => (
            <TouchableOpacity
              key={op.id}
              style={[
                styles.operatorCard,
                senderOperator === op.id && { borderColor: op.color, backgroundColor: op.color + '15' }
              ]}
              onPress={() => setSenderOperator(op.id)}
            >
              <Text style={[
                styles.operatorText,
                senderOperator === op.id && { color: op.color }
              ]}>{op.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>2. Opérateur Destinataire</Text>
        <View style={styles.operatorGrid}>
          {operators.map((op) => (
            <TouchableOpacity
              key={op.id}
              style={[
                styles.operatorCard,
                recipientOperator === op.id && { borderColor: op.color, backgroundColor: op.color + '15' }
              ]}
              onPress={() => setRecipientOperator(op.id)}
            >
              <Text style={[
                styles.operatorText,
                recipientOperator === op.id && { color: op.color }
              ]}>{op.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>3. Détails du transfert</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Numéro du destinataire</Text>
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
          <Text style={styles.label}>Montant (Ar)</Text>
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
            { backgroundColor: (isValidAmount(amount) && isValidPhoneNumber(phone)) ? theme.tint : theme.border }
          ]}
          onPress={handleTransfer}
          disabled={!isValidAmount(amount) || !isValidPhoneNumber(phone)}
        >
          <Text style={styles.actionButtonText}>Envoyer l'argent</Text>
        </TouchableOpacity>

        <Text style={styles.helperText}>
          Le code USSD sera généré pour un transfert {senderOperator} vers {recipientOperator}.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
