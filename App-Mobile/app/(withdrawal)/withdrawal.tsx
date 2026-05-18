import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Linking, ScrollView, SafeAreaView, Platform, StyleSheet, Animated, Image, ActivityIndicator, useWindowDimensions } from 'react-native';
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
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView as SafeAreaContext } from 'react-native-safe-area-context';

let recognizeText: ((uri: string) => Promise<{ text: string }>) | null = null;
let ImageManipulator: any = null;

try {
  const expoOcrKit = require('expo-ocr-kit');
  if (expoOcrKit && expoOcrKit.recognizeText) {
    recognizeText = expoOcrKit.recognizeText;
  }
} catch (e) {
  console.log('expo-ocr-kit not available');
}

try {
  ImageManipulator = require('expo-image-manipulator').default || require('expo-image-manipulator');
} catch (e) {
  console.log('ImageManipulator not available');
}

const PROGRESS_STEPS = [
  { label: "Chargement de l'image...", target: 0.2, duration: 400 },
  { label: 'Analyse en cours...', target: 0.5, duration: 700 },
  { label: 'Extraction du code...', target: 0.8, duration: 600 },
  { label: 'Finalisation...', target: 0.95, duration: 400 },
];

export default function WithdrawalPage() {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();
  const { t } = useTranslation();
  const { triggerVibration } = useVibration();
  const { addHistoryItem } = useHistory();
  const styles = createTransactionStyles(theme);
  const { width } = useWindowDimensions();

  const [cashPoint, setCashPoint] = useState('');
  const [amount, setAmount] = useState('');
  const [operator, setOperator] = useState<OperatorId>('mvola');
  const [transactionDone, setTransactionDone] = useState(false);

  const [showScanner, setShowScanner] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [statusLabel, setStatusLabel] = useState('Placez le numéro dans le cadre');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [detectedNumber, setDetectedNumber] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const progressAnim = useRef(new Animated.Value(0.05)).current;

  const FRAME_WIDTH = width * 0.75;
  const FRAME_HEIGHT = FRAME_WIDTH * 0.58;

  const operators: { id: OperatorId, name: string, color: string }[] = [
    { id: 'mvola', name: 'MVola', color: '#e6e200ff' }, 
    { id: 'orange', name: 'Orange', color: '#FF7900' },
    { id: 'airtel', name: 'Airtel', color: '#ED1C24' },
  ];

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  const animateTo = (target: number, duration: number) =>
    new Promise<void>(resolve =>
      Animated.timing(progressAnim, {
        toValue: target,
        duration,
        useNativeDriver: false,
      }).start(() => resolve())
    );

  const resetProgress = () => {
    progressAnim.setValue(0.05);
    setStatusLabel('Placez le numéro dans le cadre');
  };

  const runOCRAnalysis = async (uri: string) => {
    setLoading(true);
    triggerVibration('light');

    try {
      for (const step of PROGRESS_STEPS) {
        setStatusLabel(step.label);
        await animateTo(step.target, step.duration);
      }

      let processedUri = uri;

      if (ImageManipulator && ImageManipulator.manipulateAsync) {
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width: 800 } }],
          { compress: 0.9, format: 'jpeg' }
        );
        processedUri = manipulatedImage.uri;
      }

      if (!recognizeText) {
        const { default: TextRecognition } = await import('@react-native-ml-kit/text-recognition');
        const result = await TextRecognition.recognize(processedUri);
        const fullText = result.text;

        if (!fullText || fullText.trim() === '') {
          await animateTo(1, 200);
          Alert.alert('Texte non détecté', 'Aucun texte n\'a été trouvé. Veuillez réessayer.');
          resetProgress();
          return;
        }

        const cleaned = fullText.replace(/[\s\-]/g, '');
        const codeMatch = cleaned.match(/03\d{8}/);
        const code = codeMatch ? codeMatch[0] : null;

        if (!code) {
          await animateTo(1, 200);
          Alert.alert(
            'Numéro non détecté',
            `Texte lu: "${fullText}"\n\nAucun numéro commençant par 03 et comportant 10 chiffres trouvé. Veuillez centrer le numéro et réessayer.`
          );
          resetProgress();
          return;
        }

        setCashPoint(code);
        setShowScanner(false);

        triggerVibration('success');
        setLoading(false);
        return;
      }

      const result = await recognizeText(processedUri);
      const fullText = result.text;

      if (!fullText || fullText.trim() === '') {
        await animateTo(1, 200);
        Alert.alert('Texte non détecté', 'Aucun texte n\'a été trouvé. Veuillez réessayer.');
        resetProgress();
        return;
      }

      const cleaned = fullText.replace(/[\s\-]/g, '');
      const codeMatch = cleaned.match(/03\d{8}/);
      const code = codeMatch ? codeMatch[0] : null;

      if (!code) {
        await animateTo(1, 200);
        Alert.alert(
          'Numéro non détecté',
          `Texte lu: "${fullText}"\n\nAucun numéro commençant par 03 et comportant 10 chiffres trouvé. Veuillez centrer le numéro et réessayer.`
        );
        resetProgress();
        return;
      }

      setCashPoint(code);
      setShowScanner(false);

      triggerVibration('success');

    } catch (error) {
      console.error('OCR Error:', error);
      resetProgress();
      const errorMessage = error.message || JSON.stringify(error);
      Alert.alert("Erreur OCR", `Erreur: ${errorMessage}\nRéessayez.`);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    triggerVibration('light');
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      triggerVibration('error');
      Alert.alert('Permission refusée', "L'accès à la galerie est requis.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      await runOCRAnalysis(uri);
    }
  };

  const captureFromCamera = async () => {
    if (isCapturing) return;
    setIsCapturing(true);
    triggerVibration('light');

    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        triggerVibration('error');
        Alert.alert('Permission refusée', "L'accès à la caméra est requis.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        await runOCRAnalysis(uri);
      }
    } finally {
      setIsCapturing(false);
    }
  };

  const handleReset = () => {
    triggerVibration('light');
    setDetectedNumber(null);
    setImageUri(null);
    setShowScanner(false);
    resetProgress();
  };

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

  if (showScanner) {
    if (!permission || !permission.granted) {
      return <View style={[styles.container, { backgroundColor: theme.background }]} />;
    }

    const progressWidth = progressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    });
    const progressColor = theme.tint;

    return (
      <View style={localStyles.container}>
        <View style={localStyles.cameraLayer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={localStyles.fullPreviewImage} resizeMode="cover" />
          ) : (
            <CameraView style={localStyles.camera} facing="back" />
          )}
        </View>

        <SafeAreaContext style={localStyles.mainOverlay} edges={['top', 'bottom']}>
          <TouchableOpacity
            style={localStyles.floatingNavButton}
            onPress={() => {
              triggerVibration('light');
              if (imageUri) {
                handleReset();
              } else {
                setShowScanner(false);
              }
            }}
          >
            <Ionicons name={imageUri ? 'close' : 'arrow-back'} size={28} color="#FFF" />
          </TouchableOpacity>

          <View style={localStyles.scanContainer}>
            <View style={[localStyles.frame, {
              width: FRAME_WIDTH,
              height: FRAME_HEIGHT,
              borderColor: 'rgba(255,255,255,0.2)',
            }]}>
              <View style={[localStyles.corner, localStyles.cornerTL, { borderColor: theme.tint }]} />
              <View style={[localStyles.corner, localStyles.cornerTR, { borderColor: theme.tint }]} />
              <View style={[localStyles.corner, localStyles.cornerBL, { borderColor: theme.tint }]} />
              <View style={[localStyles.corner, localStyles.cornerBR, { borderColor: theme.tint }]} />
            </View>
          </View>

          <View style={[localStyles.footerWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={localStyles.footerInner}>
              <View style={localStyles.statusBox}>
                <Text style={[localStyles.label, { color: theme.textSecondary }]}>SCAN CASHPOINT</Text>
                <Text style={[localStyles.status, { color: theme.text }]} numberOfLines={1}>
                  {statusLabel}
                </Text>
              </View>

              <View style={[localStyles.progressBg, { backgroundColor: theme.border }]}>
                <Animated.View style={[
                  localStyles.progressFill,
                  { width: progressWidth, backgroundColor: progressColor },
                ]} />
              </View>

              <View style={localStyles.actionRow}>
                {detectedNumber ? (
                  <TouchableOpacity
                    style={[localStyles.galleryButton, { backgroundColor: theme.background, borderColor: theme.border }]}
                    onPress={handleReset}
                  >
                    <Ionicons name="refresh-outline" size={26} color={theme.text} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[localStyles.galleryButton, { backgroundColor: theme.background, borderColor: theme.border }]}
                    onPress={pickImage}
                    disabled={loading}
                  >
                    <Ionicons name="images-outline" size={26} color={theme.text} />
                  </TouchableOpacity>
                )}

                {detectedNumber ? (
                  <TouchableOpacity
                    style={[localStyles.ussdButton, { backgroundColor: theme.tint }]}
                    onPress={() => {
                      triggerVibration('light');
                      handleReset();
                    }}
                  >
                    <Ionicons name="checkmark" size={22} color="#000" />
                    <Text style={localStyles.ussdCode} numberOfLines={1}>
                      {detectedNumber}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={[localStyles.mainButton, { backgroundColor: theme.tint }]}
                    onPress={captureFromCamera}
                    disabled={loading}
                  >
                    {loading || isCapturing
                      ? <ActivityIndicator color="#000" size="small" />
                      : <Ionicons name="camera-outline" size={22} color="#000" />
                    }
                    <Text style={localStyles.mainButtonText}>
                      {loading || isCapturing ? '' : t('withdrawal.scan')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </SafeAreaContext>
      </View>
    );
  }

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
          <Text style={[styles.headerTitle, { textAlign: 'center' }]}>{t('common.successSent')}</Text>
          <Text style={{ color: theme.textSecondary, textAlign: 'center', fontSize: 14 }}>
            {t('common.amountLabel')} {parseInt(amount).toLocaleString()} {t('common.ar')}{`\n`}{t('common.cashPointLabel')} {cashPoint}
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
            <Text style={styles.actionButtonText}>{t('common.newTransaction')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }]}
            onPress={() => { triggerVibration('light'); router.back(); }}
          >
            <Text style={[styles.actionButtonText, { color: theme.text }]}>{t('common.backHome')}</Text>
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
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => {
                triggerVibration('light');
                setShowScanner(true);
              }}
            >
              <Ionicons name="scan-outline" size={22} color={theme.text} />
              <Text style={styles.scanButtonText}>{t('withdrawal.scan')}</Text>
            </TouchableOpacity>
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

const localStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  cameraLayer: { ...StyleSheet.absoluteFillObject, zIndex: 0 },
  camera: { flex: 1 },
  fullPreviewImage: { flex: 1 },
  mainOverlay: { flex: 1, zIndex: 1, justifyContent: 'space-between' },
  floatingNavButton: {
    position: 'absolute', top: 20, left: 20, zIndex: 10,
    padding: 12, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 18,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  scanContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  frame: { position: 'relative', justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  corner: { position: 'absolute', width: 30, height: 30, borderWidth: 5 },
  cornerTL: { top: -5, left: -5, borderBottomWidth: 0, borderRightWidth: 0, borderTopLeftRadius: 15 },
  cornerTR: { top: -5, right: -5, borderBottomWidth: 0, borderLeftWidth: 0, borderTopRightRadius: 15 },
  cornerBL: { bottom: -5, left: -5, borderTopWidth: 0, borderRightWidth: 0, borderBottomLeftRadius: 15 },
  cornerBR: { bottom: -5, right: -5, borderTopWidth: 0, borderLeftWidth: 0, borderBottomRightRadius: 15 },
  footerWrapper: {
    borderTopLeftRadius: 35, borderTopRightRadius: 35, borderTopWidth: 1,
    paddingBottom: Platform.OS === 'android' ? 20 : 0,
  },
  footerInner: { padding: 25 },
  statusBox: { marginBottom: 12 },
  label: { fontSize: 9, fontWeight: '900', marginBottom: 4 },
  status: { fontSize: 18, fontWeight: 'bold' },
  progressBg: { height: 4, borderRadius: 2, marginBottom: 25 },
  progressFill: { height: 4, borderRadius: 2 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  galleryButton: {
    width: 60, height: 60, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1,
  },
  mainButton: {
    flex: 1, height: 60, borderRadius: 18, flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center', gap: 10,
  },
  mainButtonText: { color: '#000', fontWeight: '900', fontSize: 14 },
  ussdButton: {
    flex: 1, height: 60, borderRadius: 18, flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center', gap: 8,
    paddingHorizontal: 14,
  },
  ussdCode: {
    color: '#000', fontWeight: '900', fontSize: 15,
    letterSpacing: 0.5, flexShrink: 1,
  },
});