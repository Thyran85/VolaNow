import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, Image, Linking,
  ActivityIndicator, useWindowDimensions, Platform, Alert, Animated
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useVibration } from '@/context/VibrationContext';
import { useAppTheme } from '@/context/ThemeContext';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';

// ─── Opérateurs avec format USSD correct ─────────────────────────────────────
// Telma  → #321*CODE# (14 chiffres)
// Orange → *123*CODE# (14 chiffres)
// Airtel → *888*CODE# (15 chiffres - exceptionnel)
const OPERATORS = {
  telma: {
    name: 'Telma / Yas',
    color: '#CCFF00',
    ussd: (code: string) => `#321*${code}#`,
    logo: require('../../assets/images/logo/yas_logo.png'),
  },
  orange: {
    name: 'Orange',
    color: '#FF7900',
    ussd: (code: string) => `*123*${code}#`,
    logo: require('../../assets/images/logo/orange_logo.png'),
  },
  airtel: {
    name: 'Airtel',
    color: '#ED1C24',
    ussd: (code: string) => `*888*${code}#`,
    logo: require('../../assets/images/logo/airtel_logo.png'),
  },
};

const PROGRESS_STEPS = [
  { label: "Chargement de l'image...", target: 0.2,  duration: 400 },
  { label: 'Analyse en cours...',      target: 0.5,  duration: 700 },
  { label: 'Extraction du code...',    target: 0.8,  duration: 600 },
  { label: 'Finalisation...',          target: 0.95, duration: 400 },
];

