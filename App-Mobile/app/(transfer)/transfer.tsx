import { useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, SafeAreaView } from "react-native";
import { Link, Stack, router } from "expo-router";
import { Feather } from "@expo/vector-icons";

type Operator = "mvola" | "orange" | "airtel";

const operators = [
  { id: "mvola" as Operator, name: "MVola", color: "#E60000" },
  { id: "orange" as Operator, name: "Orange Money", color: "#FF7900" },
  { id: "airtel" as Operator, name: "Airtel Money", color: "#ED1C24" },
];

export default function TransferPage() {
  const [sendingOperator, setSendingOperator] = useState<Operator>("mvola");
  const [receivingOperator, setReceivingOperator] = useState<Operator>("orange");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleNumberPad = (digit: string) => {
    if (digit === "⌫") {
      setPhoneNumber(phoneNumber.slice(0, -1));
    } else if (phoneNumber.length < 10) {
      setPhoneNumber(phoneNumber + digit);
    }
  };

  const handleConfirm = () => {
    if (phoneNumber.length === 10 && amount) {
      setIsConfirmed(true);
      setTimeout(() => setIsConfirmed(false), 3000);
    }
  };

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
              {operators.map((op) => (
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
              {operators.map((op) => (
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

          {/* Phone Number Display */}
          <View style={styles.section}>
            <Text style={styles.label}>Recipient Phone Number</Text>
            <View style={styles.phoneDisplay}>
              <Text style={styles.phoneDisplayText}>
                {phoneNumber || "_ _ _ _ _ _ _ _ _ _"}
              </Text>
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
          </View>

          {/* Numeric Keypad */}
          <View style={styles.keypad}>
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"].map((digit, idx) => (
              <Pressable
                key={idx}
                onPress={() => handleNumberPad(digit)}
                style={({ pressed }) => [
                  styles.keypadButton,
                  digit === "⌫" ? styles.keypadButtonDelete : null,
                  pressed && styles.keypadButtonPressed,
                ]}
              >
                <Text style={[styles.keypadButtonText, digit === "⌫" && styles.keypadButtonTextDelete]}>
                  {digit}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Confirm Button */}
          <Pressable
            onPress={handleConfirm}
            disabled={phoneNumber.length !== 10 || !amount}
            style={({ pressed }) => [
              styles.confirmButton,
              (phoneNumber.length !== 10 || !amount) && styles.confirmButtonDisabled,
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
  phoneDisplay: {
    backgroundColor: '#202020',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  phoneDisplayText: {
    color: 'white',
    fontSize: 24,
    letterSpacing: 4,
    fontFamily: 'monospace', // Not natively supported the same way on all platforms, but mostly ok
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
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
    marginBottom: 24,
  },
  keypadButton: {
    width: '31%',
    height: 60,
    borderRadius: 16,
    backgroundColor: '#202020',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keypadButtonPressed: {
    backgroundColor: '#252525',
    transform: [{ scale: 0.95 }],
  },
  keypadButtonDelete: {
    width: '65%', // spans ~2 columns
    backgroundColor: '#2a2a2a',
  },
  keypadButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  keypadButtonTextDelete: {
    color: '#B0FC51',
  },
  confirmButton: {
    backgroundColor: '#B0FC51',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
});
