import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, Image, 
  Linking, StatusBar, ActivityIndicator, useWindowDimensions, Platform 
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router'; 
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useVibration } from '@/context/VibrationContext';
import { useAppTheme } from '@/context/ThemeContext';

const OPERATORS = {
  telma: { name: 'Telma / Yas', color: '#CCFF00', prefix: '*321*', logo: require('../../assets/images/logo/yas_logo.png') },
  orange: { name: 'Orange', color: '#FF7900', prefix: '*141*', logo: require('../../assets/images/logo/orange_logo.png') },
  airtel: { name: 'Airtel', color: '#ED1C24', prefix: '*130*', logo: require('../../assets/images/logo/airtel_logo.png') }
};

export default function RechargePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { theme } = useAppTheme();
  const { triggerVibration } = useVibration();
  const { width, height } = useWindowDimensions();
  const [permission, requestPermission] = useCameraPermissions();
  const [detectedOp, setDetectedOp] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [transactionDone, setTransactionDone] = useState(false);

  // Calcul dynamique du cadre de scan
  const FRAME_WIDTH = width * 0.75; 
  const FRAME_HEIGHT = FRAME_WIDTH * 0.58;

  useEffect(() => { 
    if (!permission) requestPermission(); 
  }, [permission]);

  const runAIAnalysis = (type: keyof typeof OPERATORS) => {
    setLoading(true);
    triggerVibration('light');
    setTimeout(() => {
      setDetectedOp(OPERATORS[type]);
      setLoading(false);
      triggerVibration('success');
    }, 1500);
  };

  const pickImage = async () => {
    triggerVibration('light');
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        triggerVibration('error');
        alert(t('recharge.permissionError'));
        return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      runAIAnalysis('telma'); 
    }
  };

  if (!permission || !permission.granted) return <View style={[styles.container, { backgroundColor: theme.background }]} />;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* 1. ARRIÈRE-PLAN (IMAGE OU CAMÉRA OU SUCCÈS) */}
      <View style={styles.cameraLayer}>
        {transactionDone ? (
          <View style={{ flex: 1, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 20 }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#CCFF0030', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="checkmark-circle" size={56} color="#86D12E" />
            </View>
            <Text style={{ color: theme.text, fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>Recharge envoyée !</Text>
            <Text style={{ color: theme.textSecondary, textAlign: 'center', fontSize: 14 }}>
              L'appel USSD a été lancé avec succès.{`\n`}Vérifiez votre solde dans quelques instants.
            </Text>
            <TouchableOpacity
              style={[styles.mainButton, { backgroundColor: theme.tint, marginTop: 12, width: '100%' }]}
              onPress={() => {
                triggerVibration('light');
                setDetectedOp(null);
                setImageUri(null);
                setTransactionDone(false);
              }}
            >
              <Ionicons name="refresh-outline" size={22} color="#000" />
              <Text style={styles.mainButtonText}>Scanner un autre code</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.mainButton, { backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border, width: '100%' }]}
              onPress={() => { triggerVibration('light'); router.back(); }}
            >
              <Text style={[styles.mainButtonText, { color: theme.text }]}>Retour accueil</Text>
            </TouchableOpacity>
          </View>
        ) : imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.fullPreviewImage} resizeMode="cover" />
        ) : (
          <CameraView style={styles.camera} facing="back" />
        )}
      </View>

      {/* 2. COUCHE UI (BOUTON RETOUR + SCAN + FOOTER) */}
      <SafeAreaView style={styles.mainOverlay} edges={['top', 'bottom']}>
        
        {/* BOUTON RETOUR FLOTTANT */}
        <TouchableOpacity 
          style={styles.floatingNavButton} 
          onPress={() => {
              triggerVibration('light');
              imageUri ? setImageUri(null) : router.back();
          }}
        >
          <Ionicons name={imageUri ? "close" : "arrow-back"} size={28} color="#FFF" />
        </TouchableOpacity>

        {/* ZONE DU CADRE (Prend l'espace central) */}
        <View style={styles.scanContainer}>
          <View style={[styles.frame, { width: FRAME_WIDTH, height: FRAME_HEIGHT, borderColor: detectedOp ? detectedOp.color : 'rgba(255,255,255,0.2)' }]}>
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

        {!transactionDone && (
          <View style={[styles.footerWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.footerInner}>
              <View style={styles.statusBox}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>{t('recharge.title').toUpperCase()}</Text>
                <Text style={[styles.status, { color: theme.text }]} numberOfLines={1}>
                  {loading ? t('recharge.analyzing') : detectedOp ? t('recharge.codeReady') : t('recharge.placeCard')}
                </Text>
              </View>
              
              <View style={[styles.progressBg, { backgroundColor: theme.border }]}>
                <View style={[styles.progressFill, { 
                  width: loading ? '70%' : detectedOp ? '100%' : '5%', 
                  backgroundColor: detectedOp ? detectedOp.color : theme.tint 
                }]} />
              </View>

              <View style={styles.actionRow}>
                {detectedOp ? (
                  <TouchableOpacity 
                    style={[styles.galleryButton, { backgroundColor: theme.background, borderColor: theme.border }]} 
                    onPress={() => {
                      triggerVibration('light');
                      setDetectedOp(null);
                      setImageUri(null);
                    }}
                  >
                    <Ionicons name="refresh-outline" size={26} color={theme.text} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity 
                    style={[styles.galleryButton, { backgroundColor: theme.background, borderColor: theme.border }]} 
                    onPress={pickImage}
                  >
                    <Ionicons name="images-outline" size={26} color={theme.text} />
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                    style={[styles.mainButton, { backgroundColor: detectedOp ? detectedOp.color : theme.tint }]} 
                    onPress={() => {
                        if (!detectedOp) {
                            runAIAnalysis('orange');
                        } else {
                            triggerVibration('success');
                            const rechargeCode = "123456789012"; 
                            const ussdString = `tel:${detectedOp.prefix}${rechargeCode}#`;
                            Linking.openURL(ussdString);
                            setTransactionDone(true);
                        }
                    }}
                >
                  {loading ? <ActivityIndicator color="#000" size="small" /> : <Ionicons name={detectedOp ? "call" : "scan-outline"} size={22} color="#000" />}
                  <Text style={styles.mainButtonText}>{loading ? "" : detectedOp ? t('recharge.rechargeBtn') : t('recharge.detectBtn')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  cameraLayer: { ...StyleSheet.absoluteFillObject, zIndex: 0 },
  camera: { flex: 1 },
  fullPreviewImage: { flex: 1 },
  mainOverlay: { flex: 1, zIndex: 1, justifyContent: 'space-between' },

  floatingNavButton: { 
    position: 'absolute', 
    top: 20, 
    left: 20, 
    zIndex: 10, 
    padding: 12, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  scanContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  frame: { position: 'relative', justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  corner: { position: 'absolute', width: 30, height: 30, borderWidth: 5 },
  cornerTL: { top: -5, left: -5, borderBottomWidth: 0, borderRightWidth: 0, borderTopLeftRadius: 15 },
  cornerTR: { top: -5, right: -5, borderBottomWidth: 0, borderLeftWidth: 0, borderTopRightRadius: 15 },
  cornerBL: { bottom: -5, left: -5, borderTopWidth: 0, borderRightWidth: 0, borderBottomLeftRadius: 15 },
  cornerBR: { bottom: -5, right: -5, borderTopWidth: 0, borderLeftWidth: 0, borderBottomRightRadius: 15 },

  detectedBadge: { backgroundColor: 'rgba(0,0,0,0.8)', padding: 10, borderRadius: 15, alignItems: 'center', flexDirection: 'row', gap: 8 },
  miniLogo: { width: 22, height: 22 },
  detectedText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },

  footerWrapper: {
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'android' ? 20 : 0,
  },
  footerInner: {
    padding: 25,
  },
  statusBox: { marginBottom: 12 },
  label: { fontSize: 9, fontWeight: '900', marginBottom: 4 },
  status: { fontSize: 18, fontWeight: 'bold' },
  progressBg: { height: 4, borderRadius: 2, marginBottom: 25 },
  progressFill: { height: 4, borderRadius: 2 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  galleryButton: { width: 60, height: 60, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  mainButton: { flex: 1, height: 60, borderRadius: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  mainButtonText: { color: '#000', fontWeight: '900', fontSize: 14 }
});