export default function RechargePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const { triggerVibration } = useVibration();
  const { width } = useWindowDimensions();

  const [permission, requestPermission] = useCameraPermissions();
  const [detectedOp, setDetectedOp]           = useState<any>(null);
  const [loading, setLoading]                 = useState(false);
  const [statusLabel, setStatusLabel]         = useState('Placez la carte dans le cadre');
  const [imageUri, setImageUri]               = useState<string | null>(null);
  const [transactionDone, setTransactionDone] = useState(false);
  const [detectedCode, setDetectedCode]       = useState<string | null>(null);
  const [ussdCode, setUssdCode]               = useState<string | null>(null);
  const [isCapturing, setIsCapturing]         = useState(false);

  const cameraRef = useRef<any>(null);
  const progressAnim = useRef(new Animated.Value(0.05)).current;

  const FRAME_WIDTH  = width * 0.75;
  const FRAME_HEIGHT = FRAME_WIDTH * 0.58;

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  // ── Progress ──────────────────────────────────────────────────────────────
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
    setStatusLabel('Placez la carte dans le cadre');
  };

  // ── OCR (remplacé par ML Kit en bare workflow) ─────────────────
  const runOCRAnalysis = async (uri: string) => {
    setLoading(true);
    triggerVibration('light');

    try {
      for (const step of PROGRESS_STEPS) {
        setStatusLabel(step.label);
        await animateTo(step.target, step.duration);
      }

      //  OCR avec ML Kit ─────────────────────────────────────────────────
      const result = await TextRecognition.recognize(uri);
      const fullText = result.text;
      // ────────────────────────────────────────────────────────────────────

      // Détection opérateur d'abord (pour choisir le bon nombre de chiffres)
      const upper = fullText.toUpperCase();
      let operatorKey: keyof typeof OPERATORS = 'telma';
      
      // Airtel : détecté par *888* ou RAHA (spécifique à Airtel Madagascar)
      if (upper.includes('*888*') || upper.includes('RAHA CREDIT') || upper.includes('RAHA INTERNET') || upper.includes('LAHARAN')) {
        operatorKey = 'airtel';
      }
      // Orange : détecté par ORANGE ou MVOLA
      else if (upper.includes('ORANGE') || upper.includes('MVOLA')) {
        operatorKey = 'orange';
      }
      // Telma/Yas : YAS, KIKISO, ou par défaut
      else if (upper.includes('YAS') || upper.includes('KIKISO') || upper.includes('MORAMORA')) {
        operatorKey = 'telma';
      }

      // Extraction du code - on cherche toutes les séquences de chiffres
      // Puis on prend celle qui correspond à la longueur attendue
      const codeLength = operatorKey === 'airtel' ? 15 : 14;
      
      // Trouver toutes les séquences de chiffres (en ignorant espaces et tirets)
      const lines = fullText.split('\n');
      let code: string | null = null;
      
      for (const line of lines) {
        const cleanedLine = line.replace(/[\s\-]/g, '');
        const match = cleanedLine.match(/(\d+)/);
        if (match && match[1].length === codeLength) {
          code = match[1];
          break;
        }
      }
      
      // Si pas trouvé ligne par ligne, chercher dans tout le texte
      if (!code) {
        const allDigits = fullText.replace(/[\s\-]/g, '');
        const codeMatch = allDigits.match(new RegExp(`(\\d{${codeLength}})`));
        code = codeMatch ? codeMatch[1] : null;
      }

      if (!code) {
        await animateTo(1, 200);
        Alert.alert('Code non détecté', 'Veuillez bien centrer la carte et réessayer.');
        resetProgress();
        return;
      }

      const op = OPERATORS[operatorKey];

      // Construction du code USSD avec le bon format selon l'opérateur
      // Telma  → #321*34025870796876#
      // Orange → *123*34025870796876#
      // Airtel → *888*693219962413722#
      const formatted = op.ussd(code);

      setDetectedCode(code);
      setDetectedOp(op);
      setUssdCode(formatted);

      setStatusLabel('Code détecté ✓');
      await animateTo(1, 300);
      triggerVibration('success');

    } catch (error) {
      console.error('OCR Error:', error);
      resetProgress();
      Alert.alert("Erreur d'analyse", 'Impossible de lire la carte.\nRéessayez avec une meilleure lumière.');
    } finally {
      setLoading(false);
    }
  };

  // ── Galerie ───────────────────────────────────────────────────────────────
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

  // ── Capture Photo In-App ──────────────────────────────────────────────────
  const captureFromCamera = async () => {
    if (isCapturing || !cameraRef.current) return;
    setIsCapturing(true);
    triggerVibration('light');

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.85,
      });

      if (photo && photo.uri) {
        setImageUri(photo.uri);
        await runOCRAnalysis(photo.uri);
      }
    } catch (error) {
      console.error('In-app Capture Error:', error);
      Alert.alert('Erreur', 'Impossible de capturer la photo depuis la caméra.');
    } finally {
      setIsCapturing(false);
    }
  };

  // ── Lancement USSD direct (sans ouvrir l'app téléphone) ──────────────────
  const handleUssdPress = () => {
    if (!ussdCode || !detectedOp) return;
    triggerVibration('success');
    
    try {
      if (Platform.OS === 'android') {
        RNImmediatePhoneCall.immediatePhoneCall(ussdCode);
      } else {
        Linking.openURL(`tel:${ussdCode}`);
      }
      setTransactionDone(true);
    } catch (error) {
      console.error('USSD Error:', error);
      Alert.alert('Erreur', 'Impossible d\'exécuter le code USSD');
    }
  };

  // ── Reset complet ─────────────────────────────────────────────────────────
  const handleReset = () => {
    triggerVibration('light');
    setDetectedOp(null);
    setImageUri(null);
    setDetectedCode(null);
    setUssdCode(null);
    setTransactionDone(false);
    resetProgress();
  };

  if (!permission || !permission.granted) {
    return <View style={[styles.container, { backgroundColor: theme.background }]} />;
  }

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });
  const progressColor = detectedOp ? detectedOp.color : theme.tint;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {transactionDone ? (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
            gap: 20,
            width: '100%',
          }}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: '#CCFF0030',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons name="checkmark-circle" size={56} color="#86D12E" />
            </View>

            <Text style={{ color: theme.text, fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>
              {t('recharge.successSent') || "Recharge envoyée !"}
            </Text>
            
            <Text style={{ color: theme.textSecondary, textAlign: 'center', fontSize: 14 }}>
              {t('recharge.successHelp')}
            </Text>

            <TouchableOpacity
              style={[styles.mainButton, { backgroundColor: theme.tint, marginTop: 12, width: '100%', flex: 0 }]}
              onPress={handleReset}
            >
              <Ionicons name="refresh-outline" size={22} color="#000" />
              <Text style={styles.mainButtonText}>{t('recharge.scanAnother')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.mainButton, {
                backgroundColor: theme.surface,
                borderWidth: 1,
                borderColor: theme.border,
                width: '100%',
                flex: 0,
              }]}
              onPress={() => { triggerVibration('light'); router.back(); }}
            >
              <Text style={[styles.mainButtonText, { color: theme.text }]}>{t('common.backHome')}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      ) : (
        <>
          {/* 1. ARRIÈRE-PLAN */}
          <View style={styles.cameraLayer}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.fullPreviewImage} resizeMode="cover" />
            ) : (
              <CameraView ref={cameraRef} style={styles.camera} facing="back" />
            )}
          </View>

          {/* 2. COUCHE UI */}
          <SafeAreaView style={styles.mainOverlay} edges={['top', 'bottom']}>
            {/* BOUTON RETOUR FLOTTANT */}
            <TouchableOpacity
              style={styles.floatingNavButton}
              onPress={() => {
                triggerVibration('light');
                if (imageUri) {
                  setImageUri(null);
                  setDetectedOp(null);
                  setDetectedCode(null);
                  setUssdCode(null);
                  resetProgress();
                } else {
                  router.back();
                }
              }}
            >
              <Ionicons name={imageUri ? 'close' : 'arrow-back'} size={28} color="#FFF" />
            </TouchableOpacity>

            {/* CADRE DE SCAN */}
            <View style={styles.scanContainer}>
              <View style={[styles.frame, {
                width: FRAME_WIDTH,
                height: FRAME_HEIGHT,
                borderColor: detectedOp ? detectedOp.color : 'rgba(255,255,255,0.2)',
              }]}>
                <View style={[styles.corner, styles.cornerTL, { borderColor: detectedOp ? detectedOp.color : theme.tint }]} />
                <View style={[styles.corner, styles.cornerTR, { borderColor: detectedOp ? detectedOp.color : theme.tint }]} />
                <View style={[styles.corner, styles.cornerBL, { borderColor: detectedOp ? detectedOp.color : theme.tint }]} />
                <View style={[styles.corner, styles.cornerBR, { borderColor: detectedOp ? detectedOp.color : theme.tint }]} />

                {detectedOp && (
                  <View style={styles.detectedBadge}>
                    <Image source={detectedOp.logo} style={styles.miniLogo} resizeMode="contain" />
                    <Text style={styles.detectedText}>{detectedOp.name}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* FOOTER */}
            <View style={[styles.footerWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={styles.footerInner}>
                <View style={styles.statusBox}>
                  <Text style={[styles.label, { color: theme.textSecondary }]}>RECHARGE FLASH</Text>
                  <Text style={[styles.status, { color: theme.text }]} numberOfLines={1}>
                    {statusLabel}
                  </Text>
                </View>

                {/* Progress bar animée */}
                <View style={[styles.progressBg, { backgroundColor: theme.border }]}>
                  <Animated.View style={[
                    styles.progressFill,
                    { width: progressWidth, backgroundColor: progressColor },
                  ]} />
                </View>

                <View style={styles.actionRow}>
                  {/* Bouton reset/galerie à gauche */}
                  {detectedOp ? (
                    <TouchableOpacity
                      style={[styles.galleryButton, { backgroundColor: theme.background, borderColor: theme.border }]}
                      onPress={handleReset}
                    >
                      <Ionicons name="refresh-outline" size={26} color={theme.text} />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[styles.galleryButton, { backgroundColor: theme.background, borderColor: theme.border }]}
                      onPress={pickImage}
                      disabled={loading}
                    >
                      <Ionicons name="images-outline" size={26} color={theme.text} />
                    </TouchableOpacity>
                  )}

                  {/* Bouton principal : code USSD OU réessayer OU capturer */}
                  {ussdCode && detectedOp ? (
                    <TouchableOpacity
                      style={[styles.ussdButton, { backgroundColor: detectedOp.color }]}
                      onPress={handleUssdPress}
                      activeOpacity={0.75}
                    >
                      <Ionicons name="call" size={18} color="#000" />
                      <Text style={styles.ussdCode} numberOfLines={1} adjustsFontSizeToFit>
                        {ussdCode}
                      </Text>
                    </TouchableOpacity>
                  ) : imageUri && !loading ? (
                    <TouchableOpacity
                      style={[styles.mainButton, { backgroundColor: '#ED1C24' }]}
                      onPress={handleReset}
                    >
                      <Ionicons name="refresh-outline" size={22} color="#FFF" />
                      <Text style={[styles.mainButtonText, { color: '#FFF' }]}>
                        {t('recharge.retry') || 'Réessayer'}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[styles.mainButton, { backgroundColor: theme.tint }]}
                      onPress={captureFromCamera}
                      disabled={loading || isCapturing}
                    >
                      {loading || isCapturing
                        ? <ActivityIndicator color="#000" size="small" />
                        : <Ionicons name="scan-outline" size={22} color="#000" />
                      }
                      <Text style={styles.mainButtonText}>
                        {loading || isCapturing ? '' : t('recharge.detectBtn') || 'Détecter le code'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </SafeAreaView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:         { flex: 1, backgroundColor: '#000' },
  cameraLayer:       { ...StyleSheet.absoluteFillObject, zIndex: 0 },
  camera:            { flex: 1 },
  fullPreviewImage:  { flex: 1 },
  mainOverlay:       { flex: 1, zIndex: 1, justifyContent: 'space-between' },
  floatingNavButton: {
    position: 'absolute', top: 20, left: 20, zIndex: 10,
    padding: 12, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 18,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  scanContainer:     { flex: 1, justifyContent: 'center', alignItems: 'center' },
  frame:             { position: 'relative', justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  corner:            { position: 'absolute', width: 30, height: 30, borderWidth: 5 },
  cornerTL:          { top: -5, left: -5,    borderBottomWidth: 0, borderRightWidth: 0, borderTopLeftRadius: 15 },
  cornerTR:          { top: -5, right: -5,   borderBottomWidth: 0, borderLeftWidth: 0,  borderTopRightRadius: 15 },
  cornerBL:          { bottom: -5, left: -5,  borderTopWidth: 0,    borderRightWidth: 0, borderBottomLeftRadius: 15 },
  cornerBR:          { bottom: -5, right: -5, borderTopWidth: 0,    borderLeftWidth: 0,  borderBottomRightRadius: 15 },
  detectedBadge:     {
    backgroundColor: 'rgba(0,0,0,0.8)', padding: 10, borderRadius: 15,
    alignItems: 'center', flexDirection: 'row', gap: 8,
  },
  miniLogo:          { width: 22, height: 22 },
  detectedText:      { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  footerWrapper:     {
    borderTopLeftRadius: 35, borderTopRightRadius: 35, borderTopWidth: 1,
    paddingBottom: Platform.OS === 'android' ? 20 : 0,
  },
  footerInner:       { padding: 25 },
  statusBox:         { marginBottom: 12 },
  label:             { fontSize: 9, fontWeight: '900', marginBottom: 4 },
  status:            { fontSize: 18, fontWeight: 'bold' },
  progressBg:        { height: 4, borderRadius: 2, marginBottom: 25 },
  progressFill:      { height: 4, borderRadius: 2 },
  actionRow:         { flexDirection: 'row', alignItems: 'center', gap: 15 },
  galleryButton:     {
    width: 60, height: 60, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1,
  },
  mainButton:        {
    flex: 1, height: 60, borderRadius: 18, flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center', gap: 10,
  },
  mainButtonText:    { color: '#000', fontWeight: '900', fontSize: 14 },
  ussdButton:        {
    flex: 1, height: 60, borderRadius: 18, flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center', gap: 8,
    paddingHorizontal: 14,
  },
  ussdCode:          {
    color: '#000', fontWeight: '900', fontSize: 15,
    letterSpacing: 0.5, flexShrink: 1,
  },
});
