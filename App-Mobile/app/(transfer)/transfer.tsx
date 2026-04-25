import { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, SafeAreaView, Platform, Linking, Alert } from "react-native";
import { Link, Stack, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import { generateTransferCode, OperatorId } from '@/constants/ussd';
import { isValidPhoneNumber, isValidAmount } from '@/security/validation';
import { TRANSACTION_CONFIG } from '@/constants/config';

const operators = [
  { id: "mvola" as OperatorId, name: "MVola", color: "#E60000" },
  { id: "orange" as OperatorId, name: "Orange Money", color: "#FF7900" },
  { id: "airtel" as OperatorId, name: "Airtel Money", color: "#ED1C24" },
];

export default function TransferPage() {
  const router = useRouter();
  const [sendingOperator, setSendingOperator] = useState<OperatorId>("mvola");
  const [receivingOperator, setReceivingOperator] = useState<OperatorId>("orange");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const executeUssd = () => {
    const code = generateTransferCode(sendingOperator, receivingOperator, phoneNumber, amount);
    
    if (Platform.OS === 'android') {
      RNImmediatePhoneCall.immediatePhoneCall(code);
    } else {
      const url = `tel:${code.replace('#', '%23')}`;
      Linking.openURL(url).catch(() => Alert.alert("Erreur", "Impossible d'exécuter"));
    }
  };

  const handleConfirm = () => {
    if (isValidPhoneNumber(phoneNumber) && isValidAmount(amount)) {
      setIsConfirmed(true);
      executeUssd();
      setTimeout(() => setIsConfirmed(false), 3000);
    } else {
      Alert.alert("Sécurité", "Veuillez entrer un numéro valide (10 chiffres) et un montant correct.");
    }
  };

  const isButtonDisabled = !isValidPhoneNumber(phoneNumber) || !isValidAmount(amount);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="white" />
          </Pressable>
          <View>
            <Text style={styles.headerTitle}>Money Transfer</Text>
            <Text style={styles.headerSubtitle}>Between operators</Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.main}>
          {/* Operator Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>From (Sending Operator)</Text>
            <View style={styles.operatorRow}>
              {(operators as {id: OperatorId, name: string, color: string}[]).map((op) => (
                <Pressable
                  key={`send-${op.id}`}
                  onPress={() => setSendingOperator(op.id)}
                  style={[
                    styles.operatorButton,
                    sendingOperator === op.id ? styles.operatorButtonActive : null,
                  ]}
                >
                  <View style={[styles.operatorIcon, { backgroundColor: op.color }]}>
                    <Text style={styles.operatorIconText}>{op.name[0]}</Text>
                  </View>
                  <Text style={styles.operatorText} numberOfLines={1}>
                    {op.name.split(" ")[0]}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Arrow Indicator */}
            <View style={styles.arrowContainer}>
              <View style={styles.arrowCircle}>
                <Feather name="arrow-down" size={20} color="#B0FC51" />
              </View>
            </View>

            {/* Receiving Operator */}
            <Text style={styles.label}>To (Receiving Operator)</Text>
            <View style={styles.operatorRow}>
              {(operators as {id: OperatorId, name: string, color: string}[]).map((op) => (
                <Pressable
                  key={`receive-${op.id}`}
                  onPress={() => setReceivingOperator(op.id)}
                  style={[
                    styles.operatorButton,
                    receivingOperator === op.id ? styles.operatorButtonActive : null,
                  ]}
                >
                  <View style={[styles.operatorIcon, { backgroundColor: op.color }]}>
                    <Text style={styles.operatorIconText}>{op.name[0]}</Text>
                  </View>
                  <Text style={styles.operatorText} numberOfLines={1}>
                    {op.name.split(" ")[0]}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Recipient Phone Number */}
          <View style={styles.section}>
            <Text style={styles.label}>Recipient Phone Number</Text>
            <View style={styles.phoneInputContainer}>
              <TextInput
                style={styles.phoneInput}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="03XXXXXXXX"
                placeholderTextColor="#444"
                keyboardType="numeric"
                maxLength={10}
              />
              <Feather name="edit-2" size={16} color="#666" style={styles.editIcon} />
            </View>
          </View>

          {/* Amount */}
          <View style={styles.section}>
            <Text style={styles.label}>Amount (Ar)</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0"
              placeholderTextColor="#666"
              keyboardType="numeric"
            />
            {/* Amount Suggestions */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionList}>
              {TRANSACTION_CONFIG.amountSuggestions.map((suggestion) => (
                <Pressable 
                  key={suggestion} 
                  style={styles.suggestionBtn} 
                  onPress={() => setAmount(suggestion)}
                >
                  <Text style={styles.suggestionText}>{parseInt(suggestion).toLocaleString()} Ar</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Confirm Button */}
          <Pressable
            onPress={handleConfirm}
            disabled={isButtonDisabled}
            style={({ pressed }) => [
              styles.confirmButton,
              isButtonDisabled && styles.confirmButtonDisabled,
              pressed && styles.confirmButtonPressed,
            ]}
          >
            {isConfirmed ? (
              <View style={styles.confirmRow}>
                <Feather name="check-circle" size={20} color="#181818" />
                <Text style={styles.confirmButtonText}>Transfer Initiated</Text>
              </View>
            ) : (
              <Text style={styles.confirmButtonText}>Confirm Transfer</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#181818',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#181818',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#202020',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
  },
  headerSubtitle: {
    color: '#9ca3af',
    fontSize: 14,
  },
  main: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    color: '#d1d5db',
    fontSize: 14,
    marginBottom: 12,
  },
  operatorRow: {
    flexDirection: 'row',
    gap: 12,
  },
  operatorButton: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    borderWidth: 2,
    borderColor: '#2a2a2a',
    backgroundColor: '#202020',
    alignItems: 'center',
  },
  operatorButtonActive: {
    borderColor: '#B0FC51',
    backgroundColor: 'rgba(176, 252, 81, 0.1)',
  },
  operatorIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  operatorIconText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  operatorText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  arrowContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  arrowCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#202020',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#202020',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    borderRadius: 16,
    paddingHorizontal: 20,
  },
  phoneInput: {
    flex: 1,
    color: 'white',
    fontSize: 24,
    paddingVertical: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 2,
  },
  editIcon: {
    marginLeft: 10,
    opacity: 0.5,
  },
  amountInput: {
    backgroundColor: '#202020',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    color: 'white',
    fontSize: 20,
  },
  confirmButton: {
    backgroundColor: '#B0FC51',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  confirmButtonPressed: {
    backgroundColor: '#a0ec41',
    transform: [{ scale: 0.98 }],
  },
  confirmButtonDisabled: {
    opacity: 0.4,
  },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  confirmButtonText: {
    color: '#181818',
    fontSize: 18,
    fontWeight: '600',
  },
  suggestionList: {
    marginTop: 12,
    flexDirection: 'row',
  },
  suggestionBtn: {
    backgroundColor: '#202020',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#B0FC5133',
  },
  suggestionText: {
    color: '#B0FC51',
    fontSize: 13,
    fontWeight: '600',
  },
});
