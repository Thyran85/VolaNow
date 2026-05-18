import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, Image, ActivityIndicator, StyleSheet, Animated, Platform, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView as SafeAreaContext } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useVibration } from '@/context/VibrationContext';
import { useAppTheme } from '@/context/ThemeContext';

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

interface WithdrawalScannerProps {
  onClose: () => void;
  onCodeDetected: (code: string) => void;
}

export default function WithdrawalScanner({ onClose, onCodeDetected }: WithdrawalScannerProps) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const { triggerVibration } = useVibration();
  const { width } = useWindowDimensions();

  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [statusLabel, setStatusLabel] = useState('Placez le numéro dans le cadre');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [detectedNumber, setDetectedNumber] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const cameraRef = useRef<any>(null);
  const progressAnim = useRef(new Animated.Value(0.05)).current;

  const FRAME_WIDTH = width * 0.75;
  const FRAME_HEIGHT = FRAME_WIDTH * 0.58;

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

        onCodeDetected(code);
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

      onCodeDetected(code);
      triggerVibration('success');

    } catch (error) {
      console.error('OCR Error:', error);
      resetProgress();
      const errorMessage = error instanceof Error ? error.message : String(error);
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

  if (!permission || !permission.granted) {
    return <View style={[localStyles.container, { backgroundColor: theme.background }]} />;
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
          <CameraView ref={cameraRef} style={localStyles.camera} facing="back" />
        )}
      </View>

      <SafeAreaContext style={localStyles.mainOverlay} edges={['top', 'bottom']}>
        <TouchableOpacity
          style={localStyles.floatingNavButton}
          onPress={() => {
            triggerVibration('light');
            if (imageUri) {
              setImageUri(null);
              resetProgress();
            } else {
              onClose();
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
                  onPress={() => {
                    triggerVibration('light');
                    setImageUri(null);
                    setDetectedNumber(null);
                    resetProgress();
                  }}
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
                    onClose();
                  }}
                >
                  <Ionicons name="checkmark" size={22} color="#000" />
                  <Text style={localStyles.ussdCode} numberOfLines={1}>
                    {detectedNumber}
                  </Text>
                </TouchableOpacity>
              ) : imageUri && !loading ? (
                <TouchableOpacity
                  style={[localStyles.mainButton, { backgroundColor: '#ED1C24' }]}
                  onPress={() => {
                    triggerVibration('light');
                    setImageUri(null);
                    resetProgress();
                  }}
                >
                  <Ionicons name="refresh-outline" size={22} color="#FFF" />
                  <Text style={[localStyles.mainButtonText, { color: '#FFF' }]}>
                    {t('recharge.retry') || 'Réessayer'}
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
